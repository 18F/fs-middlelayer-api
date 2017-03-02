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

var include = require('include')(__dirname);

//*******************************************************************
// validation

var validate_special_use = include('controllers/permits/special-uses/validate.js');
var error = include('error.js');


//*******************************************************************
// controller

var get = {};
var put = {};
var post;

// get all

get.all = function(req, res){

    return include('test/data/non-commercial.get.all.json');

};

// get id

get.id = function(req, res){
    
    res.json(include('test/data/non-commercial.get.id.json'));

};

// put id

put.id = function(req, res){
    
    res.json(include('test/data/non-commercial.put.id.json'));

};

// post

post = function(req, res){

    var validate_res = validate_special_use.validate_input(req);
    
    if(validate_res.fields_valid){
    
        res.json(include('test/data/non-commercial.post.json'));
    
    }
    else{
    
        error.sendError(req, res, 400, validate_res.error_message);
    
    }

};

//*******************************************************************
// exports

module.exports.get = get;
module.exports.put = put;
module.exports.post = post;
