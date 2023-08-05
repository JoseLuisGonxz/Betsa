var toggleCheckboxButton = document.getElementById(
    "toggleCheckboxButton"
  );
  var formContainer = document.getElementById("formContainer");
  var closeButton = document.getElementById("closeButton");

  toggleCheckboxButton.addEventListener("click", function () {
    formContainer.classList.toggle("show");
  });

  closeButton.addEventListener("click", function () {
    formContainer.classList.remove("show");
  });