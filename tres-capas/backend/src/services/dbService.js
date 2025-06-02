const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../../../database/data/db.json');

class DbService {
    async readData() {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    }

    async writeData(data) {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    }

    async getUsuarios() {
        const data = await this.readData();
        return data.usuarios;
    }

    async getTurnos() {
        const data = await this.readData();
        return data.turnos;
    }

    async getProfesionales() {
        const data = await this.readData();
        return data.usuarios.filter(u => u.rol === 'profesional');
    }

    async createTurno(turnoData) {
        const data = await this.readData();
        const newId = Math.max(...data.turnos.map(t => t.id), 0) + 1;
        const newTurno = { id: newId, ...turnoData };
        data.turnos.push(newTurno);
        await this.writeData(data);
        return newTurno;
    }

    async updateTurno(id, turnoData) {
        const data = await this.readData();
        const turnoIndex = data.turnos.findIndex(t => t.id === parseInt(id));
        if (turnoIndex === -1) throw new Error('Turno no encontrado');
        data.turnos[turnoIndex] = { ...data.turnos[turnoIndex], ...turnoData };
        await this.writeData(data);
        return data.turnos[turnoIndex];
    }

    async deleteTurno(id) {
        const data = await this.readData();
        const turnoIndex = data.turnos.findIndex(t => t.id === parseInt(id));
        if (turnoIndex === -1) throw new Error('Turno no encontrado');
        data.turnos.splice(turnoIndex, 1);
        await this.writeData(data);
        return true;
    }
}

module.exports = new DbService(); 