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

//*******************************************************************
// router

// get all
router.get('/',function(req,res){
    
    var output = {
        "success" : true,
        "api": "FS ePermit API",
        "verb": "get",
        "route": "permits/special-uses/non-commercial"
    };
    res.json(output);
    
});

// get id
router.get('/:id(\\d+)',function(req,res){
    
    var output = {
        "success" : true,
        "api": "FS ePermit API",
        "verb": "get",
        "route": "permits/special-uses/non-commercial/id"
    };
    res.json(output);
    
});

// put id
router.put('/:id(\\d+)',function(req,res){
    
    var output = {
        "success" : true,
        "api": "FS ePermit API",
        "verb": "put",
        "route": "permits/special-uses/non-commercial/id"
    };
    res.json(output);
    
});

// post
router.post('/',function(req,res){
    
    var output = {
        "success" : true,
        "api": "FS ePermit API",
        "verb": "post",
        "route": "permits/special-uses/non-commercial"
    };
    res.json(output);
    
});

//*******************************************************************
// exports

module.exports = router;
