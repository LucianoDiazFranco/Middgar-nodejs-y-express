// docUser.routes.js
import { Router } from 'express';
import multer from 'multer';
import { join } from 'path';
import pool from '../database.js';
import fs from 'fs';

const router = Router();
const uploadDir = join(process.cwd(), 'uploads'); // Directorio de carga



// Configuración de Multer para cargar archivos PDF
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const newFileName = file.originalname; 
        cb(null, newFileName);
    }
});
const upload = multer({ storage });

// Ruta para mostrar los documentos de un usuario
router.get('/documentosUsuario/:dni', async (req, res) => {
    const { dni } = req.params;
    try {
        const [documents] = await pool.query('SELECT * FROM documentosUsuario WHERE dni = ?', [dni]);
        res.render('paginas/documentosUsuario', { documents, dni, hideFooter: true }); // Pasas el `dni` como variable al renderizar
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los documentos del usuario' });
    }
});

// Ruta para cargar un nuevo documento para un usuario específico
router.post('/usuario/:dni/documentos/upload', upload.single('documento'), async (req, res) => {
    const { dni } = req.params;
    const { filename } = req.file;

    try {
        await pool.query('INSERT INTO documentosUsuario (dni, nombre_documento) VALUES (?, ?)', [dni, filename]);
        res.redirect(`/documentosUsuario/${dni}`);
    } catch (err) {
        res.status(500).json({ message: 'Error al cargar el documento' });
    }
});

// Ruta para eliminar un documento específico de un usuario
router.delete('/usuario/:dni/documentos/:id', async (req, res) => {
    const { dni, id } = req.params;
    try {
        const [[document]] = await pool.query('SELECT nombre_documento FROM documentosUsuario WHERE id = ?', [id]);
        const filePath = join(uploadDir, document.nombre_documento);

        // Eliminar archivo del sistema de archivos
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Eliminar registro de la base de datos
        await pool.query('DELETE FROM documentosUsuario WHERE id = ?', [id]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el documento' });
    }
});

router.post('/documentosUsuario/:dni/redirectToRama', async (req, res) => {
    const { dni } = req.params;
    try {
        // Obtener la rama del usuario a partir de su DNI
        const [[user]] = await pool.query('SELECT Rama FROM persona WHERE DNI = ?', [dni]);

        if (!user) {
            return res.redirect('/'); // Redirigir a la página de inicio si no se encuentra el usuario
        }

        // Redirigir según la rama del usuario
        switch (user.Rama) {
            case 'Manada':
                res.redirect('/listManada');
                break;
            case 'Unidad':
                res.redirect('/lista');
                break;
            case 'Caminantes':
                res.redirect('/listaCaminantes');
                break;
            case 'Rovers':
                res.redirect('/listaRovers');
                break;
            default:
                res.redirect('/'); // Redirigir a la página de inicio si la rama no coincide
                break;
        }
    } catch (err) {
        console.error('Error al redirigir según la rama:', err);
        res.status(500).json({ message: 'Error al redirigir a la rama correspondiente' });
    }
});


export default router;
