'use strict';

let mongoose    = require('mongoose');

let counterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        default: 10000
    }
});

module.exports = mongoose.model('Counter', counterSchema);