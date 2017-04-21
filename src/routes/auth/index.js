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

const auth = include('src/controllers/auth');
const passport = auth.passport;

//*******************************************************************
// router

router.use(passport.initialize());  

router.post('/', passport.authenticate(  
    'local', {
	session: false
}), 
    auth.serialize, auth.generate, auth.respond
);

//*******************************************************************
//exports

module.exports = router;
