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
        const { fecha_actividad, lugar_actividad, cantidad_beneficiarios, cantidad_educadores, im_a_cargo, elementos_seguridad, accidente_sucedido, descripcion_accidente } = req.body;
        
        const nuevaPlanilla = {
            fecha_actividad,
            lugar_actividad,
            cantidad_beneficiarios,
            cantidad_educadores,
            im_a_cargo,
            elementos_seguridad,
            accidente_sucedido,
            descripcion_accidente,
            activo: 1  // Establecer el campo activo en 1 por defecto   
        };

        await pool.query('INSERT INTO planillaDeRiesgo SET ?', [nuevaPlanilla]);
        res.redirect('/listplanilla');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear la planilla de riesgo' });
    }
});

// Listar planillas de riesgo
router.get('/listplanilla', async (req, res) => {
    try {
        const [planillas] = await pool.query('SELECT * FROM planillaDeRiesgo WHERE activo = 1');
        
        // Formatear la fecha para cada planilla
        const planillasFormateadas = planillas.map(planilla => ({
            ...planilla,
            fecha_actividad: moment(planilla.fecha_actividad).format('DD/MM/YYYY')  // Formato deseado
        }));

        res.render('paginas/listPlanillas', { planillas: planillasFormateadas });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener las planillas de riesgo' });
    }
});
export default router;

// Ruta para ocultar un registro de planilla de riesgo
router.get('/ocultarPlanilla/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE planillaDeRiesgo SET activo = 0 WHERE id = ?', [id]);
        res.redirect('/listplanilla');
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
            res.render('paginas/editPlanillas', { planilla: planilla[0] });
        } else {
            res.redirect('/listplanilla'); // Redirige si no se encuentra el registro
        }
    } catch (err) {
        console.error(err);
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
        await pool.query('UPDATE planillaDeRiesgo SET fecha_actividad = ?, lugar_actividad = ?, cantidad_beneficiarios = ?, cantidad_educadores = ?, im_a_cargo = ?, elementos_seguridad = ?, accidente_sucedido = ?, descripcion_accidente = ? WHERE id = ?', 
            [fecha_actividad, lugar_actividad, cantidad_beneficiarios, cantidad_educadores, im_a_cargo, elementos_seguridad, accidente_sucedido, descripcion_accidente, id]
        );
        res.redirect('/listplanillas');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar la planilla de riesgo' });
    }
});
