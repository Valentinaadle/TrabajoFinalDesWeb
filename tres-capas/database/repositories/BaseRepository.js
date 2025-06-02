const fs = require('fs').promises;
const path = require('path');

class BaseRepository {
    constructor(entity) {
        this.entity = entity;
        this.dbPath = path.join(__dirname, '../data/db.json');
    }

    async readData() {
        const data = await fs.readFile(this.dbPath, 'utf8');
        return JSON.parse(data);
    }

    async writeData(data) {
        await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2));
    }

    async getAll() {
        const data = await this.readData();
        return data[this.entity];
    }

    async getById(id) {
        const data = await this.readData();
        return data[this.entity].find(item => item.id === id);
    }

    async create(item) {
        const data = await this.readData();
        const newId = data[this.entity].length > 0 
            ? Math.max(...data[this.entity].map(i => i.id)) + 1 
            : 1;
        
        const newItem = { ...item, id: newId };
        data[this.entity].push(newItem);
        await this.writeData(data);
        return newItem;
    }

    async update(id, item) {
        const data = await this.readData();
        const index = data[this.entity].findIndex(i => i.id === id);
        
        if (index === -1) {
            throw new Error('Item no encontrado');
        }

        data[this.entity][index] = { ...item, id };
        await this.writeData(data);
        return data[this.entity][index];
    }

    async delete(id) {
        const data = await this.readData();
        const index = data[this.entity].findIndex(i => i.id === id);
        
        if (index === -1) {
            throw new Error('Item no encontrado');
        }

        data[this.entity].splice(index, 1);
        await this.writeData(data);
    }
}

module.exports = BaseRepository; 