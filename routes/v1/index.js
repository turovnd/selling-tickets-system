'use strict';

const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');

const DOCS_PATH = path.join(__dirname, '..', '..', 'docs');

router.use('/parks', require('./parks'));
router.use('/orders', require('./orders'));
router.use('/payments', require('./payments'));

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));

router.use('/swagger.json', (req, res) =>
  res.send(
    fs.readFileSync(`${DOCS_PATH}/swagger-v1.json`, 'utf-8')
      .replace('__HOST__', process.env.API_URL)
  )
);

router.use('/swagger-ui.html', (req, res) =>
  res.send(
    fs.readFileSync(`${DOCS_PATH}/swagger.html`, 'utf-8')
      .replace('__API_HOST__', process.env.API_URL)
      .replace('__API_VERSION__', 'v1')
  )
);

module.exports = router;