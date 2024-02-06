const express = require("express");
const router = express.Router();
const { auth } = require("../../firebase");
const { createUserWithEmailAndPassword } = require("firebase/auth");
const { leerDeFirestore, escribirEnFirestore } = require("../../utils/firestore_utils");
const {isLogged} = require('../../auth/session_auth');

router.post("/crear_usuario", isLogged, async (req, res) => {
  const adminExiste = await verificarAdminExistente();
  if (adminExiste){
    return res.status(500).send({error: "Ya existe un usuario administrador, no se puede crear otro."});
  }
  const { correo, clave } = req.body; // Extrae el correo electrónico y la clave del cuerpo de la solicitud
  if (!correo || !clave) {
    console.error("Correo o clave faltante");
    return res.status(400).end();
  }
  try {
    const user = await createUserWithEmailAndPassword(auth, correo, clave);
    await actualizarAdmin(correo);
    
    if (!req.cookies.user) {
      res.cookie("user", user.user, {
        maxAge: 3600 * 1000,
        httpOnly: true,
        secure: false,
      });
    }

  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
    console.error("Código de error:", error.code);
    res.status(500).send("Error al registrar usuario");
  }
});

async function verificarAdminExistente() {
  const adminList = await leerDeFirestore("admin_user");
  if (adminList.length > 0 && adminList[0].creado) {
      return true;
  }
  return false;
}

async function actualizarAdmin(correo) {
  await escribirEnFirestore("admin_user", { creado: true, correo: correo }, "admin_user");
}

module.exports = router;
