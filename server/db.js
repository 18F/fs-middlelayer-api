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
const models = include('models');

//*******************************************************************

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

function getApplication(controlNumber, callback){
	models.applications.findOne({
		where: {control_number: controlNumber}
	}).then(function(appl) {
		if (appl){
			return callback(null, appl);	
		}
		else {

			// TO BE REMOVED begin -- create appl if not exist

			models.applications.findOne({
				where: {control_number: '1000000000'} 
			}).then(function(appl) {
				if (appl){
					return callback(null, appl);	
				}
				else {

					models.applications.create({
						control_number: '1000000000',
						form_name: 'FS-2700-3f',
						region: '11',
						forest: '22',
						district: '33',
						website: 'testwebsite.org',
						activity_description: 'test activity_description',
						location_description: 'test location_description',
						start_datetime: '2017-05-01T10:00:00Z',
						end_datetime: '2017-05-05T19:00:00Z',
						number_participants: 45,
						individual_is_citizen: true,
						small_business: true,
						advertising_url: 'www.advertising.com',
						advertising_description: 'test advertising_description',
						client_charges: 'test client_charges',
						experience_list: 'test experience_list'
					})
					.then(function(appl) {
						return callback(null, appl);	
					})
					.catch(function(err) {
						return callback(err, null);
					});
				}
			})
			.catch(function(err) {
				return callback(err, null);
			});
			
			// TO BE REMOVED end -- create appl if not exist
			//return callback('no record found', null);
		}
	}).catch(function (err) {
		console.error(err);
		return callback(err, null);
	});
}

const saveApplication = function(controlNumber, toStore, callback) {
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
 * @param  {Array[String]} fieldsToStore - Array containing names of field to store in DB
 * @param  {String} path - path to each field from root of schema
 * @param  {String} saveLocation - location which field should be saved. Valid options are middleLayer or basic.
 */
function getFieldsToStore(schema, fieldsToStore, path, saveLocation){
	const keys = Object.keys(schema);
	keys.forEach((key)=>{
		switch (key){
		case 'allOf':
			for (let i = 0; i < schema.allOf.length; i++){
				getFieldsToStore(schema.allOf[i], fieldsToStore, `${path}`, saveLocation);
			}
			break;
		case 'properties':
			getFieldsToStore(schema.properties, fieldsToStore, `${path}`, saveLocation);
			break;
		case 'oneOf':
			for (let i = 0; i < schema.oneOf.length; i++){
				getFieldsToStore(schema.oneOf[i], fieldsToStore, `${path}`, saveLocation);
			}
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
module.exports.getFiles = getFiles;
module.exports.getApplication = getApplication;
module.exports.saveApplication = saveApplication;
