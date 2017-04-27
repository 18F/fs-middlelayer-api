/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

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

//*******************************************************************

module.exports.getBody = getBody;