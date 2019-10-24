'use strict';

let mongoose    = require('mongoose');

let ticketSchema = new mongoose.Schema({
    parkAlias: {
        type: String,
        required: true
    },
    days: {
        type: Number,
        required: true
    },
    title: {
        type: Object,
        required: true
    },
    description: {
        type: Object,
        defaultValue: null
    },
    adultPrice: {
        type: Number,
        required: true
    },
    childrenPrice: {
        type: Number,
        required: true
    },
    maxPassCost: {
        type: Number,
        defaultValue: null
    },
    additionalIcon: String,
    additionalText: Object,
    additionalTooltip: Object
});

module.exports = mongoose.model('Ticket', ticketSchema);