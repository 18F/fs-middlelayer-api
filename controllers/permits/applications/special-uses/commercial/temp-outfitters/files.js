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

const include = require('include')(__dirname);

//*******************************************************************
// validation

const util = include('controllers/permits/applications/special-uses/utility.js');
const dbUtil = include('controllers/permits/applications/special-uses/dbUtil.js');
const error = include('error.js');

//*******************************************************************
// controller

const get = {};

// get id

get.id = function(req, res){
	
	const controlNumber = req.params.id;
	const fileName = req.params.fileName;

	console.log('controlNumber=' + controlNumber + ', fileName=' + fileName);

	const filePath = controlNumber + '/' + fileName;

	dbUtil.getFile(filePath, function (err, file){

		if (err){
			error.sendError(req, res, 400, 'error getting file');	
		}
		else {
			if (file){

				util.getFile(controlNumber, fileName, function(err, data){

					if (err){
						error.sendError(req, res, 404, 'file not found');
					}
					else {
						res.attachment(file.file_name);
						res.send(data.Body);	
					}

				});
			}
			else {
				error.sendError(req, res, 400, 'Invalid controlNumber or fileName provided');
			}
		}
	});
};

//*******************************************************************
// exports

module.exports.get = get;
