require('dotenv').config();
const credentials = require('./server/firebase.json');
const initializeApp = require('firebase-app');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(credentials),
});


const db = admin.firestore();

module.exports = { db, admin };