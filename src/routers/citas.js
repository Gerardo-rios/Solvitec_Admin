const { Router } = require("express");
const { db } = require("../firebase");
const route = Router();
const { auth } = require("../auth/session_auth");
const {
  escribirEnFirestore,
  leerConFiltroFirestore,
  obtenerUsuarioPorCitaId,
} = require("../utils/firestore_utils");
const { doc, setDoc, collection } = require("firebase/firestore/lite");
const crypto = require("crypto");

// Ruta para marcar una cita como aceptada
route.get("/cita", auth, async (req, res) => {
  try {
    const citas = await leerConFiltroFirestore("Citas", [
      "status",
      "==",
      "aceptada",
    ]);
    res.render("citas", {
      citas: citas,
      scripts: '<script src="/js/citas_script.js"></script>',
    });
  } catch (error) {
    // El manejo de errores ya se hace dentro de leerConFiltroFirestore, pero puedes añadir acciones adicionales si es necesario
    res.status(500).send("Error al cargar citas");
  }
});

// Ruta para marcar una cita como atendida
route.post("/cita/atender", auth, async (req, res) => {
  try {
    const { id, datos } = req.body;
    const usuario = await obtenerUsuarioPorCitaId(id);
    await escribirRegistroMedico(usuario.cedula, datos);
    await escribirEnFirestore("Citas", { status: "atendida" }, id);
    res.send("Cita atendida exitosamente");
  } catch (error) {
    console.error("Error al atender cita:", error);
    res.render("error", {
      errorMessage: "Error al atender cita: " + error,
      errorCode: "500",
    });
  }
});

// Ruta para marcar una cita como no se presentó
route.post("/cita/no-presentada", auth, async (req, res) => {
  try {
    const { id } = req.body;
    const usuario = await obtenerUsuarioPorCitaId(id);
    await escribirRegistroMedico(usuario.cedula, {
      fechaRevision: new Date().toISOString(),
      motivo: "No se presentó",
      proximaVisita: "",
      sobre: "",
    });
    await escribirEnFirestore("Citas", { status: "cancelada" }, id);
    res.send("Cita marcada como no presentada exitosamente");
  } catch (error) {
    console.error("Error al marcar cita como no presentada:", error);
    res.render("error", {
      errorMessage: "Error al marcar cita como no presentada: " + error,
      errorCode: "500",
    });
  }
});

// Función para escribir un registro médico
async function escribirRegistroMedico(cedula, datos) {
  // Referencia al documento de la cédula
  const cedulaRef = doc(db, "registro_medico", cedula);

  // Generar UUIDs o utilizar los proporcionados por alguna lógica específica
  const primerUUID = crypto.randomUUID();
  const segundoUUID = crypto.randomUUID();

  // Combinar las referencias para apuntar al documento final usando los UUIDs como parte del path
  const documentoFinalRef = doc(
    db,
    "registro_medico",
    `${cedula}/${primerUUID}/${segundoUUID}`
  );

  // Escribir los datos en el documento final
  await setDoc(documentoFinalRef, {
    fechaRevision: datos.fechaRevision,
    motivo: datos.motivo,
    proximaVisita: datos.proximaVisita,
    sobre: datos.sobre,
  });

  console.log(
    `Datos escritos correctamente en: registro_medico/${cedula}/${primerUUID}/${segundoUUID}`
  );
}

module.exports = route;
