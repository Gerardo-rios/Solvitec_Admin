const express = require("express");
const router = express.Router();
const { db } = require('../server/firebase.json');
const auth = require('../auth/session_auth');

router.post('/new-mascota', auth, async(req, res) => {

});


module.exports = router;