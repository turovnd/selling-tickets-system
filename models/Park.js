'use strict';

let mongoose    = require('mongoose');

let parkSchema = new mongoose.Schema({
    prefix: {
        type: String,
        required: true,
        unique: true
    },
    alias: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    name: {
        type: Object,
        required: true
    },
    location: Object,
    description: Object,
    features: [{
        name: Object,
        icon: String
    }],
    images: Array,
    daysSelection: {
        type: Boolean,
        defaultValue: false
    },
    included: [{
        title: {
            type: Object,
            defaultValue: null
        },
        list: [{
            isInclude: Boolean,
            text: Object
        }]
    }],
    departure: {
        point: Object,
        time: Object,
        note: Object
    },
    additional: Object,
    cancellation: Object
});

module.exports = mongoose.model('Park', parkSchema);