import express from "express"
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import {join, dirname, extname}  from "path";
import { fileURLToPath } from "url";
import personasRoutes from './routes/personas.routes.js'
import routes from './routes/routes.js'

//Inicialization
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//Settings
app.set("port", process.env.PORT || 3000);
app.set("views", join(__dirname, "views"));
app.engine('.hbs', engine({
    defaultLayout: "main",
    layoutsDir: join(app.get("views"), "layouts"),
    partialsDir: join(app.get("views"), "partials"),
    extname: '.hbs' 
}));
app.set('view engine', '.hbs');

//MiddLewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(cookieParser());

//Routes
app.get('/', (req, res)=>{
    res.render('paginas/inicio_secion');
})

app.use(personasRoutes);
app.use(routes);
//Public Files
app.use(express.static(join(__dirname + '/public')));

//Run Server
app.listen(app.get("port"), ()=>
    console.log("Server listening on port", app.get("port")));