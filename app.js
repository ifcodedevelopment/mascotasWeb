const express = require('express');
const path = require('path');
const app = express();

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'Views'));


// Rutas
const mainRoutes = require('./src/Routes/main.routes');
app.use('/', mainRoutes);

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
