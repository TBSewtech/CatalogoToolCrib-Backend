// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/piezas', require('./rutas/piezas'));
app.use('/admin', require('./rutas/admin'));
app.use('/solicitudes', require('./rutas/solicitudes'));

// Ruta principal
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando ✔');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
