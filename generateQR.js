const fs = require("fs");
const qrcode = require("qrcode");
const {
  extractIdentificadorElectronico,
  extractClaveRegistroPoblacion,
} = require("./utils/pdfExtract"); // Asegúrate de proporcionar la ruta correcta al archivo pdfExtract.js

async function generateQR() {
  // Simulamos el contenido del PDF que debe extraerse
  const pdfContent = "Identificador Electrónico: 12345\nClave Única de Registro de Población: 67890";

  // Obtener el Identificador Electrónico y la Clave Única de Registro de Población
  const identificadorElectronico = extractIdentificadorElectronico(pdfContent);
  const claveRegistroPoblacion = extractClaveRegistroPoblacion(pdfContent);

  // Verificar si se obtuvieron los valores correctamente
  console.log("Identificador Electrónico:", identificadorElectronico);
  console.log("Clave Única de Registro de Población:", claveRegistroPoblacion);

  // Combinar los datos para el código QR
  const dataToEncode = `${identificadorElectronico},${claveRegistroPoblacion}`;

  try {
    // Generar el código QR
    const qrCodeDataUrl = await qrcode.toDataURL(dataToEncode);

    // Convertir la representación base64 a buffer
    const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(",")[1], "base64");

    // Guardar el código QR como imagen en la carpeta "qr"
    const qrCodeImagePath = "./qr/qrcode.png";
    fs.writeFileSync(qrCodeImagePath, qrCodeBuffer);

    console.log("Código QR generado y guardado:", qrCodeImagePath);
  } catch (error) {
    console.error("Error al generar el código QR:", error);
  }
}

// Llamar a la función para generar el Código QR
generateQR();
