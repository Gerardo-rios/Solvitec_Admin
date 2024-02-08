document.addEventListener("DOMContentLoaded", function () {
  // Mostrar formulario de atencion
  document.querySelectorAll(".atenderCitaBtn").forEach((button) => {
    button.addEventListener("click", function () {
      var cardBody = this.closest(".card-body");
      cardBody.querySelector(".formularioAtencion").style.display = "block"; // Mostrar el formulario
    });
  });

  // Ocultar formulario de atencion
  document.querySelectorAll(".cancelarAtencionBtn").forEach((button) => {
    button.addEventListener("click", function () {
      var cardBody = this.closest(".card-body");
      cardBody.querySelector(".formularioAtencion").style.display = "none"; // Ocultar el formulario
    });
  });

  const fechaHoy = new Date().toISOString().slice(0, 10); // Obtener la fecha actual en formato yyyy-mm-dd
  document.querySelectorAll('[id^="fechaAtencion-"]').forEach((input) => {
    input.value = fechaHoy;
  });
});

document.querySelectorAll(".formularioAtencion form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Suponiendo que tienes acceso al ID de la cita y la cédula de alguna manera
    const citaId = this.closest(".card").id; // Asegúrate de que esto refleje cómo estás asignando IDs a las tarjetas

    const datos = {
      fechaRevision: this.querySelector('[name="fechaAtencion"]').value,
      proximaVisita: this.querySelector('[name="proximaFechaRevision"]').value,
      motivo: this.querySelector('[name="motivo"]').value,
      sobre: this.querySelector('[name="sobre"]').value,
    };

    fetch("/cita/atender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: citaId.replace("cita-", ""),
        datos: datos,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al atender cita");
        }
        return response.text();
      })
      .then((data) => {
        console.log(data);
        alert("Cita atendida exitosamente");
        document.querySelector(".formularioAtencion").style.display = "none"; // Ocultar el formulario
        window.location.reload(); // Recargar la página después de atender la cita
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  document.querySelectorAll(".noPresenteBtn").forEach((button) => {
    button.addEventListener("click", function () {
      const citaId = this.getAttribute("data-id");

      fetch("/cita/no-presentada", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: citaId }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al marcar cita como no presentada");
          }
          return response.text();
        })
        .then((data) => {
          console.log(data);
          alert("Cita marcada como no presentada exitosamente");
          window.location.reload(); // Recargar la página después de marcar la cita como no presentada
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
});
