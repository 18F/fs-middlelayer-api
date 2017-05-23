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
 * @param  {Number}   applicationId - Id of application file is associated with
 * @param  {Array}   uploadFile    - Information about file being saved
 * @param  {Function} callback      - function to be called after trying to save file
 */
function saveFile(applicationId, uploadFile, callback){
	models.files.create({
		applicationId: applicationId, 
		fileType: uploadFile.filetypecode, 
		filePath: uploadFile.keyname,
		fileName: uploadFile.filename,
		fileOriginalname: uploadFile.originalname,
		fileExt: uploadFile.ext,
		fileSize: uploadFile.size,
		fileMimetype: uploadFile.mimetype,
		fileEncoding: uploadFile.encoding
	})
	.then(function() {
		return callback(null);
	})
	.catch(function(err) {
		console.error(err);
		return callback(err);
	});
}

/**
 * Gets file info from DB
 * @param  {String}   fp - Path to file in data store
 * @param  {Function} callback - Function to call after getting info back from DB
 */
const getFile = function(fp, callback){

	models.files.findOne({
		where: {filePath: fp} 
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
 * @param  {Number}   appId - application Id of files to get
 * @param  {Function} callback      - Function to call after getting info back from DB
 */
const getFiles = function(appId, callback){

	models.files.findAll({
		where: {applicationId: appId}
	})
	.then(function(files) {
		return callback(null, files);
	})
	.catch(function(err) {
		console.error(err);
		return callback(err, null);
	});
};

/**
 * Gets application info from DB
 * @param  {Number}   cNum - control number of application to retreive
 * @param  {Function} callback      - Function to call after getting info back from DB
 */
const getApplication = function(cNum, callback){

	models.applications.findOne({
		where: {
			controlNumber: cNum
		}
	}).then(function(appl) {
		if (appl){
			
			getFiles(appl.id, function(fileErr, files) {
				if (fileErr){
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
			return callback(null, null, null);
		}
	}).catch(function (err) {
		console.error(err);
		return callback(err, null, null);
	});
};

/**
 * Save application data to DB
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
		default: {
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

/**
 * Save user data to DB
 * @param  {Object}   user       - user object containing fields to save in DB
 * @param  {Function} callback      - Function to call after saving user to DB
 */
const saveUser = function(user, callback) {
	models.users.create(user)
	.then(function(usr) {
		return callback(null, usr);
	})
	.catch(function(err) {
		console.error(err);
		return callback(err, null);
	});
};

/**
 * Delete user from DB
 * @param  {String}   username       - username to be deleted from DB
 * @param  {Function} callback      - Function to call after deleting user from DB
 */
const deleteUser = function(username, callback) {
	models.users.destroy({
		where: {
			userName: username
		}
	}).then(function(rowDeleted){
		if (rowDeleted === 1){
			return callback(null);
		}
		else {
			return callback('row could not be be deleted');	
		}
	}, function(err){
		console.error(err); 
		return callback(err);
	});
};

module.exports.getDataToStoreInDB = getDataToStoreInDB;
module.exports.getFieldsToStore = getFieldsToStore;
module.exports.saveFile = saveFile;
module.exports.getFile = getFile;
module.exports.getFiles = getFiles;
module.exports.getApplication = getApplication;
module.exports.saveApplication = saveApplication;
module.exports.saveUser = saveUser;
module.exports.deleteUser = deleteUser;
