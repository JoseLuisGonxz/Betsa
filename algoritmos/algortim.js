const fs = require('fs');
const PDFParser = require('pdf-parse');

// Función para extraer la información de un PDF
async function extractInfoFromPDF(pdfPath) {
  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await PDFParser(pdfBuffer);

    const pdfContent = pdfData.text;

    const identificadorElectronicoRegex = /\b\d{20}\b/;
    const claveRegistroPoblacionRegex = /\b[A-Za-z0-9]{18}\b/;
    const entidadRegistroRegex = /(Aguascalientes|Baja California|Baja California Sur|Campeche|Chiapas|Chihuahua|Ciudad de México|Coahuila|Colima|Durango|Guanajuato|Guerrero|Hidalgo|Jalisco|México|Michoacán|Morelos|Nayarit|Nuevo León|Oaxaca|Puebla|Querétaro|Quintana Roo|San Luis Potosí|Sinaloa|Sonora|Tabasco|Tamaulipas|Tlaxcala|Veracruz|Yucatán|Zacatecas)/i;

    const identificadorElectronico = pdfContent.match(identificadorElectronicoRegex);
    const claveRegistroPoblacion = pdfContent.match(claveRegistroPoblacionRegex);
    const entidadRegistro = pdfContent.match(entidadRegistroRegex);

    return {
      identificadorElectronico: identificadorElectronico ? identificadorElectronico[0] : null,
      claveRegistroPoblacion: claveRegistroPoblacion ? claveRegistroPoblacion[0] : null,
      entidadRegistro: entidadRegistro ? entidadRegistro[0] : null,
    };
  } catch (error) {
    console.error('Error al leer el PDF:', error.message);
    return null;
  }
}

module.exports = {
  extractInfoFromPDF
};
