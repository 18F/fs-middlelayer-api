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

const saveApplication = function(controlNumber, applicationData, callback) {
	let formName, activityDescription, locationDescription, startDateTime, endDateTime, numberParticipants;
	let individualIsCitizen, smallBusiness, advertisingURL, advertisingDescription, clientCharges, experienceList;

	if(applicationData.type === 'noncommercial') {
		formName = applicationData.noncommercialFields.formName;
		activityDescription = applicationData.noncommercialFields.activityDescription;
		locationDescription = applicationData.noncommercialFields.locationDescription;
		startDateTime = applicationData.noncommercialFields.startDateTime;
		endDateTime = applicationData.noncommercialFields.endDateTime;
		numberParticipants = applicationData.noncommercialFields.numberParticipants;
	}
	else if (applicationData.type === 'tempOutfitters') {
		formName = applicationData.tempOutfitterFields.formName;
		activityDescription = applicationData.tempOutfitterFields.activityDescription;
		individualIsCitizen = applicationData.tempOutfitterFields.individualIsCitizen;
		smallBusiness = applicationData.tempOutfitterFields.smallBusiness;
		advertisingURL = applicationData.tempOutfitterFields.advertisingURL;
		advertisingDescription = applicationData.tempOutfitterFields.advertisingDescription;
		clientCharges = applicationData.tempOutfitterFields.clientCharges;
		experienceList = applicationData.tempOutfitterFields.experienceList;
	}
	models.applications.create({
		control_number: controlNumber,
		form_name: formName, 
		region: applicationData.region,
		forest: applicationData.forest,
		district: applicationData.district,
		website: applicationData.applicantInfo.website,
		activity_description: activityDescription,
		location_description: locationDescription,
		start_datetime: startDateTime,
		end_datetime: endDateTime,
		number_participants: numberParticipants,
		individual_is_citizen: individualIsCitizen,
		small_business: smallBusiness,
		advertising_url: advertisingURL,
		advertising_description: advertisingDescription,
		client_charges: clientCharges,
		experience_list: experienceList
	})
	.then(function(appl) {
		return callback(null, appl);
	})
	.catch(function(err) {
		console.error(err);
		return callback(err, null);
	});
};

const saveFile = function(applicationId, uploadFile, callback){
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
};

const getApplication = function(controlNumber, callback){

	models.applications.findOne({
		where: {control_number: controlNumber} 
	}).then(function(appl) {
		if (appl){
			return callback(null, appl);	
		}
		else {
			// TO BE REMOVED begin -- create appl if not exist
			models.applications.create({
				control_number: controlNumber,
				form_name: 'FS-2700-3f',
				website: 'testweb1000000000.org'
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
