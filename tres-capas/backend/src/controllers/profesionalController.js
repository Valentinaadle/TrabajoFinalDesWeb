const dbService = require('../services/dbService');

class ProfesionalController {
    async getProfesionales(req, res) {
        try {
            const profesionales = await dbService.getProfesionales();
            res.json(profesionales);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los profesionales' });
        }
    }
}

module.exports = new ProfesionalController(); 