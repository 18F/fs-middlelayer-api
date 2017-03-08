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

var commercial = require('./commercial/');
var noncommercial = require('./noncommercial/');

//*******************************************************************
// controller

var get = {};

// get all

get.all = function(req){

	var commercial_res = commercial.get.all(req)['commercial'];
	var noncommercial_res = noncommercial.get.all(req)['noncommercial'];

	var special_uses = {
		'response':{
			'success' : true,
			'api': 'FS ePermit API',
			'type': 'controller',
			'verb': 'get',
			'src': 'json',
			'route': 'permits/special-uses'
		},
		'special-uses':{
			'commercial' : commercial_res,
			'noncommercial' : noncommercial_res
		}
	};

	return special_uses;

};

//*******************************************************************
// exports

module.exports.get = get;
