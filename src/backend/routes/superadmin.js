const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/superadmincontroller');



// Route pour la connexion
router.post('/login', superadminController.login);

module.exports = router;
