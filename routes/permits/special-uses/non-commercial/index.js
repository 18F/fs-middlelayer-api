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

var non_commercial = include('controllers/permits/special-uses/non-commercial');

//*******************************************************************
// router

// get all
router.get('/',function(req,res){
    
    non_commercial.get.all(req,res);
    
});

// get id
router.get('/:id(\\d+)',function(req,res){
    
    non_commercial.get.id(req,res);
    
});

// put id
router.put('/:id(\\d+)',function(req,res){
    
    non_commercial.put.id(req,res);
    
});

// post
router.post('/',function(req,res){
    
    non_commercial.post(req,res);
    
});

//*******************************************************************
// exports

module.exports = router;
