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
        control_number: controlNumber,
        form_type: formType,
        website_addr: website,
    })
    .then(function(appl) {
    	callback(null, appl);
    })
    .catch(function(error) {
    	callback(error, null);
    });
};

const saveFile = function(applicationId, fileType, fileNmae, callback){
	models.files.create({
        file_type: fileType,
        file_name: fileNmae,
        file_path: '/',
        application_id: applicationId,
      })
    .then(function(file) {
    	callback(null, file);
    })
    .catch(function(error) {
    	callback(error, null);
    });
};

//*******************************************************************
// exports

module.exports.saveApplication = saveApplication;
module.exports.saveFile = saveFile;