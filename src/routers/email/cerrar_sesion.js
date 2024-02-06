const { auth } = require("../../firebase");
const { signOut } = require("firebase/auth");
const { isLogged } = require("../../auth/session_auth");
const express = require("express");
const router = express.Router();

router.get("/logout", isLogged, async (req, res) => {
  try {
    const reponse = await signOut(auth);
    console.log("Sesión cerrada", reponse);
    res.clearCookie("user");
    res.status(200);
    res.end();
    return;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).render("error", {
      errorMessage: "Error al cerrar sesión: " + error.message,
      errorCode: error.code,
    });
  }
});

module.exports = router;
