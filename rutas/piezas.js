const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /piezas → Obtener todas las piezas
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM piezas ORDER BY id_pieza');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener piezas:', error);
        res.status(500).json({ error: 'Error al obtener piezas' });
    }
});

// GET /piezas/:id → Obtener una pieza por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM piezas WHERE id_pieza = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Pieza no encontrada" });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al obtener pieza:', error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;
