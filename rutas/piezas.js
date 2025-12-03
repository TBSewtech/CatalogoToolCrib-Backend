// rutas/piezas.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verifyAdmin } = require('../middleware/auth'); // proteger endpoints admin

// GET /piezas -> listar con filtros opcionales: ?q=texto &categoria=1 &stock=con stock &limit=50 &offset=0
router.get('/', async (req, res) => {
  try {
    const { q, categoria, stock, limit = 1000, offset = 0 } = req.query;

    const conditions = [];
    const values = [];
    let idx = 1;

    if (q) {
      // Buscamos en descripcion, numero_parte, ubicacion_exacta
      conditions.push(`(descripcion ILIKE $${idx} OR numero_parte ILIKE $${idx} OR ubicacion_exacta ILIKE $${idx})`);
      values.push(`%${q}%`); idx++;
    }
    if (categoria) {
      conditions.push(`id_categoria = $${idx}`);
      values.push(categoria); idx++;
    }
    if (stock) {
      conditions.push(`LOWER(stock) = LOWER($${idx})`);
      values.push(stock); idx++;
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const sql = `SELECT * FROM piezas ${where} ORDER BY id_pieza LIMIT $${idx} OFFSET $${idx+1}`;
    values.push(limit, offset);

    const result = await pool.query(sql, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener piezas:', error);
    res.status(500).json({ error: 'Error al obtener piezas' });
  }
});

// GET /piezas/:id -> obtener por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM piezas WHERE id_pieza = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ mensaje: "Pieza no encontrada" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener pieza:', error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// POST /piezas -> crear (PROTEGIDO)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { id_pieza, numero_parte, descripcion, ubicacion_exacta, stock, imagen_url, id_categoria } = req.body;
    await pool.query(
      `INSERT INTO piezas (id_pieza, numero_parte, descripcion, ubicacion_exacta, stock, imagen_url, id_categoria)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id_pieza, numero_parte, descripcion, ubicacion_exacta, stock, imagen_url, id_categoria]
    );
    res.status(201).json({ mensaje: 'Pieza agregada' });
  } catch (error) {
    console.error('Error al crear pieza:', error);
    res.status(500).json({ error: 'Error al crear pieza' });
  }
});

// PUT /piezas/:id -> actualizar (PROTEGIDO)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_parte, descripcion, ubicacion_exacta, stock, imagen_url, id_categoria } = req.body;
    await pool.query(
      `UPDATE piezas SET numero_parte=$1, descripcion=$2, ubicacion_exacta=$3, stock=$4, imagen_url=$5, id_categoria=$6
       WHERE id_pieza=$7`,
      [numero_parte, descripcion, ubicacion_exacta, stock, imagen_url, id_categoria, id]
    );
    res.json({ mensaje: 'Pieza actualizada' });
  } catch (error) {
    console.error('Error al actualizar pieza:', error);
    res.status(500).json({ error: 'Error al actualizar pieza' });
  }
});

// DELETE /piezas/:id -> eliminar (PROTEGIDO)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM piezas WHERE id_pieza = $1', [id]);
    res.json({ mensaje: 'Pieza eliminada' });
  } catch (error) {
    console.error('Error al eliminar pieza:', error);
    res.status(500).json({ error: 'Error al eliminar pieza' });
  }
});

module.exports = router;
