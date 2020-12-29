const EventEmitter = require('events');
const fs = require('fs');

class DataBase extends EventEmitter {
    static names() {
        return require('./data/names');
    }

    constructor(model) {
        super();
        this.model = model;
    }

    async stCommit() {
    }

    async getRows() {
        return await this.select().catch(err => err);
    }

    async addRow(newObject) {
        return await this.insert(newObject).catch(err => err);
    }

    async updateRow(newFields) {
        return await this.update(newFields).catch(err => err);
    }

    async removeRow(id) {
        return await this.delete(id).catch(err => err);
    }

    async select() {
        return this.model;
    }

    async commit(object, action) {
        if (action === 'insert' || action === 'update') {
            this.model.push(object);
        } else if (action === 'delete') {
            this.model.splice(this.model.indexOf(object), 1);
        }
        await fs.writeFile('./db/data/names.json', JSON.stringify(this.model, null, '  '), () => {});
    }

    async insert(object) {
        if (!object.id) {
            object.id = Math.max(...this.model.map(m => m.id)) + 1;
        }
        await this.commit(object, 'insert');
        return object;
    }

    async update(updatedObject) {
        let oldObject = this.model.find(m => m.id == updatedObject.id);
        if (!oldObject) {
            throw { message: 'Invalid Request', code: 401 };
        }
        await this.delete(oldObject.id);
        await this.commit(updatedObject, 'update');
        return updatedObject;
    }

    async delete(id) {
        let oldObject = this.model.find(m => m.id == id);
        if (!oldObject) {
            throw { message: 'Invalid Request', code: 401 };
        }
        await this.commit(oldObject, 'delete');
        return oldObject;
    }
}


module.exports = DataBase;
