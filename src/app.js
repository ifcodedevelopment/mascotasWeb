import express from 'express'
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './Config/swaggerOptions.js';
import indexRoutes from './Routes/main.routes.js'

const app = express()
const specs = swaggerJSDoc(swaggerOptions);

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json())

//rutas swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//rutas index
app.use(indexRoutes)

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
