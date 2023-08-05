const { PDFDocument } = require("pdf-lib");
const fs = require("fs");

async function aplicarReverso(filePath, entidadRegistro) {
  try {
    const pdfDoc = await PDFDocument.load(fs.readFileSync(filePath));
    const reversoPath = `./public/reversos/${entidadRegistro.toLowerCase()}.pdf`;

    if (fs.existsSync(reversoPath)) {
      const reversoPdfBytes = fs.readFileSync(reversoPath);
      const reversoPdfDoc = await PDFDocument.load(reversoPdfBytes);

      const [reversoPage] = await pdfDoc.copyPages(reversoPdfDoc, [0]);
      pdfDoc.addPage(reversoPage);

      const modifiedPdfPath = `./uploads/conReverso-${Date.now()}.pdf`;
      const modifiedPdfBytes = await pdfDoc.save();
      fs.writeFileSync(modifiedPdfPath, modifiedPdfBytes);

      return modifiedPdfPath;
    } else {
      console.log(`Reverso para la entidad de registro "${entidadRegistro}" no encontrado.`);
      throw new Error("Reverso no encontrado");
    }
  } catch (error) {
    console.log("Error al aplicar el reverso al PDF:", error);
    throw new Error("Error al aplicar el reverso al PDF");
  }
}

module.exports = { aplicarReverso };
