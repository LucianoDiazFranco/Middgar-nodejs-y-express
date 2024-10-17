import { Router } from 'express'
import pool from '../database.js'
import moment from 'moment';
import {methods as authentication} from "../controllers/authentication.controller.js"
import {methods as authorization} from "../middlewares/authorization.js"

const router = Router();

 
//rutas de las pantallas 
router.get('/',authorization.soloPublico, (req, res)=>{res.render('/')});
router.get('/manada', (req, res)=>{res.render('paginas/manada')});
router.get('/manada_add', (req, res)=>{res.render('paginas/manada_add')});
router.get('/unidad', (req, res)=>{res.render('paginas/unidad')});
router.get('/caminantes', (req, res)=>{res.render('paginas/caminantes')});
router.get('/rovers', (req, res)=>{res.render('paginas/rovers')});
router.get('/inicio_secion', (req, res)=>{res.render('paginas/inicio_secion')});
router.get('/registro',authorization.soloPublico, (req, res)=>{res.render('paginas/registro')});
router.get('/rec_password', (req, res)=>{res.render('paginas/rec_password')});
router.get('/nosotros', (req, res)=>{res.render('paginas/nosotros')});
router.get('/miperfil', (req, res)=>{res.render('paginas/miperfil')});
router.get('/planilla_riesgo', (req, res)=>{res.render('paginas/planilla_riesgo')});
router.get('/manada_planilla', (req, res)=>{res.render('paginas/manada_planilla')});
router.get('/index', (req, res)=>{res.render('paginas/index')});
router.get('/admin',authorization.soloAdmin, (req, res)=>{res.render('paginas/admin/admin')});
router.post('/api/login', authentication.login);
router.post('/api/registro', authentication.registro);
export default router;