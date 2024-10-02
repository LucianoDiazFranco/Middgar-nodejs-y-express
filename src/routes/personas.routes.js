import { Router } from 'express'
import pool from '../database.js'
import moment from 'moment';

const router = Router();

router.get('/add', (req, res)=>{
  res.render('personas/add')  
})

router.post('/add', async(req, res)=>{
    try{
        const{nombre, apellido,correo, telefono, fecha_nac} =req.body;
        const newPersona = {
            nombre, apellido, correo, telefono, fecha_nac
        }
        await pool.query('INSERT INTO PERSONAS SET ?',[newPersona]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

router.get('/list', async(req, res)=>{
    try{
        const [result] = await pool.query('SELECT * FROM personas');
        // Formatear las fechas antes de pasarlas al template
        const personas = result.map(persona => {
            return {
                ...persona,
                fecha_nac: moment(persona.fecha_nac).format('DD/MM/YYYY')
            };
        });
        res.render('personas/list', { personas });
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get('/edit/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        const [persona] = await pool.query('SELECT * FROM personas WHERE id = ?' , [id]);
        const personaEdit = persona[0];
        res.render('personas/edit', {persona: personaEdit});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:err.message});
    }
} )

router.post('/edit/:id', async(req, res)=>{
    try{
        const {nombre, apellido, correo, telefono, fecha_nac} = req.body;
        const {id} = req.params;
        const editPersona = {nombre, apellido, correo, telefono, fecha_nac};
        await pool.query('UPDATE PERSONAS SET ? WHERE id = ?' , [editPersona,id]);
        res.redirect('/list');
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:err.message});
    }
})

router.get('/delete/:id',  async(req, res)=>{
    try{
        const {id} = req.params;
        await pool.query('DELETE FROM personas WHERE id = ?', [id]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message}); 
        
    }
})
router.get('/manada', (req, res)=>{res.render('paginas/manada')  })
router.get('/unidad', (req, res)=>{res.render('paginas/unidad')  })
router.get('/caminantes', (req, res)=>{res.render('paginas/caminantes')  })
router.get('/rovers', (req, res)=>{res.render('paginas/rovers')  })
router.get('/inicio_secion', (req, res)=>{res.render('paginas/inicio_secion')  })
router.get('/registro', (req, res)=>{res.render('paginas/registro')  })
router.get('/rec_password', (req, res)=>{res.render('paginas/rec_password')  })
router.get('/nosotros', (req, res)=>{res.render('paginas/nosotros')  })
router.get('/miperfil', (req, res)=>{res.render('paginas/miperfil')  })
router.get('/planilladeriesgo', (req, res)=>{res.render('paginas/planilladeriesgo')  })

router.get('/index', (req, res)=>{res.render('paginas/index')})

export default router;