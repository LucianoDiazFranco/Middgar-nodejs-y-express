// Imports
import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import personasRoutes from "./routes/personas.routes.js";
import multer from "multer";

// Inicialización
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(__dirname, 'uploads');

// Configuración del puerto
app.set("port", process.env.PORT || 3000);

// Configuración de vistas (Handlebars)
app.set("views", join(__dirname, "views"));
app.engine('.hbs', engine({
    defaultLayout: "main",
    layoutsDir: join(app.get("views"), "layouts"),
    partialsDir: join(app.get("views"), "partials"),
    extname: '.hbs',
}));
app.set('view engine', '.hbs');

// Middleware para registrar solicitudes HTTP
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ** Configuración de Multer para manejar la carga de archivos **
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Carpeta donde se guardarán los PDFs
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);  // Cambiar el nombre del archivo para evitar conflictos
    }
});
const upload = multer({ storage: storage });

// Ruta principal: Renderizar la página de inicio de sesión
app.get('/', (req, res) => {
    res.render('paginas/inicio_secion');
});

// ** Nueva Ruta: Cargar archivos **
app.post('/upload', upload.array('pdfs', 10), (req, res) => {
    if (!req.files) {
        return res.status(400).send('No se subió ningún archivo.');
    }
    res.send('Archivos cargados y guardados exitosamente.');
});

// ** Ruta para listar archivos PDF en la carpeta uploads **
app.get('/list-pdfs', (req, res) => {
    // Leer los archivos en la carpeta 'uploads'
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer la carpeta de archivos' });
        }
        // Filtrar solo archivos PDF
        const pdfFiles = files.filter(file => file.endsWith('.pdf'));
        res.json(pdfFiles);
    });
});

// Rutas para manejar otras funcionalidades (e.g. rutas de personas)
app.use(personasRoutes);

// Servir archivos estáticos desde la carpeta 'uploads' y 'public'
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(join(__dirname, 'public')));

// Ejecutar servidor en el puerto definido
app.listen(app.get("port"), () =>
    console.log("Server listening on port", app.get("port"))
);
