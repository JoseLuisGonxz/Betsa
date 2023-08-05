// Importamos los módulos necesarios
const express = require("express");
const multer = require("multer");
const bodyParser = require('body-parser');
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const PDFParser = require('pdf-parse');
const { generarFolio, generarCodigoBarras } = require('./models/folioGenerator');
const { extractIdentificadorElectronico, extractClaveRegistroPoblacion, extractEntidadRegistro } = require('./utils/pdfExtract');
const { generarFolioPDF } = require('./controllers/folioController');
const cargarPDFRoutes = require('./routes/cargarPDF');
const descargarPDFRoutes = require('./routes/descargarPDF');

// Creamos una aplicación express
const app = express();
const path = require("path");

// Configuración de middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/CargarPDF', cargarPDFRoutes);
app.use('/descargar-pdf', descargarPDFRoutes);

// Configuramos multer para almacenar los archivos PDF en una carpeta específica
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Configuramos express para que pueda parsear los datos enviados en una petición POST
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Definimos una ruta para el index de nuestra aplicación
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciamos el servidor en el puerto 50001
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
