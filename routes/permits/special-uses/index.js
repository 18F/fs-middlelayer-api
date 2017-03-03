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

var commercial = require('./commercial');
var non_commercial = require('./non-commercial');
var special_uses = include('controllers/permits/special-uses');


//*******************************************************************
// router

router.use('/commercial', commercial);
router.use('/noncommercial', non_commercial);

router.get('/',function(req,res){
	res.json(special_uses.get.all(req));
});

module.exports = router;
