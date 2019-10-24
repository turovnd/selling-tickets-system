'use strict';

const crypto    = require('crypto');

module.exports = [
    {
        email : process.env.ADMIN_EMAIL,
        isAdmin: true,
        firstName : 'Admin',
        lastName: 'Admin',
        password: crypto.createHmac('sha256', process.env.PASSWORD_SECRET).update(process.env.ADMIN_PASSWORD).digest('hex')
    }
];