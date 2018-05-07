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

const matchstick = require('matchstick');

//*******************************************************************

/** If body passed in as string, converts it to a JSON object
 * @param  {Object} req - request object
 * @return {Object} - request body as a JSON Object
 */
function getBody(req){
	let inputPost = req.body;
	if (inputPost.body) {
		inputPost = JSON.parse(inputPost.body);
	}
	return inputPost;
}

/** Find the matching route in the routing schema for any request. If one is found, extract the useful information from it and return that information.
 * @param  {Object} apiSchema - The whole routing schema, which contains the route used.
 * @param  {String} reqPath - The path that was requested from the API
 * @return {Object} Object describing the matching route, if any, in the routing schema. The path field contains the matched path listed in the routing schema. The tokens field contains all tokens, listed in the matched path. And the matches field contains the tokens with the values that have been given for them.
 */
function apiSchemaData(apiSchema, reqPath) {

	if (apiSchema) {
		for (const k in apiSchema.paths) {

			if (apiSchema.paths.hasOwnProperty(k)) {

				const ms = matchstick(k, 'template');
				ms.match(reqPath);

				if (ms.match(reqPath)) {

					return {
						path: k,
						tokens: ms.tokens,
						matches: ms.matches
					};
				}
			}
		}
	}

}

/**
 * Takes input like fieldOne and converts it to Field One so that it is easier to read
 * @param  {String} input - String to be made more readable
 * @return {String}       - More readble string
 */
function makeFieldReadable(input) {

	return input
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, function (str) {
			return str.toUpperCase();
		})
		.replace('Z I P', 'Zip')
		.replace('U R L', 'URL');

}

/**
 * Takes input like fieldOne.fieldTwo and converts it to Field One/Field Two to make it easier to read
 * @param  {String} input - path to field which has error
 * @return {String}       - human readable path to errored field
 */
function makePathReadable(input) {

	if (typeof input === 'string') {
		const parts = input.split('.');
		const readableParts = [];
		let readablePath = '';
		parts.forEach((field) => {
			readableParts.push(makeFieldReadable(field));
		});
		readablePath = readableParts.shift();
		readableParts.forEach((part) => {
			readablePath = `${readablePath}/${part}`;
		});
		return readablePath;
	}
	else {
		return false;
	}

}

//*******************************************************************

module.exports.getBody = getBody;
module.exports.apiSchemaData = apiSchemaData;
module.exports.makePathReadable = makePathReadable;
module.exports.makeFieldReadable = makeFieldReadable;
