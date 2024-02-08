const { Router } = require("express");
const { db } = require("../firebase");
const route = Router();
const { auth } = require("../auth/session_auth");
const {
  leerDeFirestore,
  obtenerUsuarioPorCitaId,
} = require("../utils/firestore_utils");

route.get("/registro_medico", auth, async (req, res) => {
  try {
    const registros = await obtenerTodosLosRegistrosMedicos();
    res.render("registros_medicos", {
      registrosMedicos: registros,
    });
  } catch (error) {
    res.render("error", {
      errorMessage: "Error al cargar registros médicos: " + error,
      errorCode: "500",
    });
  }
});

async function obtenerTodosLosRegistrosMedicos() {
  const todosLosRegistros = await leerDeFirestore("registro_medico");
  for (let registro of todosLosRegistros) {
    registro["cita"] = await obtenerCitaPorId(registro.citaId);
    registro["usuario"] = await obtenerUsuarioPorCitaId(registro.citaId);
  }
  return todosLosRegistros;
}

async function obtenerCitaPorId(citaId) {
  const cita = await leerDeFirestore("Citas", citaId);
  if (cita.length) {
    return undefined;
  }
  cita.fecha = new Date(cita.fecha).toLocaleDateString("es-ES");
  return cita;
}

module.exports = route;
