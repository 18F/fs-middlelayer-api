/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************
// AUTO-POPULATE FUNCTIONS
/**
 * Concats all indexs of input
 * @param  {Array} input - Array of strings to be joined together
 * @return {String}      - Single string made up of all indicies of input 
 */
function concat(input){
	const output = input.join('');
	return output;
}

/**
 * Ensures all characters of input are upper case then joins them
 * @param  {Array} input - Array of strings to be joined together
 * @return {String}      - Single string made up of all indicies of input 
 */
function contId(input){
	return concat(
		input.map((i)=>{
			return i.toUpperCase();
		})
	);
}

/**
 * Adds UNIX timestamp and then joins all elements of input
 * @param  {Array} input - Array of strings to be joined together
 * @return {String}      - Single string made up of all indicies of input 
 */
function ePermitId(input){
	const timeStamp = + new Date();
	input.push(timeStamp);
	return concat(input);
}

//*******************************************************************

module.exports.concat = concat;
module.exports.contId = contId;
module.exports.ePermitId = ePermitId;
