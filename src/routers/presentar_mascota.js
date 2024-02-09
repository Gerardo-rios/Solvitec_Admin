const express = require("express");
const router = express.Router();
const { auth } = require("../auth/session_auth");
const {
  leerDeFirestore,
  leerConFiltroFirestore,
} = require("../utils/firestore_utils");

router.get("/presentar_mascota/:id/:cita_id?", auth, async (req, res) => {
  let id = req.params.id;
  let idCita = req.params.cita_id;

  const usuario = await leerDeFirestore("usuario", id);
  const cedula = usuario.cedula;
  const mascotas = await leerConFiltroFirestore("Mascotas", [
    "dueño",
    "==",
    cedula,
  ]);

  res.render("presentar_mascota", { contacto: usuario, mascotas: mascotas, cita_id: idCita });

});

router.get("/editar/:id_mascota/:id_cita?", (req, res) => {
  res.render("editar", { id_mascota: req.params.id_mascota, id_cita: req.params.id_cita});
});


module.exports = router;
