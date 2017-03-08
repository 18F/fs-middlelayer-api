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

var express = require('express');
var router = express.Router();
var include = require('include')(__dirname);

var permits = require('./permits');
var auth = require('./auth');

var token = include('controllers/auth/token.js');

//*******************************************************************
// router

router.use('/auth', auth);

router.use(token);

router.use('/permits', permits);

//*******************************************************************
//exports

module.exports = router;
