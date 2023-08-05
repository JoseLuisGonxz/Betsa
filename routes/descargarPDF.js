const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(__dirname, '..', 'uploads');

// Ruta para descargar un archivo PDF
router.get('/', (req, res) => {
  // Leer el directorio de archivos
  fs.readdir(uploadDirectory, (err, files) => {
    if (err) {
      console.error('Error al leer el directorio de archivos', err);
      res.status(500).send('Error al leer el directorio de archivos');
      return;
    }

    // Filtrar solo los archivos PDF
    const pdfFiles = files.filter(file => path.extname(file) === '.pdf');

    if (pdfFiles.length === 0) {
      console.error('No se encontraron archivos PDF');
      res.status(404).send('No se encontraron archivos PDF');
      return;
    }

    // Obtener el primer archivo PDF
    const filename = pdfFiles[0];
    const filePath = path.join(uploadDirectory, filename);
    const fullPath = path.resolve(filePath);

    // Descargar el archivo
    res.download(fullPath, filename, (error) => {
      if (error) {
        console.error('Error al descargar el archivo', error);
        res.status(404).send('Error al descargar el archivo');
      } else {
        // Eliminar los archivos del directorio después de la descarga
        fs.readdir(uploadDirectory, (err, files) => {
          if (err) {
            console.error('Error al leer el directorio de archivos', err);
            return;
          }

          files.forEach(file => {
            const fileToDelete = path.join(uploadDirectory, file);
            fs.unlink(fileToDelete, err => {
              if (err) {
                console.error('Error al eliminar el archivo', err);
              }
            });
          });
        });
      }
    });
  });
});

module.exports = router;
