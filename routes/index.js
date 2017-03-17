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

const  express = require('express');
const  router = express.Router();
const  include = require('include')(__dirname);

const  permits = require('./permits');
const  auth = require('./auth');

const  token = include('controllers/auth/token.js');
const  authorize = include('controllers/auth/authorize.js');

//*******************************************************************
// router

router.use('/auth', auth);

router.use(token);

router.use(authorize);

router.use('/permits', permits);

//*******************************************************************
//exports

module.exports = router;
