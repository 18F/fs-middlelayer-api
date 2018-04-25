/*

  ___ ___       ___               _ _       _   ___ ___
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| |
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************
// required modules

const express = require('express');
const router = express.Router();
const include = require('include')(__dirname);

const auth = require('./auth');
const api = require('./api');

const token = require('../controllers/auth/token.js');
const authorize = require('../controllers/auth/authorize.js');

//*******************************************************************
// router

router.use('/auth', auth);

router.use(token);

router.use(authorize);

router.use('/', api);

//*******************************************************************
//exports

module.exports = router;
