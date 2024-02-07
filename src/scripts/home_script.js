$(document).ready(function () {
  // Delegación de evento para botón aceptar
  $(document).on("click", ".btn-success", function () {
    var citaId = $(this).data("id");
    enviarCita(citaId, "aceptar");
  });

  // Delegación de evento para botón rechazar
  $(document).on("click", ".btn-danger", function () {
    var citaId = $(this).data("id");
    enviarCita(citaId, "rechazar");
  });

  function enviarCita(id, accion) {
    $.ajax({
      url: `/home/${accion}-cita`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id: id }),
      success: function (data) {
        console.log(data);
        // Aquí puedes redirigir al usuario o actualizar la página de alguna manera
        window.location.reload();
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  }
});
