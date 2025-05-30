const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalController');

router.get('/', professionalController.getAllProfessionals);
router.post('/', professionalController.createProfessional);
router.put('/:id', professionalController.updateProfessional);
router.delete('/:id', professionalController.deleteProfessional);

module.exports = router; 