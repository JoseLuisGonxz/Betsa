/* Por ahora esta comentado porque se  esta usando en elservidor */

/* const PDFParser = require('pdf-parse');

function handlePDFUpload(req, res) {
  if (!req.file) {
    return res.status(400).send('No se seleccionó ningún archivo PDF.');
  }

  const filePath = req.file.path;
  const options = {};

  PDFParser(filePath, options)
    .then(data => {
      const pdfContent = data.text;

      const identificadorElectronico = extractIdentificadorElectronico(pdfContent);
      const claveRegistroPoblacion = extractClaveRegistroPoblacion(pdfContent);
      const entidadRegistro = extractEntidadRegistro(pdfContent);

       // Generar el folio a partir del Identificador Electrónico
       const folio = generarFolio(identificadorElectronico);
       

      console.log('\n' + `Contenido del archivo PDF '${req.file.filename}':`);
      console.log('Identificador Electrónico:', identificadorElectronico);
      console.log('Clave Única de Registro de Población:', claveRegistroPoblacion);
      console.log('Entidad de Registro:', entidadRegistro);
      console.log('Folio:', folio);
      //console.log('CURP:', curp); // Mostrar la CURP en la consola
      //Imprime la curp en el cliente
      res.json({ success: true, claveRegistroPoblacion: claveRegistroPoblacion });


      //res.json({ success: true });
    })
    .catch(error => {
      console.log('Error al leer el PDF:', error);
      res.status(500).json({ success: false, error: 'Error al leer el PDF' });
    });
}

function extractIdentificadorElectronico(pdfContent) {
  const regex = /Identificador Electrónico\s*([^\n]+)/i;
  const match = pdfContent.match(regex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return null;
}

function extractClaveRegistroPoblacion(pdfContent) {
  const regex = /Clave Única de Registro de Población\s*([^\n]+)/i;
  const match = pdfContent.match(regex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return null;
}

function extractEntidadRegistro(pdfContent) {
  const regex = /Entidad de Registro\s*([^\n]+)/i;
  const match = pdfContent.match(regex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return null;
}


function generarFolio(identificadorElectronico) {
    const anio = identificadorElectronico.substring(0, 2);
    const numerosFolio = identificadorElectronico.substring(2).replace(/^0+/, ''); // Eliminar ceros iniciales
    const folio = `A${anio} ${numerosFolio.slice(-7)}`; // Tomar solo los últimos 7 dígitos
  
    return folio;
  }
  
  
  
  
  
  


module.exports = {
  handlePDFUpload,
}; 


//Algoritmo original:

/* app.post('/CargarPDF', upload.single('pdfFile'), (req, res) => {
  if (!req.file) {
    // No se seleccionó ningún archivo
    return res.status(400).send('No se seleccionó ningún archivo PDF.');
  }

  // El archivo se subió correctamente
  const filePath = req.file.path;
  const options = {};

  PDFParser(filePath, options)
    .then(data => {
      const pdfContent = data.text;
      // La línea comentada imprime todo el contenido del PDF
      //console.log(`Contenido del archivo PDF '${req.file.filename}':`, pdfContent);
      // Extraemos solo lods datos que nos interesan
      console.log('\n' + `Contenido del archivo PDF '${req.file.filename}':`);

      // Extraer datos específicos del contenido del PDF
      const identificadorElectronico = extractIdentificadorElectronico(pdfContent);
      const claveRegistroPoblacion = extractClaveRegistroPoblacion(pdfContent);
      const entidadRegistro = extractEntidadRegistro(pdfContent);
  

      // Imprimir los datos en la consola del servidor
      console.log('Identificador Electrónico:', identificadorElectronico);
      console.log('Clave Única de Registro de Población:', claveRegistroPoblacion);
      console.log('Entidad de Registro:', entidadRegistro);
      

      // Envía una respuesta de éxito al cliente
      res.json({ success: true });
    })
    .catch(error => {
      console.log('Error al leer el PDF:', error);
      res.status(500).json({ success: false, error: 'Error al leer el PDF' });
    });
});

function extractIdentificadorElectronico(pdfContent) {
  const regex = /Identificador Electrónico\s*([^\n]+)/i;
  const match = pdfContent.match(regex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return null;
}

function extractClaveRegistroPoblacion(pdfContent) {
  const regex = /Clave Única de Registro de Población\s*([^\n]+)/i;
  const match = pdfContent.match(regex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return null;
}

function extractEntidadRegistro(pdfContent) {
  const regex = /Entidad de Registro\s*([^\n]+)/i;
  const match = pdfContent.match(regex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return null;
}
 */