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

const outfitters = include('controllers/permits/special-uses/commercial/outfitters');

//*******************************************************************
// router

// get id
router.get('/:id(\\d+)', function(req, res){
    
	outfitters.get.id(req, res);
    
});

// put id
router.put('/:id(\\d+)', function(req, res){
    
	outfitters.put.id(req, res);
    
});

// post
router.post('/', function(req, res){
    
	outfitters.post(req, res);
    
});

//*******************************************************************
// exports

module.exports = router;
