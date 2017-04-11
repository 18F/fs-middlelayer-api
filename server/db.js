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
const dbUtil = require('./dbUtil.js');

//*******************************************************************

function saveFile(appId, fileInfo, next){
	dbUtil.saveFile(appId, fileInfo, function(err) {
		if (err) {
			return next (err);
		}
		else {
			return next (null);
		}

	});
}

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

module.exports.saveFile = saveFile;
module.exports.getDataToStoreInDB = getDataToStoreInDB;
module.exports.getFieldsToStore = getFieldsToStore;
