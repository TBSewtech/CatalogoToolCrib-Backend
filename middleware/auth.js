// middleware/auth.js
const jwt = require('jsonwebtoken');

function verifyAdmin(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Token requerido" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        if (decoded.rol !== "admin") {
            return res.status(403).json({ error: "Acceso denegado" });
        }

        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido" });
    }
}

function verifyMasterKey(req, res, next) {
    const key = req.headers['x-master-key'];

    if (!key) {
        return res.status(401).json({ error: "Master key requerida" });
    }

    if (key !== process.env.MASTER_KEY) {
        return res.status(403).json({ error: "Master key incorrecta" });
    }

    next();
}

module.exports = { verifyAdmin, verifyMasterKey };
