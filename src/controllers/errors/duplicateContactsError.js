/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************

module.exports = function DuplicateContactsError(duplicateContacts) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = duplicateContacts.length + ' duplicate contacts found!';
	if (duplicateContacts) this.duplicateContacts = duplicateContacts;
};

require('util').inherits(module.exports, Error);
