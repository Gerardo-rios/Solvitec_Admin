const { Router } = require('express');
const { db } = require('../firebase');
const route = Router();
const auth = require('../auth/session_auth');

// Ruta para renderizar la página de archivos
route.get('/archivos', auth, async(req, res) => {
    const peticion = await db.collection('usuario').get()
    const { docs } = peticion
    const contactos = docs.map(contacto => ({ id: contacto.id, datos: contacto.data() }))
    res.render('archivos', { contactos })

});


module.exports = route;