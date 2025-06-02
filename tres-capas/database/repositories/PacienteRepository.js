const BaseRepository = require('./BaseRepository');

class PacienteRepository extends BaseRepository {
    constructor() {
        super('pacientes');
    }

    async buscarPorEmail(email) {
        const pacientes = await this.getAll();
        return pacientes.find(p => p.email === email);
    }

    async buscarPorDNI(dni) {
        const pacientes = await this.getAll();
        return pacientes.find(p => p.dni === dni);
    }
}

module.exports = PacienteRepository; 