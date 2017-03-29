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
const models = include('models');

//*******************************************************************

const saveApplication = function(controlNumber, formType, website, callback) {
	models.applications.create({
		control_number: controlNumber, //eslint-disable-line camelcase
		form_type: formType, //eslint-disable-line camelcase
		website_addr: website //eslint-disable-line camelcase
	})
	.then(function(appl) {
		return callback(null, appl);
	})
	.catch(function(err) {
		return callback(err, null);
	});
};

const saveFile = function(applicationId, fileType, fileNmae, callback){
	models.files.create({
		file_type: fileType, //eslint-disable-line camelcase
		file_name: fileNmae, //eslint-disable-line camelcase
		file_path: '/', //eslint-disable-line camelcase
		application_id: applicationId //eslint-disable-line camelcase
	})
	.then(function(file) {
		return callback(null, file);
	})
	.catch(function(err) {
		return callback(err, null);
	});
};

const getApplication = function(controlNumber, callback){

	models.applications.findOne({
		where: {control_number: controlNumber} //eslint-disable-line camelcase
	}).then(function(appl) {
		if (appl){
			return callback(null, appl);	
		}
		else {
			// TO BE REMOVED begin -- create appl if not exist
			models.applications.create({
				control_number: controlNumber, //eslint-disable-line camelcase
				form_type: 'FS-2700-3f', //eslint-disable-line camelcase
				website_addr: 'testweb1000000000.org' //eslint-disable-line camelcase
			})
			.then(function(appl) {
				return callback(null, appl);	
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
};

//*******************************************************************
// exports

module.exports.saveApplication = saveApplication;
module.exports.saveFile = saveFile;
module.exports.getApplication = getApplication;
