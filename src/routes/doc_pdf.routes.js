// doc_pdf.routes.js
import { Router } from 'express';
import multer from 'multer';
import { join } from 'path';
import { unlink } from 'fs/promises';
import fs from 'fs';
import pool from '../database.js';

const router = Router();
const uploadDir = join(process.cwd(), 'uploads'); // Directorio de carga

// Configuración de Multer para cargar archivos PDF
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const newFileName = file.originalname; // Almacenar solo el nombre original del archivo
        cb(null, newFileName);
    }
});
const upload = multer({ storage });

// Ruta para subir archivos
router.post('/upload', upload.array('pdfs', 10), async (req, res) => {
    try {
        const { rama } = req.body;

        for (const file of req.files) {
            await pool.query('INSERT INTO Doc_PDF (nombre, rama) VALUES (?, ?)', [file.originalname, rama]);
        }
        
        res.status(200).send('Archivos cargados y registrados en la base de datos exitosamente.');
    } catch (err) {
        console.error('Error al guardar en la base de datos:', err);
        res.status(500).send('Error al cargar archivos.');
    }
});

// Ruta para listar archivos PDF
router.get('/list-pdfs/:rama', async (req, res) => {
    const { rama } = req.params;
    try {
        const [documents] = await pool.query('SELECT nombre FROM Doc_PDF WHERE rama = ?', [rama]);
        const pdfFiles = documents.map(doc => doc.nombre);
        res.json(pdfFiles);
    } catch (error) {
        console.error('Error al obtener los archivos PDF:', error);
        res.status(500).json({ error: 'Error al obtener los archivos PDF' });
    }
});

// Ruta para eliminar un archivo PDF
router.delete('/delete-pdf/:filename', async (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = join(uploadDir, filename);

    try {
        if (fs.existsSync(filePath)) {
            await unlink(filePath);
            await pool.query('DELETE FROM Doc_PDF WHERE nombre = ?', [filename]);
            res.status(200).send(`Archivo ${filename} eliminado.`);
        } else {
            res.status(404).json({ error: 'Archivo no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el archivo:', error);
        res.status(500).json({ error: 'Error al eliminar el archivo' });
    }
});

export default router;
