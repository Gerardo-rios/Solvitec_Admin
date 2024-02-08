const express = require("express");
const router = express.Router();
const { auth } = require("../auth/session_auth");
const {
  leerDeFirestore,
  leerConFiltroFirestore,
} = require("../utils/firestore_utils");

router.get("/presentar_mascota/:id", auth, async (req, res) => {
  let id = req.params.id;
  const usuario = await leerDeFirestore("usuario", id);
  const cedula = usuario.cedula;
  const mascotas = await leerConFiltroFirestore("Mascotas", [
    "dueño",
    "==",
    cedula,
  ]);
  res.render("presentar_mascota", { contacto: usuario, mascotas: mascotas });
});

module.exports = router;
