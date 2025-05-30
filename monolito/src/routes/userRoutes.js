const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/professionals', userController.getProfessionals);

// Ruta para obtener todos los usuarios (debe ir al final)
router.get('/', async (req, res) => {
    const users = await require('../models/DataModel').getCollection('users');
    res.json(users);
});

module.exports = router; 