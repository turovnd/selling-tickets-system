'use strict';

let mongoose        = require('mongoose');
let validator       = require('validator');
let timestampPlugin = require('./plugins/timestamp');

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            return validator.isEmail(value)
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        defaultValue: '/no-user.png'
    },
    password: {
        type: String,
        required: true,
    },
    emailSubscription: {
        type: Boolean,
        default: false
    },
    isActivated: {
        type: Boolean,
        default: true
    },
    emailConfirmed: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(timestampPlugin);

module.exports = mongoose.model('User', userSchema);