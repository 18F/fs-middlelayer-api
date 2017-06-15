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
const include = require('include')(__dirname);

const multer = require('multer');

const controller = include('src/controllers');

const apiSchema = include('src/api.json');

//*******************************************************************
// storage

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//*******************************************************************

/** Function to retrieve all of the files that might be expected by any route.
 * @return {Array} - Array of objects used by multer to describe the files that can be expected.
 */
function getAllFileNames() {

	const allFilesNames = [];

	if (apiSchema) {
		for (const k in apiSchema.paths) {

			if (apiSchema.paths.hasOwnProperty(k)) {

				for (const l in apiSchema.paths[k]) {

					if (apiSchema.paths[k].hasOwnProperty(l)) {					
					
						if (apiSchema.paths[k][l].parameters) {

							for (let i = 0; i < apiSchema.paths[k][l].parameters.length; i++) {

								if (apiSchema.paths[k][l].parameters[i].type === 'file') {
									
									allFilesNames.push({
										name: apiSchema.paths[k][l].parameters[i].name,
										maxCount: 1
									});
								}
							}
						}
					}
				}
			}
		}
	}

	return allFilesNames;
}

const postUploadFields = upload.fields(getAllFileNames());

//*******************************************************************
// router

// trailing slash middleware
router.use('/*', function(req, res, next){
	
	const reqPath = `/${req.params[0]}`;

	if ((reqPath.slice(-1) !== '/') && (!path.parse(reqPath).ext)) {
		return res.redirect(301, reqPath + '/');
	}

	next();
});

// api router to controller
router.use('/*', postUploadFields, function(req, res){
	controller.routeRequest(req, res);
});

//*******************************************************************
//exports

module.exports = router;
