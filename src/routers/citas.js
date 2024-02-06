const { Router } = require('express');
const { db } = require('../firebase');
const route = Router();
const {auth} = require('../auth/session_auth');
const { leerDeFirestore, escribirEnFirestore, leerConFiltroFirestore } = require('../utils/firestore_utils');

// Ruta para renderizar la página de archivos
route.get('/cita', auth, async(req, res) => {    
    try {
        const citas = await leerConFiltroFirestore('Citas', ['status', '==', 'aceptada']);
        res.render('citas', { citas });
    } catch (error) {
        // El manejo de errores ya se hace dentro de leerConFiltroFirestore, pero puedes añadir acciones adicionales si es necesario
        res.status(500).send('Error al cargar citas');
    }
});

module.exports = route;