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
    const entidadRegistroRegex = /(Aguascalientes|Baja California|Baja California Sur|Campeche|Chiapas|Chihuahua|Ciudad de Mexico|Coahuila|Colima|Durango|Guanajuato|Guerrero|Hidalgo|Jalisco|Mexico|Michoacan de ocampo|Morelos|Nayarit|Nuevo Leon|Oaxaca|Puebla|Queretaro|Quintana Roo|San Luis Potosi|Sinaloa|Sonora|Tabasco|Tamaulipas|Tlaxcala|Veracruz|Yucatan|Zacatecas|Estados Unidos)/i;

    const identificadorElectronico = pdfContent.match(identificadorElectronicoRegex);
    const claveRegistroPoblacion = pdfContent.match(claveRegistroPoblacionRegex);
    const entidadRegistro = pdfContent.match(entidadRegistroRegex);

    // Devolver un objeto con la información extraída
    return {
      identificadorElectronico: identificadorElectronico ? identificadorElectronico[0] : 'IE no encontrada',
      claveRegistroPoblacion: claveRegistroPoblacion ? claveRegistroPoblacion[0] : 'CURP no ecncontrada',
      entidadRegistro: entidadRegistro ? entidadRegistro[0] : 'ER no encontrada',
    };
  } catch (error) {
    console.error('Error al leer el PDF:', error.message);
    return null;
  }
}
module.exports = {
  extractInfoFromPDF
};
