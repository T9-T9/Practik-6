const mongoose = require('mongoose');

class Database {
    constructor() {
        if (!Database.instance) {
            this._connect();
            Database.instance = this;
        }
        return Database.instance;
    }

    _connect() {
        mongoose.connect('mongodb://localhost:27017/ecommerce_mvc')
            .then(() => console.log('MongoDB Connected (Singleton)'))
            .catch(err => console.error('MongoDB Connection Error:', err));
    }

    getInstance() {
        return Database.instance;
    }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;
