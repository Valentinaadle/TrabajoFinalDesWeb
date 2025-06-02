const PacienteRepository = require('../../../database/repositories/PacienteRepository');

class PacienteService {
    constructor() {
        this.pacienteRepository = new PacienteRepository();
    }

    async obtenerTodos() {
        return await this.pacienteRepository.getAll();
    }

    async obtenerPorId(id) {
        const paciente = await this.pacienteRepository.getById(id);
        if (!paciente) {
            throw new Error('Paciente no encontrado');
        }
        return paciente;
    }

    async crear(pacienteData) {
        // Validar datos
        if (!pacienteData.nombre || !pacienteData.email || !pacienteData.dni) {
            throw new Error('Faltan datos obligatorios');
        }

        // Verificar si ya existe
        const existeEmail = await this.pacienteRepository.buscarPorEmail(pacienteData.email);
        const existeDNI = await this.pacienteRepository.buscarPorDNI(pacienteData.dni);

        if (existeEmail) {
            throw new Error('Ya existe un paciente con ese email');
        }

        if (existeDNI) {
            throw new Error('Ya existe un paciente con ese DNI');
        }

        return await this.pacienteRepository.create(pacienteData);
    }

    async actualizar(id, pacienteData) {
        const paciente = await this.pacienteRepository.getById(id);
        if (!paciente) {
            throw new Error('Paciente no encontrado');
        }

        // Verificar si el email ya está en uso por otro paciente
        if (pacienteData.email && pacienteData.email !== paciente.email) {
            const existeEmail = await this.pacienteRepository.buscarPorEmail(pacienteData.email);
            if (existeEmail) {
                throw new Error('El email ya está en uso');
            }
        }

        return await this.pacienteRepository.update(id, {
            ...paciente,
            ...pacienteData
        });
    }

    async eliminar(id) {
        await this.obtenerPorId(id); // Verifica que exista
        await this.pacienteRepository.delete(id);
    }
}

module.exports = PacienteService; 