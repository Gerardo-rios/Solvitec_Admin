document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("editarPerfilBtn")
    .addEventListener("click", function () {
      document.getElementById("formularioEdicion").style.display = "block";
    });

  document
    .getElementById("guardarCambiosBtn")
    .addEventListener("click", function () {
      var nombre = document.getElementById("nombrePerfil").value;
      var foto = document.getElementById("fotoPerfilUrl").value;

      fetch("/perfil/editar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            nombre: nombre,
            foto: foto,
          },
        }),
      })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
          // Aquí, ocultamos el formulario de edición
          document.getElementById("formularioEdicion").style.display = "none";
          // Actualiza la interfaz del usuario según sea necesario
          document.getElementById("fotoPerfil").src = foto;
          alert("Perfil editado exitosamente");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
});
