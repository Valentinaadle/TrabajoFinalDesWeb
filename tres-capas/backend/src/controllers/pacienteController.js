const PacienteService = require('../services/pacienteService');

class PacienteController {
    constructor() {
        this.pacienteService = new PacienteService();
    }

    async obtenerTodos(req, res) {
        try {
            const pacientes = await this.pacienteService.obtenerTodos();
            res.json(pacientes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const paciente = await this.pacienteService.obtenerPorId(parseInt(req.params.id));
            res.json(paciente);
        } catch (error) {
            if (error.message === 'Paciente no encontrado') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    async crear(req, res) {
        try {
            const nuevoPaciente = await this.pacienteService.crear(req.body);
            res.status(201).json(nuevoPaciente);
        } catch (error) {
            if (error.message.includes('Faltan datos') || 
                error.message.includes('Ya existe')) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    async actualizar(req, res) {
        try {
            const pacienteActualizado = await this.pacienteService.actualizar(
                parseInt(req.params.id),
                req.body
            );
            res.json(pacienteActualizado);
        } catch (error) {
            if (error.message === 'Paciente no encontrado') {
                res.status(404).json({ error: error.message });
            } else if (error.message.includes('Ya existe')) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    async eliminar(req, res) {
        try {
            await this.pacienteService.eliminar(parseInt(req.params.id));
            res.status(204).send();
        } catch (error) {
            if (error.message === 'Paciente no encontrado') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }
}

module.exports = PacienteController; 