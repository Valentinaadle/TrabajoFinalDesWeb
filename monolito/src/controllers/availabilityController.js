const dataModel = require('../models/DataModel');

class AvailabilityController {
    async getByProfessional(req, res) {
        const { professionalId } = req.params;
        const availability = await dataModel.getCollection('availability');
        const found = availability.find(a => a.professionalId == professionalId);
        res.json(found ? found.slots : []);
    }
    async setAvailability(req, res) {
        const { professionalId, slots } = req.body;
        const availability = await dataModel.getCollection('availability');
        const idx = availability.findIndex(a => a.professionalId == professionalId);
        if (idx !== -1) {
            availability[idx].slots = slots;
        } else {
            availability.push({ professionalId, slots });
        }
        await dataModel.updateCollection('availability', availability);
        res.json({ success: true });
    }
}
module.exports = new AvailabilityController(); 