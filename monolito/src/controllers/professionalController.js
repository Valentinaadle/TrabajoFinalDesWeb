const dataModel = require('../models/DataModel');

class ProfessionalController {
    async getAllProfessionals(req, res) {
        try {
            const professionals = await dataModel.getCollection('professionals');
            res.json(professionals);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los profesionales' });
        }
    }

    async createProfessional(req, res) {
        try {
            const { name, specialty, email } = req.body;
            const professional = {
                id: Date.now(),
                name,
                specialty,
                email
            };
            const newProfessional = await dataModel.addToCollection('professionals', professional);
            res.status(201).json(newProfessional);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el profesional' });
        }
    }

    async updateProfessional(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedProfessional = await dataModel.updateInCollection('professionals', parseInt(id), updates);
            if (updatedProfessional) {
                res.json(updatedProfessional);
            } else {
                res.status(404).json({ message: 'Profesional no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el profesional' });
        }
    }

    async deleteProfessional(req, res) {
        try {
            const { id } = req.params;
            const deletedProfessional = await dataModel.deleteFromCollection('professionals', parseInt(id));
            if (deletedProfessional) {
                res.json({ message: 'Profesional eliminado correctamente' });
            } else {
                res.status(404).json({ message: 'Profesional no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el profesional' });
        }
    }
}

module.exports = new ProfessionalController(); 