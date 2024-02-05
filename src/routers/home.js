const { Router } = require('express');
const { db } = require('../firebase');
const route = Router();
const auth = require('../auth/session_auth');

// Ruta para renderizar la página de citas
route.get('/home', auth, async (req, res) => {
    try {
        const peticion = await db.collection('Citas').where('status', '==', 'pendiente').get();
        const { docs } = peticion;
        const citas = docs.map(cita => ({ id: cita.id, datos: cita.data() }));

        citas.forEach(cita => {
            cita.datos.fecha = new Date(cita.datos.fecha).toLocaleDateString("es-ES"); // Convierte cada fecha
        });

        res.render('home', { citas });
    } catch (error) {
        console.error('Error al cargar citas:', error);
        res.status(500).send('Error al cargar citas');
    }

});

module.exports = route;