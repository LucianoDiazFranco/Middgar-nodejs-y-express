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
        const date = new Date().toISOString().split('T')[0];
        const newFileName = `${date}-${file.originalname}`;
        cb(null, newFileName);
    }
});
const upload = multer({ storage });

// Ruta para mostrar los documentos de un usuario
router.get('/documentosUsuario/:dni', async (req, res) => {
    const { dni } = req.params;
    try {
        const [documents] = await pool.query('SELECT * FROM documentosUsuario WHERE dni = ?', [dni]);
        res.render('paginas/documentosUsuario', { documents, dni });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los documentos del usuario' });
    }
});

// Ruta para cargar un nuevo documento para un usuario específico
router.post('/usuario/:dni/documentos/upload', upload.single('documento'), async (req, res) => {
    const { dni } = req.params;
    const { filename } = req.file;

    try {
        await pool.query('INSERT INTO documentosUsuario (dni, nombre_documento) VALUES (?, ?)', [dni, filename]);
        res.redirect(`paginas/documentosUsuario/${dni}`);
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

export default router;
