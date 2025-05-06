import express from 'express'
import router from './Routes/index.js'
import path from 'path';

const app = express()
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json())


//rutas index
app.use(router)

//poder visualizar las imagenes QR
app.use('/uploads', express.static(path.resolve('uploads')));

//default middleware
app.use((req, res) => {
  res.status(404).json({
    text: "Endpoint not found"
  });
});

export default app;


/*const express = require('express');
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


*/
