// rutas/solicitudes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { verifyAdmin } = require("../middleware/auth");

// 🟢 Crear solicitud
router.post("/", async (req, res) => {
    try {
        const { nombre_empleado, carrito } = req.body;

        if (!carrito || carrito.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío" });
        }

        const nueva = await pool.query(
            `INSERT INTO solicitudes (nombre_empleado) VALUES ($1) RETURNING id_solicitud`,
            [nombre_empleado]
        );

        const id_solicitud = nueva.rows[0].id_solicitud;

        for (let item of carrito) {
            await pool.query(
                `INSERT INTO solicitud_detalle (id_solicitud, id_pieza, cantidad)
                 VALUES ($1, $2, $3)`,
                [id_solicitud, item.id_pieza, item.cantidad]
            );
        }

        res.json({ mensaje: "Solicitud creada correctamente", id_solicitud });
    } catch (error) {
        console.error("Error al crear solicitud:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 🟢 Listar solicitudes
router.get("/", verifyAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM solicitudes ORDER BY fecha DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 🟢 Ver detalle de una solicitud
router.get("/:id", verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const solicitud = await pool.query(
            `SELECT * FROM solicitudes WHERE id_solicitud = $1`,
            [id]
        );

        const detalle = await pool.query(
            `SELECT d.*, p.descripcion
             FROM solicitud_detalle d
             JOIN piezas p ON d.id_pieza = p.id_pieza
             WHERE d.id_solicitud = $1`,
            [id]
        );

        res.json({ info: solicitud.rows[0], piezas: detalle.rows });
    } catch (error) {
        console.error("Error al obtener detalle:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 🟢 Actualizar estado de una solicitud
router.put("/:id/estado", async (req, res) => {
    try {
        const { id } = req.params;
        let { estado } = req.body;

        if (!estado) {
            return res.status(400).json({ error: "Se requiere un estado" });
        }

        // Normalizar texto
        estado = estado.trim().toLowerCase();

        const validos = ["pendiente", "aprobada", "entregada"];

        if (!validos.includes(estado)) {
            return res.status(400).json({ error: "Estado inválido" });
        }

        await pool.query(
            `UPDATE solicitudes SET estado = $1 WHERE id_solicitud = $2`,
            [estado, id]
        );

        res.json({ mensaje: "Estado actualizado correctamente", estado });

    } catch (error) {
        console.error("Error al actualizar estado:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});


module.exports = router;
