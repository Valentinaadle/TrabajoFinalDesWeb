const dataModel = require('../models/DataModel');

class AppointmentController {
    async getAll(req, res) {
        const appointments = await dataModel.getCollection('appointments');
        res.json(appointments);
    }
    async getByProfessional(req, res) {
        const { professionalId } = req.params;
        const appointments = await dataModel.getCollection('appointments');
        res.json(appointments.filter(a => a.professionalId == professionalId));
    }
    async getByPatient(req, res) {
        const { patientId } = req.params;
        const appointments = await dataModel.getCollection('appointments');
        res.json(appointments.filter(a => a.patientId == patientId));
    }
    async create(req, res) {
        const { patientId, professionalId, date, time } = req.body;
        const appointment = {
            id: Date.now(),
            patientId,
            professionalId,
            date,
            time,
            status: 'pendiente'
        };
        await dataModel.addToCollection('appointments', appointment);
        res.json(appointment);
    }
    async updateStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        const appointments = await dataModel.getCollection('appointments');
        const idx = appointments.findIndex(a => a.id == id);
        if (idx !== -1) {
            appointments[idx].status = status;
            await dataModel.updateCollection('appointments', appointments);
            res.json(appointments[idx]);
        } else {
            res.status(404).json({ message: 'Turno no encontrado' });
        }
    }
    async cancel(req, res) {
        const { id } = req.params;
        const appointments = await dataModel.getCollection('appointments');
        const idx = appointments.findIndex(a => a.id == id);
        if (idx !== -1) {
            appointments[idx].status = 'cancelado';
            await dataModel.updateCollection('appointments', appointments);
            res.json(appointments[idx]);
        } else {
            res.status(404).json({ message: 'Turno no encontrado' });
        }
    }
}
module.exports = new AppointmentController(); 