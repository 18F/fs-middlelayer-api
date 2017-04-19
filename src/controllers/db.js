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

//*******************************************************************
// other files
const include = require('include')(__dirname);
const models = include('src/models');

//*******************************************************************

/**
 * Saves information about file into DB
 * @param  {[type]}   applicationId - Id of application file is associated with
 * @param  {[type]}   uploadFile    - Information about file being saved
 * @param  {Function} callback      - function to be called after trying to save file
 */
function saveFile(applicationId, uploadFile, callback){
	models.files.create({
		application_id: applicationId, 
		file_type: uploadFile.filetypecode, 
		file_path: uploadFile.keyname,
		file_name: uploadFile.filename,
		file_originalname: uploadFile.originalname,
		file_ext: uploadFile.ext,
		file_size: uploadFile.size,
		file_mimetype: uploadFile.mimetype,
		file_encoding: uploadFile.encoding
	})
	.then(function(file) {
		return callback(null, file);
	})
	.catch(function(err) {
		return callback(err, null);
	});
}

/**
 * Gets file info from DB
 * @param  {String}   filePath - Path to file in S3
 * @param  {Function} callback - Function to call after getting info back from DB
 */
const getFile = function(filePath, callback){

	models.files.findOne({
		where: {file_path: filePath} 
	})
	.then(function(file) {
		return callback(null, file);
	})
	.catch(function(err) {
		console.error(err);
		return callback(err, null);
	});
};

/**
 * Get info of multiple files from DB
 * @param  {Number}   applicationId - application Id of files to get
 * @param  {Function} callback      - Function to call after getting info back from DB
 */
const getFiles = function(applicationId, callback){

	models.files.findAll({
		where: {application_id: applicationId}
	})
	.then(function(files) {
		return callback(null, files);
	})
	.catch(function(err) {
		return callback(err, null);
	});
};

/**
 * Gets application info from DB
 * @param  {Number}   controlNumber - control number of application to retreive
 * @param  {Function} callback      - Function to call after getting info back from DB
 */
const getApplication = function(controlNumber, callback){

	models.applications.findOne({
		where: {
			control_number: controlNumber
		}
	}).then(function(appl) {
		if (appl){
			if (appl.form_name === 'FS-2700-3f') {
				getFiles(appl.id, function(fileErr, files) {
					if (fileErr){
						console.error(fileErr);
						return callback(fileErr, null, null);
					}
					else {
						if (files) {
							return callback(null, appl, files);
						}
						else {
							return callback(null, appl, null);
						}
					}
				});
			}
			else {
				return callback(null, appl, null);
			}
		}
		else {
			return callback('no record found', null);
		}
	}).catch(function (err) {
		console.error(err);
		return callback(err, null, null);
	});
};

/**
 * Save application data to DB
 * @param  {Number}   controlNumber - control number of application to save
 * @param  {Object}   toStore       - object containing all of the fields to save to DB
 * @param  {Function} callback      - Function to call after saving application to DB
 */
const saveApplication = function(toStore, callback) {
	models.applications.create(toStore)
	.then(function(appl) {
		return callback(null, appl);
	})
	.catch(function(err) {
		console.error(err);
		return callback(err, null);
	});
};

/** Gets list of fields that are to be stored in DB
 * @param  {Object} schema - Schema to look through to find any fields to store in DB
 * @param  {Array} fieldsToStore - Array(String) containing names of field to store in DB
 * @param  {String} path - path to each field from root of schema
 * @param  {String} saveLocation - location which field should be saved. Valid options are middleLayer or basic.
 */
function getFieldsToStore(schema, fieldsToStore, path, saveLocation){
	const keys = Object.keys(schema);
	keys.forEach((key)=>{
		switch (key){
		case 'allOf':
		case 'oneOf':
			for (let i = 0; i < schema[key].length; i++){
				getFieldsToStore(schema[key][i], fieldsToStore, `${path}`, saveLocation);
			}
			break;
		case 'properties':
			getFieldsToStore(schema.properties, fieldsToStore, `${path}`, saveLocation);
			break;
		default:
			const store = schema[key].store;
			let storeInMiddle = false;
			if (store && schema[key].type !== 'file'){
				store.forEach((place)=>{
					const location = place.split(':')[0];
					storeInMiddle = storeInMiddle || (location === saveLocation);
				});
			}
			if (storeInMiddle){
				const obj = {};

				if (path !== ''){
					obj[`${path.slice(path.indexOf('.') + 1)}.${key}`] = schema[key];
				}
				else {
					obj[`${key}`] = schema[key];
				}
				fieldsToStore.push(obj);
			}
			else if (schema[key].type === 'object'){
				getFieldsToStore(schema[key], fieldsToStore, `${path}.${key}`, saveLocation);
			}
			break;
		}
	});
}

/** Formats data from user input, that needs to be submitted to DB, so that DB can receive it.
 * @param  {Object} schema - Schema of application being submitted
 * @param  {Object} body - User input
 * @return {Object} - Containing key:value pairs for all fields expected to be stored in DB
 */
function getDataToStoreInDB(schema, body){
	const fieldsToStoreInDB = [];
	const output = {};
	getFieldsToStore(schema, fieldsToStoreInDB, '', 'middleLayer');
	fieldsToStoreInDB.forEach((field)=>{
		const path = Object.keys(field)[0];
		const splitPath = path.split('.');
		let bodyField = body;
		splitPath.forEach((sp)=>{
			bodyField = bodyField[sp];
		});
		if ((typeof bodyField) === 'undefined'){
			bodyField = field[path].default;
		}
		const dbField = field[path].store[0].split(':')[1];
		output[dbField] = bodyField;
	});
	return output;
}

module.exports.getDataToStoreInDB = getDataToStoreInDB;
module.exports.getFieldsToStore = getFieldsToStore;
module.exports.saveFile = saveFile;
module.exports.getFile = getFile;
module.exports.getFiles = getFiles;
module.exports.getApplication = getApplication;
module.exports.saveApplication = saveApplication;
