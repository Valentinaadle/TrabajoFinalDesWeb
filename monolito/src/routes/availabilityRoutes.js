const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

router.get('/:professionalId', availabilityController.getByProfessional);
router.post('/', availabilityController.setAvailability);

module.exports = router; 