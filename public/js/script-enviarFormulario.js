var pdfForm = document.getElementById("pdfForm");

pdfForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
  // Obtener el valor de la configuración seleccionada
  /* Para el margen */
  var margenCheckbox = document.getElementById("margenCheckbox");
  var margenSeleccionado = margenCheckbox.checked;
  /* Para el reverso*/
  var reversoCheckbox = document.getElementById("reversoCheckbox");
  var reversoSeleccionado = reversoCheckbox.checked;
  /* Para el folio */
  var folioCheckbox = document.getElementById("folioCheckbox");
  var folioSeleccionado = folioCheckbox.checked;
  /* Para el qr */
  var codigoQRCheckbox = document.getElementById("codigoQRCheckbox");
  var codigoQRSeleccionado = codigoQRCheckbox.checked;
  /* Para aplicar cambios */
  var aplicarCheckbox = document.getElementById("aplicarCheckbox");
  var aplicarSeleccionado = aplicarCheckbox.checked;

  // Crear un objeto FormData para enviar los datos al servidor
  var formData = new FormData(pdfForm);
  formData.append("margenSeleccionado", margenSeleccionado);
  formData.append("reversoSeleccionado", reversoSeleccionado);
  formData.append("folioSeleccionado", folioSeleccionado);
  formData.append("codigoQRSeleccionado", codigoQRSeleccionado);
  formData.append("aplicarSeleccionado", aplicarSeleccionado);

  // Realizar la solicitud POST al servidor con el PDF y la configuración
  fetch("/CargarPDF", {
    method: "POST",
    body: formData,
  })
    .then(function (response) {
      // Manejar la respuesta del servidor
      return response.json();
    })
    .then(function (data) {
      // Manejar los datos de respuesta del servidor
      console.log(data);
      // Mostrar notificación de carga exitosa
      // Configuración de las notificaciones
      // Configuración de las notificaciones
      function showNotification() {
        const notification = document.createElement("div");
        notification.classList.add("notification", "slide-in", "active");

        const icon = document.createElement("i");
        icon.classList.add("notification-icon", "fas", "fa-check-circle");

        const title = document.createElement("div");
        title.classList.add("notification-title");
        title.textContent = "";

        const message = document.createElement("div");
        message.classList.add("notification-message");
        message.textContent = "PDF cargado correctamente!";

        const closeBtn = document.createElement("i");
        closeBtn.classList.add("notification-close", "fas", "fa-times");
        closeBtn.addEventListener("click", function () {
          notification.classList.remove("active");
          setTimeout(function () {
            notification.remove();
          }, 500);
        });

        notification.appendChild(icon);
        notification.appendChild(title);
        notification.appendChild(message);
        notification.appendChild(closeBtn);

        document.body.appendChild(notification);

        setTimeout(function () {
          notification.classList.remove("active");
          setTimeout(function () {
            notification.remove();
          }, 300);
        }, 500);
      }

      // Ejemplo de uso
      showNotification();
    })
    .catch(function (error) {
      // Manejar los errores de la solicitud
      console.error(error);
    });
});
