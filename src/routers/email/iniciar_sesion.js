const express = require('express');
const router = express.Router();
const {auth} = require("../../firebase");
const { signInWithEmailAndPassword } = require('firebase/auth');
const {isLogged} = require('../../auth/session_auth');

router.get('/login', isLogged, (req, res) => {
    res.render('partials/login');
});

router.post('/iniciar_sesion', isLogged, async(req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            console.error('Correo o clave faltante');
            return res.status(400).end();
        }
        const user = await signInWithEmailAndPassword(auth, email, password);
        
        res.cookie('user', user.user, {
            maxAge: 3600 * 1000,
            httpOnly: true,
            secure: false
        });

        res.redirect('home');
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
});

module.exports = router;