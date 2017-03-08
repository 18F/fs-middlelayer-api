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

var auth = include('controllers/auth');
var passport = auth.passport;

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
