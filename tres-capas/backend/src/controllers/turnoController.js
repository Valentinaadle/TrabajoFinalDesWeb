const dbService = require('../services/dbService');

class TurnoController {
    async getTurnos(req, res) {
        try {
            const turnos = await dbService.getTurnos();
            res.json(turnos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los turnos' });
        }
    }

    async createTurno(req, res) {
        try {
            const turno = await dbService.createTurno(req.body);
            res.status(201).json(turno);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el turno' });
        }
    }

    async updateTurno(req, res) {
        try {
            const turno = await dbService.updateTurno(req.params.id, req.body);
            res.json(turno);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el turno' });
        }
    }

    async deleteTurno(req, res) {
        try {
            await dbService.deleteTurno(req.params.id);
            res.json({ message: 'Turno eliminado' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el turno' });
        }
    }
}

module.exports = new TurnoController(); 