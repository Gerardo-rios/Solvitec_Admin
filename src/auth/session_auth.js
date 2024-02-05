function auth(req, res, next) {
    if (!req.session.usuario) {
        res.redirect('login'); // Si no está logueado, redirige al login
    }   else {
        next(); // Si está logueado, pasa al siguiente middleware
    }
}

module.exports = auth; // Exporta la función para poder usarla en otros archivos