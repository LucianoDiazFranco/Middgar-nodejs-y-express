import { Router } from 'express'

const router = Router();


//rutas de las pantallas
router.get('/', (req, res)=>{res.render('paginas/index')});
router.get('/manada', (req, res)=>{res.render('paginas/manada')});
router.get('/manada_add', (req, res)=>{res.render('paginas/manada_add')});
router.get('/unidad', (req, res)=>{res.render('paginas/unidad')});
router.get('/caminantes', (req, res)=>{res.render('paginas/caminantes')});
router.get('/rovers', (req, res)=>{res.render('paginas/rovers')});
router.get('/inicio_secion', (req, res)=>{res.render('paginas/inicio_secion')});
router.get('/registro', (req, res)=>{res.render('paginas/registro')});
router.get('/rec_password', (req, res)=>{res.render('paginas/rec_password')});
router.get('/nosotros', (req, res)=>{res.render('paginas/nosotros')});
router.get('/miperfil', (req, res)=>{res.render('paginas/miperfil')});
router.get('/planilla_riesgo', (req, res)=>{res.render('paginas/planilla_riesgo')});
router.get('/index', (req, res)=>{res.render('paginas/index')});
export default router;