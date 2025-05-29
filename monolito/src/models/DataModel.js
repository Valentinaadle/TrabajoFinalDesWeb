const fs = require('fs').promises;
const path = require('path');

class DataModel {
    constructor() {
        this.dbPath = path.resolve(__dirname, '../data/db.json');
    }

    async readData() {
        const data = await fs.readFile(this.dbPath, 'utf8');
        return JSON.parse(data);
    }

    async writeData(data) {
        await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2));
    }

    async getCollection(name) {
        const data = await this.readData();
        return data[name] || [];
    }

    async addToCollection(name, item) {
        const data = await this.readData();
        if (!data[name]) data[name] = [];
        data[name].push(item);
        await this.writeData(data);
        return item;
    }

    async updateCollection(name, items) {
        const data = await this.readData();
        data[name] = items;
        await this.writeData(data);
    }

    async updateInCollection(collectionName, id, updates) {
        const data = await this.readData();
        const index = data[collectionName].findIndex(item => item.id === id);
        if (index !== -1) {
            data[collectionName][index] = { ...data[collectionName][index], ...updates };
            await this.writeData(data);
            return data[collectionName][index];
        }
        return null;
    }

    async deleteFromCollection(collectionName, id) {
        const data = await this.readData();
        const index = data[collectionName].findIndex(item => item.id === id);
        if (index !== -1) {
            const deleted = data[collectionName].splice(index, 1)[0];
            await this.writeData(data);
            return deleted;
        }
        return null;
    }
}

module.exports = new DataModel(); 