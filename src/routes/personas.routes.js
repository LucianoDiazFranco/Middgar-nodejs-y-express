import { Router } from 'express'
import pool from '../database.js'
import moment from 'moment';

const router = Router();


router.get('/add', (req, res)=>{res.render('usuarios/add', { hideFooter: true })
})
router.get('/listBaja', (req, res)=>{
    res.render('usuarios/listBaja')  
})

router.post('/add', async (req, res) => {
    try {
        const { DNI, nombre, apellido, correo, fecha_nac, Rama } = req.body;
        const newPersona = {
            DNI, nombre, apellido, correo, fecha_nac, Rama,  activo: 1  // Establecer el campo activo en 1
        };
        await pool.query('INSERT INTO PERSONA SET ?', [newPersona]);

        // Redirigir según la rama seleccionada
        switch (Rama) {
            case 'Manada':
                res.redirect('/listManada');
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

router.get('/listManada', async (req, res) => {      //////// LIST DE MANADA
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
        
        // Consulta para contar el total de usuarios activos en Unidad
        const [countResult] = await pool.query('SELECT COUNT(*) AS totalUsuarios FROM persona WHERE activo = 1 AND Rama = "Unidad"');
        const totalUsuariosUnidad = countResult[0].totalUsuarios;

        let query = 'SELECT * FROM persona WHERE activo = 1 AND Rama = "Unidad"';
        let params = [];

        if (search) {
            query += ' AND (DNI LIKE ? OR nombre LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [result] = await pool.query(query, params);

        // Formatear las fechas antes de pasarlas al template
        const personas = result.map(persona => ({
            ...persona,
            fecha_nac: moment(persona.fecha_nac).format('DD/MM/YYYY')
        }));

        let errorMessage = null;
        let successMessage = null;
        if (personas.length === 0) {
            errorMessage = "No se encontraron resultados para tu búsqueda.";
        } else {
            successMessage = `Se encontraron ${personas.length} resultados.`;
        }

        // Pasa el total de usuarios activos junto con otros datos
        res.render('paginas/unidad_add', { personas, errorMessage, successMessage, totalUsuariosUnidad });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//////////////////////LOGICA Caminantes - listar usuarios////////////////////
router.get('/listaCaminantes', async (req, res) => {
    try {
        const { search } = req.query;

        // Consulta para contar el total de usuarios activos en Caminantes
        const [countResult] = await pool.query('SELECT COUNT(*) AS totalUsuarios FROM persona WHERE activo = 1 AND Rama = "Caminantes"');
        const totalUsuariosCaminantes = countResult[0].totalUsuarios;

        let query = 'SELECT * FROM persona WHERE activo = 1 AND Rama = "Caminantes"';
        let params = [];

        if (search) {
            query += ' AND (DNI LIKE ? OR nombre LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [result] = await pool.query(query, params);

        // Formatear las fechas antes de pasarlas al template
        const personas = result.map(persona => ({
            ...persona,
            fecha_nac: moment(persona.fecha_nac).format('DD/MM/YYYY')
        }));

        let errorMessage = null;
        let successMessage = null;
        if (personas.length === 0) {
            errorMessage = "No se encontraron resultados para tu búsqueda.";
        } else {
            successMessage = `Se encontraron ${personas.length} resultados.`;
        }

        // Pasa el total de usuarios activos junto con otros datos
        res.render('paginas/caminantes_add', { personas, errorMessage, successMessage, totalUsuariosCaminantes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

////////////////////LOGICA Rover//////////////////////////
router.get('/listaRovers', async (req, res) => {
    try {
        const { search } = req.query;

        // Consulta para contar el total de usuarios activos en Rovers
        const [countResult] = await pool.query('SELECT COUNT(*) AS totalUsuarios FROM persona WHERE activo = 1 AND Rama = "Rovers"');
        const totalUsuariosRovers = countResult[0].totalUsuarios;

        let query = 'SELECT * FROM persona WHERE activo = 1 AND Rama = "Rovers"';
        let params = [];

        if (search) {
            query += ' AND (DNI LIKE ? OR nombre LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [result] = await pool.query(query, params);

        // Formatear las fechas antes de pasarlas al template
        const personas = result.map(persona => ({
            ...persona,
            fecha_nac: moment(persona.fecha_nac).format('DD/MM/YYYY')
        }));

        let errorMessage = null;
        let successMessage = null;
        if (personas.length === 0) {
            errorMessage = "No se encontraron resultados para tu búsqueda.";
        } else {
            successMessage = `Se encontraron ${personas.length} resultados.`;
        }

        // Pasar el total de usuarios activos a la vista junto con otros datos
        res.render('paginas/rovers_add', { personas, errorMessage, successMessage, totalUsuariosRovers });
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
        res.render('usuarios/edit', {persona: personaEdit, hideFooter: true});
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

        // Obtener la rama actualizada del usuario para redirigir a la lista correcta
        const [updatedUser] = await pool.query('SELECT Rama FROM persona WHERE DNI = ?', [nuevoDNI]);
        const rama = updatedUser[0]?.Rama;

        // Redirigir según la rama
        switch (rama) {
            case 'Manada':
                res.redirect('/listManada');
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
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


router.get('/delete/:DNI', async (req, res) => { /// OCULTAR USUARIO MANADA
    try {
        const { DNI } = req.params;
        await pool.query('UPDATE persona SET activo = 0 WHERE DNI = ?', [DNI]);
        res.redirect('/listManada');
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
        let redirectPage;

        // Cambiar la rama a la siguiente
        if (persona[0].Rama === 'Manada') {
            nuevaRama = 'Unidad';
            redirectPage = '/listManada';
        } else if (persona[0].Rama === 'Unidad') {
            nuevaRama = 'Caminantes';
            redirectPage = '/lista';
        } else if (persona[0].Rama === 'Caminantes') {
            nuevaRama = 'Rovers';
            redirectPage = '/listaCaminantes';
        } else {
            nuevaRama = 'Rovers'; // Mantener en la última rama o agragar la funcion de dirigentes
            redirectPage = '/listaRovers';
        }

        await pool.query('UPDATE persona SET Rama = ? WHERE DNI = ?', [nuevaRama, DNI]);

        res.redirect(redirectPage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

/////////////LOGICA DE CONTADOR DE MIEMBROS/////
router.get('/contadorUsuariosManada', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT COUNT(*) AS total FROM persona WHERE Rama = "Manada" AND activo = 1');
        const totalUsuarios = result[0].total;
        res.json({ totalUsuarios });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el contador de usuarios' });
    }
});

//Buscar Usuarios
router.get('/searchUser', async (req, res) => {
    const searchTerm = req.query.term;

    try {
        const query = `
            SELECT * FROM persona 
            WHERE nombre LIKE ? OR DNI LIKE ?
        `;
        const searchValue = `%${searchTerm}%`;
        const [results] = await pool.query(query, [searchValue, searchValue]);

        res.json(results);
    } catch (err) {
        console.error('Error en la búsqueda:', err);
        res.status(500).json({ message: 'Error al buscar el usuario' });
    }
});


// Ruta para listar usuarios dados de baja por rama
router.get('/usuariosInactivos', async (req, res) => {
    try {
        const { search } = req.query;
        const { rama } = req.query; // Puedes enviar un parámetro de rama para filtrar
        
        let query = 'SELECT * FROM persona WHERE activo = 0';
        const params = [];

        if (rama) {
            query += ' AND Rama = ?';
            params.push(rama);
        }

        if (search) {
            query += ' AND (DNI LIKE ? OR nombre LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [result] = await pool.query(query, params);

        const personas = result.map(persona => ({
            ...persona,
            fecha_nac: moment(persona.fecha_nac).format('DD/MM/YYYY')
        }));

        res.render('Usuarios/listBaja', { personas });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para activar un usuario (cambiar activo a 1)
router.patch('/activarUsuario/:DNI', async (req, res) => {
    try {
        const { DNI } = req.params;
        await pool.query('UPDATE persona SET activo = 1 WHERE DNI = ?', [DNI]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: 'Error al activar el usuario' });
    }
});

// Ruta para eliminar un usuario permanentemente
router.delete('/eliminarUsuario/:DNI', async (req, res) => {
    try {
        const { DNI } = req.params;
        await pool.query('DELETE FROM persona WHERE DNI = ?', [DNI]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
});


export default router;