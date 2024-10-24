import { Router } from 'express';
import pool from '../database.js';

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
            descripcion_accidente: accidente_sucedido === 'Otros' ? descripcion_accidente : ''
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
        const [planillas] = await pool.query('SELECT * FROM planillaDeRiesgo');
        res.render('paginas/listPlanillas', { planillas });  // Aquí está el cambio
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener las planillas de riesgo' });
    }
});

export default router;
