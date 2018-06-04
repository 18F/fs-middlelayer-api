'use strict';

//*******************************************************************
// required modules
const request = require('request-promise');
const auth = require('./auth.js');
const error = require('../errors/error.js');
const logger = require('../utility.js').logger;
const rejectWithError = require('../errors/error.js').rejectWithError;

//*******************************************************************

/** Gets info about an application and returns it.
 * @param  {Object} req - Request Object
 * @param  {Object} res - Response Object
 * @param  {Object} pathData - All data from swagger for the path that has been run
 * @return {Object} - Data from the basic API about an application
 */
function getFromBasic(req, res, controlNumber){

	return new Promise(function (fulfill, reject) {

		auth.getToken()
		.then(function(sudsToken) {
			const applicationCheck = `${auth.SUDS_API_URL}/application/${controlNumber}`;
			const getApplicationOptions = auth.getRequestOptions(applicationCheck, 'GET', null, sudsToken);

			request.get(getApplicationOptions)
			.then(function(response){
				return fulfill(response);
			})
			.catch(function(err){
				if (err.statusCode && err.statusCode === 404){
					logger.error('ERROR:', error);
					return error.sendError(req, res, 503, 'underlying service unavailable.');
				}
				else if (err.error && err.error.code === 'ETIMEDOUT') {
					logger.error('ERROR:', error);
					return error.sendError(req, res, 504, 'underlying service has timed out.');
				}
				else {
					rejectWithError(err, reject);
				}
			});
		})
			.catch((err) => { 
				rejectWithError(err, reject);
			});
	});
}

module.exports.getFromBasic = getFromBasic;
