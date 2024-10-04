import { Router } from 'express'
import pool from '../database.js'
import moment from 'moment';

const router = Router();


router.get('/add', (req, res)=>{
    res.render('usuarios/add')  
})

router.post('/add', async(req, res)=>{
    try{
        const{DNI, nombre, apellido,correo, fecha_nac} =req.body;
        const newPersona = {
            DNI, nombre, apellido, correo, fecha_nac
        }
        await pool.query('INSERT INTO PERSONA SET ?',[newPersona]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

router.get('/list', async(req, res)=>{
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM persona';
        let params = []; // lista a todas las personas de la tabla

        if (search) {
            query += ' WHERE nombre LIKE ? OR apellido LIKE ?'; // utiliza like para comparar con la columna nombre
            params.push(`%${search}%`, `%${search}%`);//compara lo que entra al search(el imput)
        }
        

        const [result] = await pool.query(query, params);

        // Formatear las fechas antes de pasarlas al template
        const personas = result.map(persona => {
            return {
                ...persona,
                fecha_nac: moment(persona.fecha_nac).format('DD/MM/YYYY')
            };
        });
        
         // Si no hay resultados, pasar un mensaje de error
        let errorMessage = null;
        let successMessage = null;
        if (personas.length === 0) {
            errorMessage = "No se encontraron resultados para tu búsqueda.";
        }
        else {
        successMessage = `Se encontraron ${personas.length} resultados.`;
        }

        res.render('paginas/manada_add', { personas, errorMessage, successMessage});
    } catch (err) {
        res.status(500).json({ message: err.message });
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
        const {DNI, nombre, apellido, correo, fecha_nac} = req.body;
        const {id} = req.params;
        const editPersona = {DNI, nombre, apellido, correo, fecha_nac};
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