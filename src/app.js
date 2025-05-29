import express from 'express'
import router from './Routes/index.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json())

//configurar motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

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