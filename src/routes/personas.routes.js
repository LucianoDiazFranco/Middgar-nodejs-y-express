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
            query += ' WHERE DNI LIKE ? OR nombre LIKE ?'; // utiliza like para comparar con la columna nombre
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

router.get('/edit/:DNI', async(req, res)=>{
    try{
        const {DNI} = req.params;
        const [persona] = await pool.query('SELECT * FROM persona WHERE DNI = ?' , [DNI]);
        const personaEdit = {
            ...persona[0],
            fecha_nac: moment(persona[0].fecha_nac).format('YYYY-MM-DD') // Formateamos la fecha
        };
        res.render('usuarios/edit', {persona: personaEdit});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:err.message});
    }
} )

router.post('/edit/:DNI', async (req, res) => {
    try {
        const { nombre, apellido, correo, fecha_nac, nuevoDNI } = req.body;
        const { DNI } = req.params;

        // Verificar si el DNI está siendo cambiado
        if (nuevoDNI !== DNI) {
            const [dniExists] = await pool.query('SELECT * FROM persona WHERE DNI = ?', [nuevoDNI]);

            // Si el nuevo DNI ya está en uso, mostrar un mensaje de error sin actualizar nada
            if (dniExists.length > 0) {
                const personaEdit = { DNI: nuevoDNI, nombre, apellido, correo, fecha_nac };
                return res.render('usuarios/edit', {
                    persona: personaEdit,
                    errorMessage: 'El DNI ya está en uso. Por favor, elige otro.'
                });
            }
        }
        // Si no hubo cambio en el DNI o el nuevo DNI es válido, proceder con la actualización
        await pool.query('UPDATE persona SET DNI = ?, nombre = ?, apellido = ?, correo = ?, fecha_nac = ? WHERE DNI = ?', 
                         [nuevoDNI, nombre, apellido, correo, fecha_nac, DNI]);

        res.redirect('/list');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});




router.get('/delete/:DNI',  async(req, res)=>{
    try{
        const {DNI} = req.params;
        await pool.query('DELETE FROM persona WHERE DNI = ?', [DNI]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message}); 
        
    }
})

export default router;