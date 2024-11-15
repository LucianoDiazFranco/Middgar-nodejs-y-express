import { Router } from 'express';
import pool from '../database.js';
import moment from 'moment';

const router = Router();

// Renderizar formulario para crear planilla de riesgo
router.get('/planilla_riesgo', (req, res) => {
    res.render('planillaRiesgo');
});

// Agregar una nueva planilla de riesgo
router.post('/addPlanillas', async (req, res) => {
    try {
        const { fecha_actividad, lugar_actividad, cantidad_beneficiarios, cantidad_educadores, im_a_cargo, elementos_seguridad, accidente_sucedido, descripcion_accidente,rama } = req.body;
        
        const nuevaPlanilla = {
            fecha_actividad,
            lugar_actividad,
            cantidad_beneficiarios,
            cantidad_educadores,
            im_a_cargo,
            elementos_seguridad,
            accidente_sucedido,
            descripcion_accidente,
            rama,
            activo: 1  // Establecer el campo activo en 1 por defecto   
        };

        await pool.query('INSERT INTO planillaDeRiesgo SET ?', [nuevaPlanilla]);
                // Redirigir según la rama seleccionada
                switch (rama) {
                    case 'Manada':
                        res.redirect('/listPlanillasManada');
                        break;
                    case 'Unidad':
                        res.redirect('/listPlanillasUnidad');
                        break;
                    case 'Caminantes':
                        res.redirect('/listPlanillasCaminantes');
                        break;
                    case 'Rovers':
                        res.redirect('/listPlanillasRovers');
                        break;
                    default:
                        res.redirect('/'); // Redirigir a una página de inicio u otra si es necesario
                        break;
                }
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
});

// Listar planillas de riesgo para Manada con búsqueda
router.get('/listPlanillasManada', async (req, res) => {
    try {
        const { search } = req.query;
        let query = `SELECT * FROM planillaDeRiesgo WHERE activo = 1 AND rama = "Manada"`;
        const params = [];

        if (search) {
            query += ` AND (lugar_actividad LIKE ? OR fecha_actividad LIKE ?)`;
            const searchValue = `%${search}%`;
            params.push(searchValue, searchValue);
        }

        const [planillas] = await pool.query(query, params);

        const planillasFormateadas = planillas.map(planilla => ({
            ...planilla,
            fecha_actividad: moment(planilla.fecha_actividad).format('DD/MM/YYYY')
        }));

        res.render('paginas/listPlanillas', { planillas: planillasFormateadas, rama: "Manada" });
    } catch (err) {
        console.error('Error al obtener las planillas de riesgo:', err);
        res.status(500).json({ message: 'Error al obtener las planillas de riesgo' });
    }
});

// Listar planillas de riesgo para Unidad
router.get('/listPlanillasUnidad', async (req, res) => {
    try {
        const [planillas] = await pool.query('SELECT * FROM planillaDeRiesgo WHERE activo = 1 AND rama = "Unidad"');
        const planillasFormateadas = planillas.map(planilla => ({
            ...planilla,
            fecha_actividad: moment(planilla.fecha_actividad).format('DD/MM/YYYY')
        }));
        res.render('paginas/listPlanillasUnidad', { planillas: planillasFormateadas, rama: "Unidad" });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las planillas de riesgo' });
    }
});

// Listar planillas de riesgo para Caminantes
router.get('/listPlanillasCaminantes', async (req, res) => {
    try {
        const [planillas] = await pool.query('SELECT * FROM planillaDeRiesgo WHERE activo = 1 AND rama = "Caminantes"');
        const planillasFormateadas = planillas.map(planilla => ({
            ...planilla,
            fecha_actividad: moment(planilla.fecha_actividad).format('DD/MM/YYYY')
        }));
        res.render('paginas/listPlanillas', { planillas: planillasFormateadas, rama: "Caminantes" });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las planillas de riesgo' });
    }
});

// Listar planillas de riesgo para Rovers
router.get('/listPlanillasRovers', async (req, res) => {
    try {
        const [planillas] = await pool.query('SELECT * FROM planillaDeRiesgo WHERE activo = 1 AND rama = "Rovers"');
        const planillasFormateadas = planillas.map(planilla => ({
            ...planilla,
            fecha_actividad: moment(planilla.fecha_actividad).format('DD/MM/YYYY')
        }));
        res.render('paginas/listPlanillas', { planillas: planillasFormateadas, rama: "Rovers" });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las planillas de riesgo' });
    }
});

// Ruta para ocultar un registro de planilla de riesgo
router.get('/ocultarPlanillaManada/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE planillaDeRiesgo SET activo = 0 WHERE id = ?', [id]);
        res.redirect('/listplanillasManada');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al ocultar la planilla de riesgo' });
    }
});

// Ruta para renderizar el formulario de edición con los datos del registro
router.get('/editarPlanilla/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [planilla] = await pool.query('SELECT * FROM planillaDeRiesgo WHERE id = ?', [id]);
        if (planilla.length > 0) {
            res.render('paginas/editPlanillas', { planilla: planilla[0],hideFooter: true });
        } else {
            res.redirect('/listPlanillasManada'); // Ajusta la redirección según la rama
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al cargar el formulario de edición' });
    }
});

// Ruta para procesar la actualización del registro
router.post('/editarPlanilla/:id', async (req, res) => {
    const { id } = req.params;
    const {
        fecha_actividad,
        lugar_actividad,
        cantidad_beneficiarios,
        cantidad_educadores,
        im_a_cargo,
        elementos_seguridad,
        accidente_sucedido,
        descripcion_accidente
    } = req.body;

    try {
        // Actualizamos la planilla
        await pool.query(
            'UPDATE planillaDeRiesgo SET fecha_actividad = ?, lugar_actividad = ?, cantidad_beneficiarios = ?, cantidad_educadores = ?, im_a_cargo = ?, elementos_seguridad = ?, accidente_sucedido = ?, descripcion_accidente = ? WHERE id = ?',
            [fecha_actividad, lugar_actividad, cantidad_beneficiarios, cantidad_educadores, im_a_cargo, elementos_seguridad, accidente_sucedido, descripcion_accidente, id]
        );

        // Obtenemos la rama actual de la planilla para redirigir correctamente
        const [result] = await pool.query('SELECT rama FROM planillaDeRiesgo WHERE id = ?', [id]);
        const rama = result[0]?.rama;

        // Redirigir según la rama
        switch (rama) {
            case 'Manada':
                res.redirect('/listPlanillasManada');
                break;
            case 'Unidad':
                res.redirect('/listPlanillasUnidad');
                break;
            case 'Caminantes':
                res.redirect('/listPlanillasCaminantes');
                break;
            case 'Rovers':
                res.redirect('/listPlanillasRovers');
                break;
            default:
                res.redirect('/'); // Redirigir a una página de inicio u otra si es necesario
                break;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar la planilla de riesgo' });
    }
});

// Buscar planillas de riesgo por lugar o fecha
router.get('/searchPlanilla', async (req, res) => {
    const searchTerm = req.query.term;

    try {
        const query = `
            SELECT * FROM planillaDeRiesgo 
            WHERE (lugar_actividad LIKE ? OR fecha_actividad LIKE ?) AND activo = 1
        `;
        const searchValue = `%${searchTerm}%`;
        const [results] = await pool.query(query, [searchValue, searchValue]);

        res.json(results);
    } catch (err) {
        console.error('Error en la búsqueda de planillas:', err);
        res.status(500).json({ message: 'Error al buscar las planillas de riesgo' });
    }
});

export default router;
