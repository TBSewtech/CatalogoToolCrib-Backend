// rutas/admin.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyAdmin, verifyMasterKey } = require('../middleware/auth');

// LOGIN ADMIN
router.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        const result = await pool.query(
            'SELECT * FROM administradores WHERE correo = $1',
            [correo]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Admin no encontrado" });
        }

        const admin = result.rows[0];
        const validPass = await bcrypt.compare(contrasena, admin.contrasena);

        if (!validPass) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: admin.id_admin, correo: admin.correo, rol: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({ mensaje: "Bienvenido", token });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error en login" });
    }
});

// CREAR ADMIN (solo usando MASTER_KEY)
router.post('/crear', verifyMasterKey, async (req, res) => {
    try {
        const { nombre, correo, contrasena } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(contrasena, salt);

        await pool.query(
            `INSERT INTO administradores (nombre, correo, contrasena)
             VALUES ($1, $2, $3)`,
            [nombre, correo, hash]
        );

        res.status(201).json({ mensaje: "Administrador creado correctamente" });

    } catch (error) {
        console.error("Error al crear admin:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;
