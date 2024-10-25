import express from "express";
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import session from 'express-session';
import bodyParser from 'body-parser';
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import multer from "multer";
import { unlink } from 'fs/promises';
import routes from './routes/routes.js';
import personasRoutes from './routes/personas.routes.js';
import docRoutes from './routes/doc.routes.js';
import loginRoutes from './routes/login.routes.js';

// Inicialización 
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(__dirname, '..', 'uploads');

// Configuración del puerto
app.set("port", process.env.PORT || 3000);

// Configuración de vistas (Handlebars)
app.set("views", join(__dirname, "views"));
app.engine('.hbs', engine({
    defaultLayout: "main",
    layoutsDir: join(app.get("views"), "layouts"),
    partialsDir: join(app.get("views"), "partials"),
    extname: '.hbs',
    helpers: {
        json: function(context) {
            return JSON.stringify(context);
        }
    }
}));
app.set('view engine', '.hbs');

// Middleware para registrar solicitudes HTTP
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Ruta principal: Renderizar la página de inicio de sesión
app.get('/', (req, res) => {
    if (req.session.loggedin === true) {
        res.render('paginas/index', { name: req.session.name });
    } else {
        res.redirect('/inicio_secion');
    }
});

app.use(routes);
app.use(personasRoutes);
app.use(docRoutes);
app.use(loginRoutes);

// Servir archivos estáticos desde la carpeta 'uploads' y 'public'
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(join(__dirname, 'public')));

// Ejecutar servidor en el puerto definido
app.listen(app.get("port"), () =>
    console.log("Server listening on port", app.get("port"))
);

// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Carpeta donde se guardarán los PDFs
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);  // Cambiar el nombre del archivo para evitar conflictos
    }
});
const upload = multer({ storage: storage });

// Nueva Ruta: Cargar archivos
app.post('/upload', upload.array('pdfs', 10), (req, res) => {
    if (!req.files) {
        return res.status(400).send('No se subió ningún archivo.');
    }
    res.send('Archivos cargados y guardados exitosamente.');
});

// Ruta para listar archivos PDF en la carpeta uploads
app.get('/list-pdfs', (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer la carpeta de archivos' });
        }
        const pdfFiles = files.filter(file => file.endsWith('.pdf'));
        res.json(pdfFiles);
    });
});

// Ruta para eliminar un archivo PDF
app.delete('/delete-pdf/:filename', async (req, res) => {
    const filename = req.params.filename;
    const filePath = join(uploadsDir, filename);

    try {
        await unlink(filePath);  // Eliminar el archivo
        res.status(200).send(`Archivo ${filename} eliminado.`);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el archivo' });
    }
});
