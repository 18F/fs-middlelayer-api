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

var validate = include('controllers/permits/special-uses/validate.js');
var error = include('error.js');

//*******************************************************************
// controller

var get = {};
var put = {};
var post;

// get all

get.all = function(req){

    return include('test/data/outfitters.get.all.json');

};

// get id

get.id = function(req,res){
    
    if(validate.permit_id(req.params.id)){
    
		res.json(include('test/data/outfitters.get.id.json'));
    
    }else{
    
		error.sendError(req,res,400,"permitId supplied is invalid");
    
    }
    
};

// put id

put.id = function(req,res){
    res.json(include('test/data/outfitters.put.id.json'));
};

// post

post = function(req,res){
    res.json(include('test/data/outfitters.post.json'));
};

//*******************************************************************
// exports

module.exports.get = get;
module.exports.put = put;
module.exports.post = post;
