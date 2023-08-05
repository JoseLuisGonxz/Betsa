//routes\cargarPDF.js
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const { PDFDocument, PageSizes, TextRenderingMode } = require("pdf-lib");
const fs = require("fs");
const PDFParser = require("pdf-parse");
const bwipjs = require("bwip-js");
const path = require("path");
const qr = require("qrcode");

const { generarFolio, generarCodigoBarras, } = require("../models/folioGenerator");
const { generarFolioPDF } = require("../controllers/folioController");
const folioController = require("../controllers/folioController");

const { extractIdentificadorElectronico, extractClaveRegistroPoblacion, extractEntidadRegistro } = require("../utils/pdfExtract");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Verificar si la carpeta 'qr' existe, si no, créala
const qrFolderPath = path.join(__dirname, "../qr");
if (!fs.existsSync(qrFolderPath)) {
  fs.mkdirSync(qrFolderPath);
}

router.post("/", upload.single("pdfFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No se seleccionó ningún archivo PDF.");
  }

  try {
    const filePath = req.file.path;
    const options = {};

    // Obtener la configuración seleccionada por el cliente
    const margenSeleccionado = req.body.margenSeleccionado === "true";
    const reversoSeleccionado = req.body.reversoSeleccionado === "true";
    const folioSeleccionado = req.body.folioSeleccionado === "true";
    const aplicarSeleccionado = req.body.aplicarSeleccionado === "true";
    const codigoQRSeleccionado = req.body.codigoQRSeleccionado === "true";

    PDFParser(filePath, options)
      .then(async (data) => {
        const pdfContent = data.text;
        // Extraer datos específicos del contenido del PDF
        const identificadorElectronico =
          extractIdentificadorElectronico(pdfContent);
        const claveRegistroPoblacion =
          extractClaveRegistroPoblacion(pdfContent);
        const entidadRegistro = extractEntidadRegistro(pdfContent);
        const folio = generarFolio(identificadorElectronico);

        // Crear un objeto con los datos a enviar al cliente
        const responseData = {
          identificadorElectronico,
          claveRegistroPoblacion,
          entidadRegistro,
          folio,
        };

        // Enviar los datos como respuesta al cliente
        res.status(200).json(responseData);

        // Imprimir los datos en la consola del servidor
        console.log("\n", `Contenido del archivo PDF '${req.file.filename}':`);
        console.log("Identificador Electrónico:", identificadorElectronico);
        console.log("Clave Única de Registro de Población:", claveRegistroPoblacion);
        console.log("Entidad de Registro:", entidadRegistro);
        console.log("Folio:", folio);
        console.log("Margen seleccionado:", margenSeleccionado);
        console.log("Reverso seleccionado:", reversoSeleccionado);
        console.log("Folio seleccionado:", folioSeleccionado);
        console.log("Código QR seleccionado:", codigoQRSeleccionado);
        console.log("Aplicar cambios seleccionado:", aplicarSeleccionado);
        //console.log('Contenido del PDF:', pdfContent);

        
        // Creamos un nuevo PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage(PageSizes.Letter); // Definimos el tamaño de la página
        const { width, height } = page.getSize();

        const modifiedPdfPath = `./uploads/${claveRegistroPoblacion}.pdf`;
        await pdfDoc.save(modifiedPdfPath);

        // Para el checkbox de Margen
        if (margenSeleccionado) {
          try {
            // Cargamos el margen que vamos a agregar al PDF
            const margenPdfBytes = fs.readFileSync(
              "./public/utils/marca_de_agua.pdf"
            );
            const margenPdfDoc = await PDFDocument.load(margenPdfBytes);
            const [margenPage] = await pdfDoc.copyPages(margenPdfDoc, [0]);
            margenPage.setWidth(width);
            margenPage.setHeight(height);

            const embeddedMargenPage = await pdfDoc.embedPage(margenPage);
            page.drawPage(embeddedMargenPage, {
              x: 1, //posicion horizontal
              y: -2, //postición vertical
              width: page.getWidth(),
              height: page.getHeight(),
            });
          } catch (error) {
            console.log("Error al aplicar el margen al PDF:", error);
            throw new Error("Error al aplicar el margen al PDF");
          }
        }

        // Cargamos el PDF subido por el usuario y lo agregamos al nuevo PDF
        if (fs.existsSync(filePath)) {
          try {
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
          } catch (error) {
            console.log(
              "Error al agregar el PDF cargado por el usuario:",
              error
            );
            throw new Error("Error al agregar el PDF cargado por el usuario");
          }
        }

        // Si el checkbox 'codigoQR' está seleccionado, generamos el código QR
        /* if (codigoQRSeleccionado) {
          // Generamos el contenido del código QR con la información extraída del PDF
          const qrContent = `Identificador Electrónico: ${identificadorElectronico}, Clave Única de Registro de Población: ${claveRegistroPoblacion}`;

          // Generamos el código QR y lo guardamos como imagen en la carpeta "qr"
          const qrImagePath = path.join(__dirname, "../qr", "codigoQR.png");
          qr.toFile(qrImagePath, qrContent, function (err) {
            if (err) {
              console.error("Error al generar el código QR:", err);
              throw new Error("Error al generar el código QR");
            }

            console.log("Código QR generado y guardado en la carpeta 'qr'.");

          });
        }  */
        // Para el checkbox de Reverso (Esta versión solamente lo añade sin ningún cambio)
        /* if (reversoSeleccionado) {
          try {
            const reversoPath = `./public/reversos/${entidadRegistro.toLowerCase()}.pdf`;
            if (fs.existsSync(reversoPath)) {
              const reversoPdfBytes = fs.readFileSync(reversoPath);
              const reversoPdfDoc = await PDFDocument.load(reversoPdfBytes);
              const [reversoPage] = await pdfDoc.copyPages(reversoPdfDoc, [0]);
              pdfDoc.addPage(reversoPage);
            } else {
              console.log(
                `Reverso para la entidad de registro "${entidadRegistro}" no encontrado.`
              );
              throw new Error("Reverso no encontrado");
            }
          } catch (error) {
            console.log("Error al aplicar el reverso al PDF:", error);
            throw new Error("Error al aplicar el reverso al PDF");
          }
        }
 */

        // Declara la variable qrImagePath
        let qrImagePath;

        try {
          // Si el checkbox 'codigoQR' está seleccionado, generamos el código QR
          if (codigoQRSeleccionado) {
          // Generamos el contenido del código QR con la información extraída del PDF
          // const qrContent = `Identificador Electrónico: ${identificadorElectronico}, Clave Única de Registro de Población: ${claveRegistroPoblacion}`;
          // Generamos el contenido del código QR con la información extraída del PDF
          const qrContent = `CURP: ${claveRegistroPoblacion}\nIdentificador electrónico: ${identificadorElectronico}`;

            // Generamos el código QR y lo guardamos como imagen en la carpeta "qr"
            qrImagePath = path.join(__dirname, "../qr", "codigoQR.png");
            await new Promise((resolve, reject) => {
              qr.toFile(qrImagePath, qrContent, function (err) {
                if (err) {
                  console.error("Error al generar el código QR:", err);
                  reject("Error al generar el código QR");
                }

                console.log("Código QR generado y guardado en la carpeta 'qr'.");
                resolve();
              });
            });
          }

          // Para el checkbox de Reverso
          if (reversoSeleccionado) {
            const reversoPath = `./public/reversos/${entidadRegistro.toLowerCase()}.pdf`;
            if (fs.existsSync(reversoPath)) {
              const reversoPdfBytes = fs.readFileSync(reversoPath);
              const reversoPdfDoc = await PDFDocument.load(reversoPdfBytes);
              const [reversoPage] = await pdfDoc.copyPages(reversoPdfDoc, [0]);

              // Si el checkbox 'codigoQR' está seleccionado, agregamos el código QR al reverso
              if (codigoQRSeleccionado) {
                // Cargamos el código QR generado
                const qrImageBytes = fs.readFileSync(qrImagePath);
                const qrImage = await pdfDoc.embedPng(qrImageBytes);

                // Insertamos el código QR en el reverso
                reversoPage.drawImage(qrImage, {
                  x: 23, // Ajustar la posición horizontal del código QR en el reverso
                  y: 700, // Ajustar la posición vertical del código QR en el reverso
                  width: 76, // Ajustar el ancho del código QR en el reverso
                  height: 76, // Ajustar el alto del código QR en el reverso
                });

                // Agregamos el contenido de 'curp' justo debajo del qr
                reversoPage.drawText(claveRegistroPoblacion, {
                  x: 30,
                  y: 702,
                  size: 5
                });
                
              }

              pdfDoc.addPage(reversoPage);
            } else {
              console.log(
                `Reverso para la entidad de registro "${entidadRegistro}" no encontrado.`
              );
              throw new Error("Reverso no encontrado");
            }
          }

        } catch (error) {
          console.log("Error al procesar el PDF:", error);
          res.status(500).json({ success: false, error: "Error al procesar el PDF" });
        }


        // Para el checkbox de Folio
        if (folioSeleccionado) {
          // Generar el folio
          const folio = generarFolio(identificadorElectronico);

          // Añadir el folio, el título y el código de barras a la primera página del PDF
          const firstPage = pdfDoc.getPages()[0];
          const { width, height } = firstPage.getSize();
          const fontSize = 11;

          // Dibujar el título "FOLIO"
          const titulo = "FOLIO";
          firstPage.drawText(titulo, {
            x: 105,
            y: height - 51,
            size: fontSize,
            align: "center",
          });

          // Dibujar el folio
          firstPage.drawText(folio, {
            x: 88,
            y: height - 63,
            size: fontSize,
            align: "center",
          });

          // Generar el código de barras para el folio de la primera página
          const barcodeOptions = {
            bcid: "code128", // Tipo de código de barras (puedes ajustarlo según tus necesidades)
            text: folio, // Texto para generar el código de barras
            scale: 3, // Escala del código de barras
            height: 10, // Altura del código de barras
          };
          const barcodeData = await bwipjs.toBuffer(barcodeOptions);

          // Insertar el código de barras en el PDF
          const barcodeImage = await pdfDoc.embedPng(barcodeData);

          // Ajustar el tamaño del código de barras
          const barcodeWidth = 90; // Ancho deseado del código de barras
          const barcodeHeight = 14; // Alto deseado del código de barras

          firstPage.drawImage(barcodeImage, {
            x: 75, // Ajustar la posición del código de barras según tus necesidades
            y: height - 80, // Ajustar la posición del código de barras según tus necesidades
            width: barcodeWidth,
            height: barcodeHeight,
            scaleToFit: true, // Ajustar automáticamente el tamaño del código de barras
          });
        }

        // Para el checkbox de Aplicar cambios
        if (aplicarSeleccionado) {
          try {
            const modifiedPdfBytes = await pdfDoc.save();
            fs.writeFileSync(modifiedPdfPath, modifiedPdfBytes);
          } catch (error) {
            console.log("Error al aplicar los cambios al PDF:", error);
            throw new Error("Error al aplicar los cambios al PDF");
          }
        }
      })
      .catch((error) => {
        console.log("Error al leer el PDF:", error);
        res.status(500).json({ success: false, error: "Error al leer el PDF" });
      });
  } catch (error) {
    console.log("Error al procesar el PDF:", error);
    res.status(500).json({ success: false, error: "Error al procesar el PDF" });
  }
});

module.exports = router;
 