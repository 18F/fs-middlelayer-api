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
const mocks = require('./mocks');
const api = require('./api');

const token = include('src/controllers/auth/token.js');
const authorize = include('src/controllers/auth/authorize.js');

//*******************************************************************
// router

router.use('/mocks', mocks);

router.use('/auth', auth);

router.use(token);

router.use(authorize);

router.use('/', api);

//*******************************************************************
//exports

module.exports = router;
