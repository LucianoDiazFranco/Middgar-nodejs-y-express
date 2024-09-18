import { Router } from 'express'
import pool from '../database.js'
import moment from 'moment';
import {methods as authentication} from "../controllers/authentication.controller.js"

const router = Router();

router.get('/manada', (req, res)=>{res.render('paginas/manada')});
router.get('/unidad', (req, res)=>{res.render('paginas/unidad')});
router.get('/caminantes', (req, res)=>{res.render('paginas/caminantes')});
router.get('/rovers', (req, res)=>{res.render('paginas/rovers')});
router.get('/inicio_secion', (req, res)=>{res.render('paginas/inicio_secion')});
router.get('/registro', (req, res)=>{res.render('paginas/registro')});
router.get('/rec_password', (req, res)=>{res.render('paginas/rec_password')});
router.get('/nosotros', (req, res)=>{res.render('paginas/nosotros')});
router.get('/index', (req, res)=>{res.render('paginas/index')});
router.get('/admin', (req, res)=>{res.render('paginas/admin/admin')});
router.post('/api/login', authentication.login);
router.post('/api/registro', authentication.registro);
export default router;