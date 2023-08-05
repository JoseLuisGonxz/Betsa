document.getElementById("pdfForm").addEventListener("submit", (event) => {
  event.preventDefault(); // Evitar el envío del formulario
  const formData = new FormData(event.target);

  // Realizar la solicitud al servidor
  fetch("/CargarPDF", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      // Actualizar los valores en los elementos del DOM
      document.getElementById("identificadorElectronico").textContent = data.identificadorElectronico;
      document.getElementById("claveRegistroPoblacion").textContent = data.claveRegistroPoblacion;
      document.getElementById("entidadRegistro").textContent = data.entidadRegistro;

      // Mostrar el contenedor de datos capturados
      document.getElementById("pdfData").style.display = "block";

      // Verificar si se recibió el folio generado y mostrarlo en la interfaz
      if (data.folio) {
        document.getElementById("folioContainer").style.display = "block";
        document.getElementById("folio").textContent = data.folio;
      } else {
        document.getElementById("folioContainer").style.display = "none";
      }
    })
    .catch((error) => console.log(error));
});

// Obtén todos los elementos con el atributo data-copy
const copyElements = document.querySelectorAll('[data-copy]');

// Agrega el evento click a cada elemento
copyElements.forEach((element) => {
  element.addEventListener('click', () => {
    const text = element.textContent; // Obtén el contenido del elemento
    copyToClipboard(text); // Llama a la función para copiar al portapapeles
  });
});

// Función para copiar al portapapeles y mostrar mensaje
function copyToClipboard(text) {
  const tempElement = document.createElement('textarea');
  tempElement.value = text;
  document.body.appendChild(tempElement);
  tempElement.select();
  document.execCommand('copy');
  document.body.removeChild(tempElement);

  showCopyMessage('¡Contenido copiado!');
}

// Función para mostrar el mensaje de copiado
function showCopyMessage(message) {
  const copyMessage = document.getElementById('copyMessage');
  copyMessage.textContent = message;
  copyMessage.classList.add('show');

  setTimeout(() => {
    copyMessage.classList.remove('show');
  }, 2000);
}
