const { Router } = require("express");
const { db } = require("../firebase");
const route = Router();
const { auth } = require("../auth/session_auth");
const {
    obtenerUsuarioPorId,
    leerConFiltroFirestore,
    escribirEnFirestore,
} = require("../utils/firestore_utils");

// Ruta para cargar mensajes
route.get("/mensajes/:idPersona", auth, async (req, res) => {
    try {
        const idUsuario = req.params.idPersona;
        const mensajesRecibidos = await leerConFiltroFirestore("chat", [
            "idRemitente",
            "==",
            idUsuario,
        ]);

        // Obtener mensajes enviados
        const mensajesEnviados = await leerConFiltroFirestore("chat", [
            "idDestino",
            "==",
            idUsuario,
        ]);

        // Obtener información del usuario
        const usuario = await obtenerUsuarioPorId(idUsuario);

        // Ordenar mensajes recibidos por fechaYhora de forma ascendente
        mensajesRecibidos.sort(function (a, b) {
            return a.datos.fechaYhora - b.datos.fechaYhora;
        });

        // Ordenar mensajes enviados por fechaYhora de forma ascendente
        mensajesEnviados.sort(function (a, b) {
            return a.datos.fechaYhora - b.datos.fechaYhora;
        });

        // Convertir la fecha de los mensajes recibidos y ajustar el remitente
        mensajesRecibidos.forEach(function (mensaje) {
            var fecha = new Date(mensaje.datos.fechaYhora * 1000);
            mensaje.datos.fechaYhora = fecha.toLocaleString();
            mensaje.datos.idRemitente = usuario.nombre;
        });

        // Convertir la fecha de los mensajes enviados
        mensajesEnviados.forEach(function (mensaje) {
            var fecha = new Date(mensaje.datos.fechaYhora * 1000);
            mensaje.datos.fechaYhora = fecha.toLocaleString();
        });

        // Aquí necesitarías combinar ambos arreglos y ordenarlos nuevamente si quieres intercalar los mensajes recibidos y enviados como en un chat
        const mensajesChat = mensajesRecibidos.concat(mensajesEnviados).sort(function (a, b) {
            return b.datos.fechaYhora - a.datos.fechaYhora  ;
        });

        res.render("mensajes", {
            mensajes: mensajesChat,
            usuario: idUsuario,
        });
    } catch (error) {
        res.render("error", {
            errorMessage: "Error al cargar mensajes: " + error,
            errorCode: "500",
        });
    }
});


// Ruta para enviar mensajes
route.post("/mensajes/enviar", auth, async (req, res) => {
    try {
        const mensaje = {
            idRemitente: 'admin',
            idDestino: req.body.idDestino,
            mensaje: req.body.mensaje,
            fechaYhora: Math.floor(Date.now() / 1000),
        };

        await escribirEnFirestore("chat", mensaje);
        console.log("Mensaje enviado:", mensaje);
        res.redirect("/mensajes/" + req.body.idDestino);
    } catch (error) {
        console.error("Error al enviar mensaje:", error);
        res.render("error", {
            errorMessage: "Error al enviar mensaje" + error,
            errorCode: "500",
        });
    }
});
module.exports = route;