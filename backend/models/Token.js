'use strict';

let mongoose        = require('mongoose');
let ObjectId        = mongoose.Schema.Types.ObjectId;
let timestampPlugin = require('./plugins/timestamp');

let tokenSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});

tokenSchema.plugin(timestampPlugin);

module.exports = mongoose.model('Token', tokenSchema);