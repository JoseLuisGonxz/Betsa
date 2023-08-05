const { PDFDocument, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const bwipjs = require("bwip-js");
const { generarFolio } = require("../models/folioGenerator");

async function aplicarFolio(filePath, identificadorElectronico) {
  try {
    // Cargar el PDF existente
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Obtener la fuente Helvetica
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Generar el folio
    const folio = generarFolio(identificadorElectronico);

    // Generar el código de barras
    const barcodeOptions = {
      bcid: "code128", // Tipo de código de barras (puedes ajustarlo según tus necesidades)
      text: folio, // Texto para generar el código de barras
      scale: 2, // Escala del código de barras
      height: 10, // Altura del código de barras
    };
    const barcodeData = await bwipjs.toBuffer(barcodeOptions);

    // Añadir el folio, el título y el código de barras a cada página del PDF
    const pages = pdfDoc.getPages();
    pages.forEach(async (page) => {
      const { width, height } = page.getSize();
      const fontSize = 12;

      // Dibujar el título "FOLIO"
      const titulo = "FOLIO";
      const tituloWidth = font.widthOfTextAtSize(titulo, fontSize);
      page.drawText(titulo, {
        x: 50,
        y: height - 50,
        size: fontSize,
        font: font,
        align: "center",
      });

      // Dibujar el folio
      const folioWidth = font.widthOfTextAtSize(folio, fontSize);
      page.drawText(folio, {
        x: 50,
        y: height - 70,
        size: fontSize,
        font: font,
        align: "center",
      });

      // Insertar el código de barras en el PDF
      const barcodeImage = await pdfDoc.embedPng(barcodeData);

      // Ajustar el tamaño del código de barras
      const barcodeWidth = 80; // Ancho deseado del código de barras
      const barcodeHeight = 15; // Alto deseado del código de barras
      
      page.drawImage(barcodeImage, {
        x: 50, // Ajustar la posición del código de barras según tus necesidades
        y: height - 120, // Ajustar la posición del código de barras según tus necesidades
        width: barcodeWidth,
        height: barcodeHeight,
        scaleToFit: true, // Ajustar automáticamente el tamaño del código de barras
      });
      
    });

    // Guardar el PDF modificado con el folio, el título y el código de barras
    const modifiedPdfBytes = await pdfDoc.save();
    const modifiedPdfPath = `./uploads/conFolio-${Date.now()}.pdf`;
    fs.writeFileSync(modifiedPdfPath, modifiedPdfBytes);

    // Retornar la ruta del PDF modificado
    return modifiedPdfPath;
  } catch (error) {
    console.log("Error al aplicar el folio al PDF:", error);
    throw new Error("Error al aplicar el folio al PDF");
  }
}

module.exports = { aplicarFolio };
