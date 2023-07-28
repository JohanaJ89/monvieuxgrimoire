const express = require('express');
const router = express.Router();
const password = require('../middleware/passwords');
const userCtrl = require('../controllers/user');

const rateLimit = require("express-rate-limit");
console.log("avant la limitation dans la route user"); 
const limitUserLogin = rateLimit({
    windowMS: 5 * 60 * 1000, //vaut 5 minutes
    max: 50,
    message: "Vous avez effectué trop de requêtes"
});

console.log("dans user route");
router.post('/signup', password, userCtrl.signup);
router.post('/login', limitUserLogin, userCtrl.login);

module.exports = router;