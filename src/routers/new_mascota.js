const express = require("express");
const router = express.Router();
const { db } = require('../server/firebase.json');
const {auth} = require('../auth/session_auth');

router.post('/new-mascota', auth, async(req, res) => {
    try {
        console.log(req.body);
        const userId = req.user.id; // Obtener userId del usuario autenticado
        const newUser = {
            mascota: req.body.mascota,
            edad_mascota: req.body.edad_mascota,
            especie: req.body.especie,
            fecha: req.body.fecha,
            peso: req.body.peso,
            altura: req.body.altura,
            userId: userId
        };

        // Obtén una referencia a la colección 'Mascotas' en Firestore
        const mascotasCollection = db.collection('Mascotas');

        // Añade un nuevo documento a la colección
        const result = await mascotasCollection.add(newUser);

        console.log('Documento guardado con ID:', result.id);

    } catch (error) {
        console.error('Error al guardar documento:', error);
        res.status(500).send('Error al guardar el documento');
    }
});


module.exports = router;