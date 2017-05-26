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
require('dotenv').config();
const minimist = require('minimist');
const bcrypt = require('bcrypt-nodejs');
const db = require('./db.js');

//*************************************************************

const args = minimist(process.argv.slice(2));
const username = args.u;
const password = args.p;
const userrole = args.r;

if (username && password && userrole && (userrole === 'admin' || userrole === 'user')){
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	
	const user = {};
	user.userName = username;
	user.passHash = hash;
	user.userRole = userrole;

	db.saveUser(user, function(err, usr){
		if (err){
			console.error('\nERROR!\n' + err);
		}
		else {
			console.log('\nSUCCESS! User account created with username=' + usr.userName);
			return;
		}
	});
}
else {
	console.error('\nERROR! Invlid parameters supplied.');
}
