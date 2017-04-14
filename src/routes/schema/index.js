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
const path = require('path');
const fs = require('fs');
const include = require('include')(__dirname);

//*******************************************************************
// router

router.get('/api.json', function (req, res) {  
	
	fs.readFile(path.normalize('src/api.json'), 'utf8', function (err,data) { 
		if (err) { 
			return console.log(err); 
		} 
		res.send(data); 
	});
	
});

//*******************************************************************
//exports

module.exports = router;
