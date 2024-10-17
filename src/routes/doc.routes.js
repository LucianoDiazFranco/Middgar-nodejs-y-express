import { Router } from 'express';
import multer from 'multer';
import { join } from 'path';
import { unlink } from 'fs/promises';



const router = Router();

// ** Configuración de Multer para manejar la carga de archivos **
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// ** Ruta para cargar archivos **
router.post('/upload', upload.array('pdfs', 10), async (req, res) => {
    if (!req.files) {
        return res.status(400).send('No se subió ningún archivo.');
    }

    try {
        for (const file of req.files) {
            const fileName = file.originalname;

            // Guardar la información del archivo en MySQL
            await pool.query('INSERT INTO archivos (nombre_archivo) VALUES (?)', [fileName]);
        }
        res.send('Archivos cargados y guardados exitosamente.');
    } catch (error) {
        console.error('Error al subir archivo y guardar en base de datos:', error);
        res.status(500).send('Error al guardar la información del archivo.');
    }
});

// ** Ruta para listar archivos desde la base de datos **
router.get('/list-pdfs', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre_archivo, fecha_subida FROM archivos');
        res.json(rows);
        console.log(rows);
    } catch (error) {
        console.error('Error al listar archivos:', error);
        res.status(500).json({ error: 'Error al obtener archivos desde la base de datos' });
    }
});

// ** Ruta para eliminar un archivo **
router.delete('/delete-pdf/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Obtener el nombre del archivo desde la base de datos
        const [result] = await pool.query('SELECT nombre_archivo FROM archivos WHERE id = ?', [id]);
        const fileName = result[0].nombre_archivo;
        const filePath = join('uploads', fileName);

        // Eliminar del sistema de archivos
        await unlink(filePath);

        // Eliminar de la base de datos
        await pool.query('DELETE FROM archivos WHERE id = ?', [id]);

        res.status(200).send(`Archivo ${fileName} eliminado.`);
    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        res.status(500).json({ error: 'Error al eliminar el archivo' });
    }
});

export default router;