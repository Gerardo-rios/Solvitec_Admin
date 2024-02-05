const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const { db } = require("./firebase");
const session = require('express-session');
const crypto = require('crypto');
const app = express();

// Settings
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));
app.engine(
    ".hbs",
    exphbs.create({
        defaultLayout: "main",
        extname: ".hbs",
    }).engine
);
app.set("view engine", ".hbs");
app.set('views', path.join(__dirname, 'views'));

// middlewares
app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: crypto.randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));




// Routes

app.use(require("./routers/index"))
app.use(require("./routers/añadir"))
app.use(require("./routers/home"))
app.use(require("./routers/archivos"))
app.use(require("./routers/usuarios"))
app.use(require("./routers/new_mascota"))
app.use(require("./routers/email/crear_usuario"))
app.use(require("./routers/email/iniciar_sesion"))
app.use(require("./routers/citas"))

app.get('/index', (req, res) => {
    res.render('layouts/main'); // Renderiza el archivo signup.hbs
});
app.get('/perfil', (req, res) => {
    res.render('perfil'); // Renderiza el archivo signup.hbs
});

app.get('/home', (req, res) => {
    res.render('home'); // Renderiza el archivo signup.hbs
});

app.get('/registarse', (req, res) => {
    res.render('partials/registarse'); // Renderiza el archivo signup.hbs
});

app.get('/anadir', (req, res) => {
    res.render('anadir');
});

app.get('/usuarios', (req, res) => {
    res.render('usuarios');
});

app.get('/new_mascota', (req, res) => {

    res.render('new_mascota');
});

app.get('/presentar_mascota/:id', async(req, res) => {

    let id = req.params.id
    const peticion = await db.collection('user').doc(id).get()
    const contacto = { id: id, datos: peticion.data() }
    res.render('presentar_mascota', { contacto });
});

app.get('/editar', (req, res) => {
    res.render('editar');
});
app.get('/crear_usuario', function(req, res) {
    res.render('partials/crear_usuario'); // Esta línea renderiza la vista "crear_usuario.hbs"
});

app.get('/datos_usuario', function(req, res) {
    res.render('partials/datos_usuario'); // Esta línea renderiza la vista "crear_usuario.hbs"

});



app.get('/borrar/:id', async(req, res) => {
    try {
        const id = req.params.id;
        // Eliminar el documento con el ID proporcionado de la colección 'user'
        await db.collection('user').doc(id).delete();
        console.log('Documento eliminado correctamente');
        res.redirect('/archivos'); // Redirigir a la página de archivos después de la eliminación
    } catch (error) {
        console.error('Error al eliminar el documento:', error);
        res.status(500).send('Error al eliminar el documento');
    }
});



// Static files
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;