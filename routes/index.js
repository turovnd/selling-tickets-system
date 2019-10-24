'use strict';

const express   = require('express');
const router    = express.Router();

router.use('/v1/parks', require('./v1/parks'));
router.use('/v1/orders', require('./v1/orders'));
router.use('/v1/payments', require('./v1/payments'));

router.use('/v1/auth', require('./v1/auth'));
router.use('/v1/users', require('./v1/users'));

module.exports = router;