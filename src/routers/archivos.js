const { Router } = require("express");
const { db } = require("../firebase");
const route = Router();
const { auth } = require("../auth/session_auth");
const {
  leerDeFirestore,
  escribirEnFirestore,
  leerConFiltroFirestore,
} = require("../utils/firestore_utils");

// Ruta para renderizar la página de archivos
route.get("/archivos", auth, async (req, res) => {
  try {
    const contactos = await leerDeFirestore("usuario");
    res.render("archivos", { contactos });
  } catch (error) {
    console.error("Error al cargar contactos:", error);
    res.status(500).send("Error al cargar contactos");
  }
});

module.exports = route;
