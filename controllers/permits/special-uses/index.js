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

var commercial = require('./commercial/');
var non_commercial = require('./non-commercial/');

//*******************************************************************
// controller

var get = {};

// get all

get.all = function(req,res){

    var commercial_res = commercial.get.all(req)['commercial'];
    var non_commercial_res = non_commercial.get.all(req)['non-commercial'];

    var special_uses = {
    	"response":{
    		"success" : true,
	        "api": "FS ePermit API",
	        "type": "controller",
	        "verb": "get",
	        "src": "json",
	        "route": "permits/special-uses"
    	},
    	"special-uses":{
    		"commercial" : commercial_res,
            "non-commercial" : non_commercial_res
    	}
    };

    return special_uses;

};

//*******************************************************************
// exports

module.exports.get = get;
