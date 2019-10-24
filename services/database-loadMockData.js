'use strict';

const path          = require('path');
const Models        = require('../models');
const sourceFolder  = path.join(__dirname, "..", "_source");

let mockData    = [
    { model: 'Park', file: 'parks/disneyland' },
    { model: 'Park', file: 'parks/disneyland-paris' },
    { model: 'Park', file: 'parks/see-world' },
    { model: 'Park', file: 'parks/universal-studio' },
    { model: 'Ticket', file: 'tickets' },
    { model: 'User', file: 'users' }
];

// Find or create new element
let insertData_ = async (model, doc) => {
    let data = null;
    switch (model) {
        case 'Park':
             data = await Models[model].findOne({
                prefix: doc.prefix
            });
            if (!data) {
                let msg = await new Models[model](doc);
                await msg.save();
                return 'new';
            }
            return 'duplicate';
        case 'Ticket':
            data = await Models[model].findById(doc._id);
            if (!data) {
                let msg = await new Models[model](doc);
                await msg.save();
                return 'new';
            }
            return 'duplicate';
        case 'User':
            data = await Models[model].findOne({
                email: doc.email
            });
            if (!data) {
                let msg = await new Models[model](doc);
                await msg.save();
                return 'new';
            }
            return 'duplicate'
    }
};


// Load mock data
let init_ = async () => {
    for (let i = 0; i < mockData.length; i++) {
        let file = require(path.join(sourceFolder, mockData[i].file));
        let status = '';
        if (file) {
            if (file.length) {
                for (let j = 0; j < file.length; j++) {
                    status = await insertData_(mockData[i].model, file[j]);
                }
            } else {
                status = await insertData_(mockData[i].model, file);
            }
        }
        console.log("[MockData] [" + status + "] [" + mockData[i].file + "]");
    }
};


module.exports = {
    load: init_
};