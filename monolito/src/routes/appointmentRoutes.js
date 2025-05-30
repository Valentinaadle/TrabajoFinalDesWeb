const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Obtener todas las citas
router.get('/', appointmentController.getAll);

// Obtener citas por profesional
router.get('/professional/:professionalId', appointmentController.getByProfessional);

// Obtener citas por paciente
router.get('/patient/:patientId', appointmentController.getByPatient);

// Crear una nueva cita
router.post('/', appointmentController.create);

// Actualizar estado de una cita
router.put('/:id/status', appointmentController.updateStatus);

// Cancelar una cita
router.put('/:id/cancel', appointmentController.cancel);

module.exports = router; 