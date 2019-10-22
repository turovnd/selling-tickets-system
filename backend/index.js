'use strict';

require('dotenv').config();

const express       = require('express');
const bodyParser    = require('body-parser');
const fileUpload    = require('express-fileupload');
const app           = express();
const passport      = require('./services/passport');
const db            = require('./services/database');
const mandrill      = require('./services/mandrill');
const cloudpayments = require('./services/cloudpayments');


// Add Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add Passport Middleware
app.use(passport().initialize());

// Use files uploader
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}));

/**
 * Cross origin Validation
 *
 * @allowHeaders => All headers that server accept
 * @allowMethods => All methods that server accept
 */
const allowHeaders = ['access-control-allow-origin','origin','content-type','authorization'];
const allowMethods = ['GET','POST','PUT','DELETE'];


// Do for each request
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', allowHeaders.join(','));
    res.setHeader('Access-Control-Allow-Methods', allowMethods.join(','));

    // If `method = 'OPTIONS'` => verify allow headers and methods
    if (req.method === 'OPTIONS') {
        let isValidHeader = true;
        if (req.headers['access-control-request-headers']) {
            req.headers['access-control-request-headers'].split(',').map(el => {
                if (allowHeaders.indexOf(el) === -1)
                    isValidHeader = false;
            });
        }
        if (isValidHeader && allowMethods.indexOf(req.headers['access-control-request-method']) !== -1)
            return res.send('OK');
    }
    next();
});


/**
 * Define routes
 */
app.use('/', require('./routes'));


/**
 * Define static directories for public images
 */
app.use('/images', express.static('static/images'));
app.use('/icons', express.static('static/icons'));
app.use('/avatars', express.static('static/avatars'));

/**
 * Return 404 if route does not exist
 */
app.use('/', (req, res, next) => {
    res.status(404).json({
        error: "Not found"
    });
});


/**
 * Initialize server
 */
app.listen(process.env.SERVER_PORT, async() => {
    if (process.NODE_ENV === 'production') {
        await mandrill.init();
        await cloudpayments.init();
    }
    console.info('Server Ready! Site: ' + process.env.SERVER_HOST + ":" + process.env.SERVER_PORT);
});