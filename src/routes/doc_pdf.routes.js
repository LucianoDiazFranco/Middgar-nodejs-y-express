// doc_pdf.routes.js
import { Router } from 'express';
import multer from 'multer';
import { join } from 'path';
import fs from 'fs';
import { unlink } from 'fs/promises';

const router = Router();
const uploadsDir = join(process.cwd(), 'uploads');  // Ruta a la carpeta 'uploads'

// Configuración de Multer para cargar archivos PDF
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Ruta para subir archivos
router.post('/upload', upload.array('pdfs', 10), (req, res) => {
    if (!req.files) {
        return res.status(400).send('No se subió ningún archivo.');
    }
    res.send('Archivos cargados y guardados exitosamente.');
});

// Ruta para listar archivos PDF en la carpeta 'uploads'
router.get('/list-pdfs', (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer la carpeta de archivos' });
        }
        const pdfFiles = files.filter(file => file.endsWith('.pdf'));
        res.json(pdfFiles);
    });
});

// Ruta para eliminar un archivo PDF
router.delete('/delete-pdf/:filename', async (req, res) => {
    const filename = req.params.filename;
    const filePath = join(uploadsDir, filename);

    try {
        await unlink(filePath);
        res.status(200).send(`Archivo ${filename} eliminado.`);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el archivo' });
    }
});

export default router;
