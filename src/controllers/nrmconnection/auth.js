'use strict';

//*******************************************************************
// required modules
const request = require('request-promise');

const SUDS_INFO = require('../vcap.js').SUDS_INFO;
const SUDS_API_URL = SUDS_INFO.SUDS_API_URL;
const SUDS_API_USERNAME = SUDS_INFO.username;
const SUDS_API_PASSWORD = SUDS_INFO.password;

/**
 * Promise function as to hit the /login function
 * @return {Promise}      - if fufilled a jwt token to pass on future requests
 */
function getToken() {
	return new Promise(function(fulfill, reject) {
		const authURL = `${SUDS_API_URL}/login`;
		request.post(authURL, {
			auth: {
				user: SUDS_API_USERNAME,
				pass: SUDS_API_PASSWORD,
				// Change to false if SUDS API requires digest
				sendImmediately: true
			},
			json: true
		}).then(function(response) {
			if (response.token) {
				return fulfill(response.token);
			}
			reject(new Error('Token not in data returned from SUDS basic API'));
		}).catch(function(err) {
			reject(err);
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
module.exports.SUDS_API_URL = SUDS_API_URL;
