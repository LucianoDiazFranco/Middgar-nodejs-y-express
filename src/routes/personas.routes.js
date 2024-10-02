import { Router } from 'express'
import pool from '../database.js'
import moment from 'moment';

const router = Router();


router.get('/add', (req, res)=>{
    res.render('usuarios/add')  
})

router.post('/add', async(req, res)=>{
    try{
        const{nombre, apellido,correo, telefono, fecha_nac} =req.body;
        const newPersona = {
            nombre, apellido, correo, telefono, fecha_nac
        }
        await pool.query('INSERT INTO PERSONA SET ?',[newPersona]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

router.get('/list', async(req, res)=>{
    try{
        const [result] = await pool.query('SELECT * FROM persona');
        // Formatear las fechas antes de pasarlas al template
        const personas = result.map(persona => {
            return {
                ...persona,
                fecha_nac: moment(persona.fecha_nac).format('DD/MM/YYYY')
            };
        });
        res.render('paginas/manada_add', { personas });
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get('/edit/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        const [persona] = await pool.query('SELECT * FROM persona WHERE id = ?' , [id]);
        const personaEdit = persona[0];
        res.render('usuarios/edit', {persona: personaEdit});
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
        await pool.query('UPDATE PERSONA SET ? WHERE id = ?' , [editPersona,id]);
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
        await pool.query('DELETE FROM persona WHERE id = ?', [id]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message}); 
        
    }
})

export default router;