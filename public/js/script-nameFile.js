// Obtener el input de tipo file
const input = document.getElementById("pdfFile");

// Agregar escuchador de eventos al cambiar el valor del input
input.addEventListener("change", () => {
  // Obtener el nombre del archivo seleccionado
  const fileName = input.files[0].name;

  // Mostrar el nombre del archivo en la etiqueta label correspondiente
  const label = document.querySelector(".custom-file-label");
  label.textContent = fileName;
});