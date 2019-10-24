let mongoose    = require('mongoose');

const server    = process.env.MONGO_HOST + ":" + process.env.MONGO_PORT;
const database  = process.env.MONGO_DATABASE;
const userName  = process.env.MONGO_USER;
const pass      = process.env.MONGO_PASSWORD;

class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(`mongodb://${userName}:${pass}@${server}/${database}`, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
            .then(() => {
                if (process.NODE_ENV === 'production') {
                    console.log('Database has initialized');
                }
                if (process.env.LOAD_SAMPLE_DATA === "true") {
                    require('./database-loadMockData').load();
                }
            })
            .catch(err => {
                console.error('Database connection error', err)
            });

    }
}

module.exports = new Database();