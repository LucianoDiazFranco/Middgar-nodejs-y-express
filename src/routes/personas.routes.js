import { Router } from 'express'
import pool from '../database.js'
import moment from 'moment';

const router = Router();


router.get('/add', (req, res)=>{
    res.render('usuarios/add')  
})

router.post('/add', async (req, res) => {
    try {
        const { DNI, nombre, apellido, correo, fecha_nac, Rama } = req.body;
        const newPersona = {
            DNI, nombre, apellido, correo, fecha_nac, Rama
        };
        await pool.query('INSERT INTO PERSONA SET ?', [newPersona]);

        // Redirigir según la rama seleccionada
        switch (Rama) {
            case 'Manada':
                res.redirect('/list');
                break;
            case 'Unidad':
                res.redirect('/lista');
                break;
            case 'Caminantes':
                res.redirect('/listaCaminantes');
                break;
            case 'Rovers':
                res.redirect('/listaRovers');
                break;
            default:
                res.redirect('/'); // Redirigir a una página de inicio u otra si es necesario
                break;
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/list', async (req, res) => {      //////// LIST DE MANADA
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM persona WHERE activo = 1 AND Rama = "Manada"'; // Solo usuarios activos en la Rama Manada
        let params = [];

        if (search) {
            query += ' AND (DNI LIKE ? OR nombre LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [result] = await pool.query(query, params);

        // Formatear las fechas antes de pasarlas al template
        const personas = result.map(persona => {
            return {
                ...persona,
                fecha_nac: moment(persona.fecha_nac).format('DD/MM/YYYY')
            };
        });

        let errorMessage = null;
        let successMessage = null;
        if (personas.length === 0) {
            errorMessage = "No se encontraron resultados para tu búsqueda.";
        } else {
            successMessage = `Se encontraron ${personas.length} resultados.`;
        }

        res.render('paginas/manada_add', { personas, errorMessage, successMessage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//////////////////////LOGICA UNIDADA- LISTAR USUARIOS ////////////////////
router.get('/lista', async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM persona WHERE activo = 1 AND Rama = "Unidad"'; // Solo usuarios activos en la Rama Manada
        let params = [];

        if (search) {
            query += ' AND (DNI LIKE ? OR nombre LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [result] = await pool.query(query, params);

        // Formatear las fechas antes de pasarlas al template
        const personas = result.map(persona => {
            return {
                ...persona,
                fecha_nac: moment(persona.fecha_nac).format('DD/MM/YYYY')
            };
        });

        let errorMessage = null;
        let successMessage = null;
        if (personas.length === 0) {
            errorMessage = "No se encontraron resultados para tu búsqueda.";
        } else {
            successMessage = `Se encontraron ${personas.length} resultados.`;
        }

        res.render('paginas/unidad_add', { personas, errorMessage, successMessage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//////////////////////LOGICA Caminantes - listar usuarios////////////////////
router.get('/listaCaminantes', async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM persona WHERE activo = 1 AND Rama = "Caminantes"'; // Solo usuarios activos en la Rama Caminantes
        let params = [];

        if (search) {
            query += ' AND (DNI LIKE ? OR nombre LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [result] = await pool.query(query, params);

        // Formatear las fechas antes de pasarlas al template
        const personas = result.map(persona => {
            return {
                ...persona,
                fecha_nac: moment(persona.fecha_nac).format('DD/MM/YYYY')
            };
        });

        let errorMessage = null;
        let successMessage = null;
        if (personas.length === 0) {
            errorMessage = "No se encontraron resultados para tu búsqueda.";
        } else {
            successMessage = `Se encontraron ${personas.length} resultados.`;
        }

        res.render('paginas/caminantes_add', { personas, errorMessage, successMessage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

////////////////////LOGICA Rover//////////////////////////
router.get('/listaRovers', async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM persona WHERE activo = 1 AND Rama = "Rovers"'; // Solo usuarios activos en la Rama Caminantes
        let params = [];

        if (search) {
            query += ' AND (DNI LIKE ? OR nombre LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [result] = await pool.query(query, params);

        // Formatear las fechas antes de pasarlas al template
        const personas = result.map(persona => {
            return {
                ...persona,
                fecha_nac: moment(persona.fecha_nac).format('DD/MM/YYYY')
            };
        });

        let errorMessage = null;
        let successMessage = null;
        if (personas.length === 0) {
            errorMessage = "No se encontraron resultados para tu búsqueda.";
        } else {
            successMessage = `Se encontraron ${personas.length} resultados.`;
        }

        res.render('paginas/rovers_add', { personas, errorMessage, successMessage });
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

router.get('/delete/:DNI', async (req, res) => { /// OCULTAR USUARIO MANADA
    try {
        const { DNI } = req.params;
        await pool.query('UPDATE persona SET activo = 0 WHERE DNI = ?', [DNI]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/deleteUnidad/:DNI', async (req, res) => { /// OCULTAR USUARIO UNIDAD
    try {
        const { DNI } = req.params;
        await pool.query('UPDATE persona SET activo = 0 WHERE DNI = ?', [DNI]);
        res.redirect('/lista');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/deleteCaminantes/:DNI', async (req, res) => { /// OCULTAR USUARIO Caminantes
    try {
        const { DNI } = req.params;
        await pool.query('UPDATE persona SET activo = 0 WHERE DNI = ?', [DNI]);
        res.redirect('/listaCaminantes');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/deleteRovers/:DNI', async (req, res) => { /// OCULTAR USUARIO Rover
    try {
        const { DNI } = req.params;
        await pool.query('UPDATE persona SET activo = 0 WHERE DNI = ?', [DNI]);
        res.redirect('/listaRovers');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/pasarRama/:DNI', async (req, res) => {  ///////////// LOGICA PASAR DE RAMA
    try {
        const { DNI } = req.params;

        // Obtener la rama actual de la persona
        const [persona] = await pool.query('SELECT Rama FROM persona WHERE DNI = ?', [DNI]);
        let nuevaRama;

        // Cambiar la rama a la siguiente
        if (persona[0].Rama === 'Manada') {
            nuevaRama = 'Unidad';
        } else if (persona[0].Rama === 'Unidad') {
            nuevaRama = 'Caminantes';
        } else if (persona[0].Rama === 'Caminantes') {
            nuevaRama = 'Rovers';
        } else {
            nuevaRama = 'Rovers'; // Mantener en la última rama o agragar la funcion de dirigentes
        }

        await pool.query('UPDATE persona SET Rama = ? WHERE DNI = ?', [nuevaRama, DNI]);

        res.redirect('/list');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
///////////////////////////////////////////////

/////////////LOGICA DE CONTADOR DE MIEMBROS/////

export default router;
