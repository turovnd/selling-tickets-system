'use strict';

let mongoose        = require('mongoose');
let ObjectId        = mongoose.Schema.Types.ObjectId;
let timestampPlugin = require('./plugins/timestamp');

let orderSchema = new mongoose.Schema({
    realId: {
        type: Number,
        required: true,
        unique: true
    },
    parkPrefix: {
        type: String,
        required: true
    },
    parkAlias: {
        type: String,
        required: true
    },
    ticketId: {
        type: ObjectId,
        required: true
    },
    userId: String,
    createdFrom: {
        type: String,
        enum: ['site', 'form'],
        required: true
    },
    status: { // 0 - created, 1 - paid, 2 - confirmed, 3 - charged, 4 - refunded, 5 - canceled
        type: Number,
        required: true,
        defaultValue: 0
    },
    locale: {
        type: String,
        defaultValue: 'en'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    guests: [{
        isLead: {
            type: Boolean,
            defaultValue: false
        },
        isAdult: Boolean,
        lastName: String,
        firstName: String,
    }],
    tickets: [{
        name: String, // File name
        mimetype: String, // image/png, image/jpg, application/pdf
        path: String, // path in the server where file was stored
        current: Boolean // current version of the ticket or not
    }],
    paymentDetails: { // Payment method + info for refund
        paymentMethod: String,
        transactionId: Number,
        status: Boolean,
        reason: Number,
        cardFirstSix: String,
        cardLastFour: String,
        cardExpDate: String,
        requestFrom: String
    },
    contactInfo: {
        updates: {
            type: Boolean,
            defaultValue: false
        },
        email: String,
        phone: String
    }
});

orderSchema.plugin(timestampPlugin);

module.exports = mongoose.model('Order', orderSchema);