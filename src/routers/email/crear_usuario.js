const express = require("express");
const router = express.Router();
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");


// Ruta para manejar la solicitud POST del formulario de registro
router.post('/crear_usuario', async(req, res) => {
    const { correo, contraseña } = req.body; // Extrae el correo electrónico y la contraseña del cuerpo de la solicitud    
    try {
        const auth = getAuth();
        const newUser = createUserWithEmailAndPassword(auth, correo, contraseña);
        
        // Crea un nuevo usuario utilizando Firebase Admin SDK
        // const userRecord = await admin.auth().createUser({
        //     email: correo,
        //     password: contraseña
        // });
        
        console.log('Usuario creado con ID:', newUser);
        res.redirect('/login'); // Redirige al usuario a la página '/home' después del registro exitoso
    } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        res.status(500).send('Error al registrar usuario');
    }
});

module.exports = router; // Exporta el enrutador para ser utilizado en la aplicación principal