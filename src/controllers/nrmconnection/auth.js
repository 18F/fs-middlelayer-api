'use strict';

//*******************************************************************
// required modules
const request = require('request-promise');

const vcapConstants = require('../vcap-constants.js');
const errorUtil = require('../errors/error.js');
/**
 * Promise function as to hit the /login function
 * @return {Promise}      - if fufilled a jwt token to pass on future requests
 */
function getToken() {
	return new Promise(function(fulfill, reject) {
		const authURL = `${vcapConstants.SUDS_INFO.SUDS_API_URL}/login`;
		request.post(authURL, {
			auth: {
				user: vcapConstants.SUDS_INFO.username,
				pass: vcapConstants.SUDS_INFO.password,
				// Change to false if SUDS API requires digest
				sendImmediately: true
			},
			json: true
		}).then(function(response) {
			if (response.token) {
				return fulfill(response.token);
			}
			errorUtil.rejectWithError(new Error('Unable to retrieve valide token from SUDS API.'), reject);
		}).catch((err) => {
			errorUtil.rejectWithError(err, reject);
		});
	});
}

/**
 * Adds an authorization header to a request.
 * @param  {String}  uri - uri to submit the request
 * @param  {Object} body - body of the object to be requested
 * @param  {String} sudsToken - jwt token to be used to pass long with requests
 */
function getRequestOptions(uri, method = 'GET', body = null, sudsToken = '') {
	const requestOptions = {
		method,
		uri,
		json: true
	};

	if (body){
		requestOptions.body = body;
	}

	if (sudsToken) {
		requestOptions.headers = {
			'Authorization': `Bearer ${sudsToken}`
		};
	}

	return requestOptions;
}

module.exports.getToken = getToken;
module.exports.getRequestOptions = getRequestOptions;
module.exports.SUDS_API_URL = vcapConstants.SUDS_INFO.SUDS_API_URL;
