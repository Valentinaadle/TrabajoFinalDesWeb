const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/pacienteController');

const pacienteController = new PacienteController();

// Middleware para convertir los métodos de clase en middleware de Express
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn.bind(pacienteController)(req, res, next)).catch(next);
};

// Rutas
router.get('/', asyncHandler(pacienteController.obtenerTodos));
router.get('/:id', asyncHandler(pacienteController.obtenerPorId));
router.post('/', asyncHandler(pacienteController.crear));
router.put('/:id', asyncHandler(pacienteController.actualizar));
router.delete('/:id', asyncHandler(pacienteController.eliminar));

module.exports = router; 