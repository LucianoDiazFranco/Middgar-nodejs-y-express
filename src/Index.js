import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";
import { unlink } from "fs/promises";
import { PDFDocument, rgb } from "pdf-lib";
import bodyParser from "body-parser";

import personasRoutes from './routes/personas.routes.js';
import routes from './routes/routes.js'; 

// Inicialización 
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(__dirname, "uploads/planilla_riesgo");

// Configuración del puerto
app.set("port", process.env.PORT || 3000);

// Configuración de vistas (Handlebars)
app.set("views", join(__dirname, "views"));
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    layoutsDir: join(app.get("views"), "layouts"),
    partialsDir: join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Middlewares para registrar solicitudes HTTP
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Ruta principal: Renderizar la página de inicio de sesión
app.get("/", (req, res) => {
  res.render("paginas/inicio_secion");
});

// ** Configuración de Multer para manejar la carga de archivos **
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/planilla_riesgo"); // Carpeta donde se guardarán los PDFs
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Mantener el nombre original del archivo
  },
});
const upload = multer({ storage: storage });

// ** Ruta para crear un PDF y guardarlo en 'uploads/planilla_riesgo' **
app.post("/crear-pdf", async (req, res) => {
  try {
    const {
      fecha,
      lugar,
      beneficiarios,
      educadores,
      responsable,
      seguridad,
      accidente,
      otros_accidente,
    } = req.body;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 700]);

    const fontSize = 12;
    page.drawText(`Fecha de la actividad: ${fecha}`, { x: 50, y: 650, size: fontSize });
    page.drawText(`Lugar de la actividad: ${lugar}`, { x: 50, y: 630, size: fontSize });
    page.drawText(`Cantidad de beneficiarios: ${beneficiarios}`, { x: 50, y: 610, size: fontSize });
    page.drawText(`Cantidad de educadores: ${educadores}`, { x: 50, y: 590, size: fontSize });
    page.drawText(`Responsable: ${responsable}`, { x: 50, y: 570, size: fontSize });
    page.drawText(`Elementos de seguridad: ${seguridad}`, { x: 50, y: 550, size: fontSize });

    let accidenteText = "Accidente sucedido: ";
    accidenteText += Array.isArray(accidente) ? accidente.join(", ") : accidente;
    page.drawText(accidenteText, { x: 50, y: 530, size: fontSize });

    if (otros_accidente) {
      page.drawText(`Otros accidentes: ${otros_accidente}`, { x: 50, y: 510, size: fontSize });
    }

    const pdfBytes = await pdfDoc.save();

    // Verificar si la carpeta existe y crearla si es necesario
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `planilla_${fecha}_${Date.now()}.pdf`;
    const filePath = join(uploadsDir, filename);

    fs.writeFileSync(filePath, pdfBytes);

    res.status(200).send("PDF guardado exitosamente.");
  } catch (error) {
    console.error("Error al crear el PDF:", error);
    res.status(500).send("Error al crear el PDF");
  }
});

// ** Ruta para listar archivos PDF en la carpeta 'uploads/planilla_riesgo' **
app.get("/list-pdfs", (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Error al leer la carpeta de archivos" });
    }
    const pdfFiles = files.filter((file) => file.endsWith(".pdf"));
    res.json(pdfFiles);
  });
});

// ** Ruta para eliminar un archivo PDF **
app.delete("/delete-pdf/:filename", async (req, res) => {
  const filename = req.params.filename;
  const filePath = join(uploadsDir, filename);

  try {
    await unlink(filePath);
    res.status(200).send(`Archivo ${filename} eliminado.`);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el archivo" });
  }
});

app.use(routes);
app.use(personasRoutes);

// Servir archivos estáticos desde la carpeta 'uploads' y 'public'
app.use("/uploads", express.static(uploadsDir));
app.use(express.static(join(__dirname + "/public")));

// Ejecutar servidor en el puerto definido
app.listen(app.get("port"), () => {
  console.log("Server listening on port", app.get("port"));
});
