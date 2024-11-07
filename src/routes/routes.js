import { Router } from 'express'

const router = Router();


//rutas de las pantallas
router.get('/', (req, res)=>{res.render('paginas/index')});
router.get('/manada', (req, res)=>{res.render('paginas/manada')});
router.get('/manada_add', (req, res)=>{res.render('paginas/manada_add')});
router.get('/unidad', (req, res)=>{res.render('paginas/unidad')});
router.get('/unidad_add', (req, res)=>{res.render('paginas/unidad_add')});
router.get('/caminantes', (req, res)=>{res.render('paginas/caminantes')});
router.get('/rovers', (req, res)=>{res.render('paginas/rovers')});
router.get('/inicio_secion', (req, res)=>{res.render('paginas/inicio_secion', { hideNavFooter: true })});
router.get('/registro', (req, res)=>{res.render('paginas/registro', { hideNavFooter: true })});
router.get('/rec_password', (req, res)=>{res.render('paginas/rec_password', { hideNavFooter: true })});
router.get('/nosotros', (req, res)=>{res.render('paginas/nosotros')});
router.get('/miperfil', (req, res)=>{res.render('paginas/miperfil')});
router.get('/addPlanillas', (req, res)=>{res.render('paginas/addPlanillas')});
router.get('/listPlanillas', (req, res)=>{res.render('paginas/listPlanillas')});
router.get('/editPlanillas', (req, res)=>{res.render('paginas/editPlanillas')});
router.get('/documentosUsuario', (req, res)=>{res.render('paginas/documentosUsuario')});
router.get('/index', (req, res)=>{res.render('paginas/index')});
export default router;