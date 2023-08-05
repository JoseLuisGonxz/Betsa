const { PDFDocument, PageSizes } = require("pdf-lib");
const fs = require("fs");

// Función para aplicar el margen al PDF
async function aplicarMargen(filePath, req) {
  try {
    // Creamos un nuevo PDF y agregamos la primera página en blanco con el margen
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(PageSizes.Letter); // Definimos el tamaño de la primera página
    const { width, height } = page.getSize();

    // Cargamos el margen que vamos a agregar al PDF
    const margenPdfBytes = fs.readFileSync("./public/utils/marca_de_agua.pdf");
    const margenPdfDoc = await PDFDocument.load(margenPdfBytes);
    const [margenPage] = await pdfDoc.copyPages(margenPdfDoc, [0]);
    margenPage.setWidth(width);
    margenPage.setHeight(height);

    // Agregamos el margen a la página en blanco
    const embeddedMargenPage = await pdfDoc.embedPage(margenPage);
    page.drawPage(embeddedMargenPage, {
      x: 1, //posicion horizontal
      y: -2, //postición vertical
      width: page.getWidth(),
      height: page.getHeight(),
    });

    // Cargamos el PDF subido por el usuario y lo agregamos a la primera página del nuevo PDF
    const uploadedPdfBytes = fs.readFileSync(filePath);
    const uploadedPdfDoc = await PDFDocument.load(uploadedPdfBytes);
    const [uploadedPage] = await pdfDoc.copyPages(uploadedPdfDoc, [0]);
    const embeddedUploadedPage = await pdfDoc.embedPage(uploadedPage);
    page.drawPage(embeddedUploadedPage, {
      x: 0,
      y: 8.9, // Esta posición es la del PDF cargado por el usuario
      width: page.getWidth(),
      height: page.getHeight(),
    });

    // Guardamos el PDF con el margen
    const pdfBytes = await pdfDoc.save();
    const pdfName = `${req.file.originalname}.pdf`;
    fs.writeFileSync(pdfName, pdfBytes);

    // Definir la ruta y el nombre del PDF modificado
    const modifiedPdfPath = `./uploads/conMargen-${Date.now()}.pdf`;

    // Guardar el PDF modificado en la ruta especificada
    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(modifiedPdfPath, modifiedPdfBytes);

    // Retornar la ruta del PDF modificado
    return modifiedPdfPath;
  } catch (error) {
    console.log("Error al aplicar el margen al PDF:", error);
    throw new Error("Error al aplicar el margen al PDF");
  }
}

module.exports = { aplicarMargen };
