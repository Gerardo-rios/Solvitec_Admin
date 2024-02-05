const express = require('express');
const router = express.Router();
const {admin} = require("../../firebase");

router.get('/login', (req, res) => {
    res.render('partials/login');
});

router.post('/iniciar_sesion', async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await admin.auth().signInWithEmailAndPassword(email, password);
        req.session.user = user;
        res.send(user);
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
});

module.exports = router;