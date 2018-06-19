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
const errorUtil = require('./errors/error');

//*******************************************************************

/**
 * Saves information about file into DB
 * @param  {Number}   applicationId - Id of application file is associated with
 * @param  {Array}   uploadFile    - Information about file being saved
 */
function saveFile(applicationId, uploadFile){
	return new Promise(function (fulfill, reject) {
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
			.then(function () {
				return fulfill();
			})
			.catch(function (err) {
				errorUtil.rejectWithError(err, reject, 'db.saveFile');
			});
	});
}

/**
 * Gets file info from DB
 * @param  {String}   filePath - Path to file in data store
 */
function getFileInfoFromDB(filePath){
	return new Promise((resolve, reject) => {
		models.files.findOne({
			where: { filePath: filePath }
		})
		.then((file) => {
			return resolve(file);
		})
		.catch((err) => {
			errorUtil.rejectWithError(err, reject, 'db.getFileInfoFromDB');
		});
	});
}

/**
 * Get info of multiple files from DB
 * @param  {Number}   appId - application Id of files to get
 */
function getFiles(appId){
	return new Promise((resolve, reject) => {
		models.files.findAll({
			where: { applicationId: appId }
		})
		.then((file) => {
			return resolve(file);
		})
		.catch((err) => {
			errorUtil.rejectWithError(err, reject, 'db.getFiles');
		});
	});
}

/**
 * Gets application info from DB
 * @param  {Number}   controlNumber - control number of application to retreive
 */
function getApplication(controlNum){
	return new Promise((resolve, reject) => {
		models.applications.findOne({
			where: {
				controlNumber: controlNum
			}
		}).then((application) => {
			if (application) {
				getFiles(application.id)
					.then((files) => {
						if (files) {
							return resolve({
								application: application,
								files: files
							});
						}
						return resolve({
							application: application,
							files: []
						});
					})
					.catch((error) => {
						errorUtil.rejectWithError(error, reject, 'db.getApplication:getFiles');
					});
			}
			else {
				errorUtil.rejectWithError({ application: false }, reject, 'db.getApplication:noApplication');
			}
		}).catch((err) => {
			errorUtil.rejectWithError(err, reject, 'db.getApplication');
		});
	});

}

/**
 * Save application data to DB
 * @param  {Object}   toStore       - object containing all of the fields to save to DB
 */
function saveApplication(toStore) {
	return new Promise(function(fulfill, reject){
		models.applications.create(toStore)
			.then((application) =>{
				return fulfill(application);
			})
			.catch((err) =>{
				errorUtil.rejectWithError(err, reject, 'db.saveApplication');
			});
	});

}

/** checks if the field specifies that it should be stored in that location
* @param {String} saveLocation - either in the middleLayer or move to the basic layer
* @param {Object} schemaKey - field to check about storage
*/
function checkIfStore(saveLocation, schemaKey){
	if (saveLocation === 'SUDS' && schemaKey.hasOwnProperty('sudsEndpoint')){
		return true;
	}
	if (saveLocation === 'middleLayer' && schemaKey.hasOwnProperty('localStore') && schemaKey.type !== 'file'){
		return true;
	}
	return false;
}

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
        // TODO: Why do these two do the same thing? 2018-06-15
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

			const needToStore = checkIfStore(saveLocation, schema[key]);
			if (needToStore){
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
		if (typeof bodyField === 'undefined'){
			bodyField = field[path].default;
		}
		const dbField = splitPath[splitPath.length - 1];
		output[dbField] = bodyField;
	});
	return output;
}

/**
 * Save user data to DB
 * @param  {Object}   user       - user object containing fields to save in DB
 * @param  {Function} callback      - Function to call after saving user to DB
 */
function saveUser(user, callback) {
	models.users.create(user)
	.then(function(usr) {
		return callback(null, usr);
	})
	.catch(function(err) {
		errorUtil.rejectWithError(err, callback, 'db.saveUser');
	});
}

/**
 * Delete user from DB
 * @param  {String}   username       - username to be deleted from DB
 * @param  {Function} callback      - Function to call after deleting user from DB
 */
function deleteUser(username, callback) {
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
		errorUtil.rejectWithError(err, callback, 'db.deleteUser');
	});
}

module.exports.getDataToStoreInDB = getDataToStoreInDB;
module.exports.getFieldsToStore = getFieldsToStore;
module.exports.saveFile = saveFile;
module.exports.getFileInfoFromDB = getFileInfoFromDB;
module.exports.getFiles = getFiles;
module.exports.getApplication = getApplication;
module.exports.saveApplication = saveApplication;
module.exports.saveUser = saveUser;
module.exports.deleteUser = deleteUser;
