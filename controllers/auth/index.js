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

const passport = require('passport');  
const Strategy = require('passport-local');

const jwt = require('jsonwebtoken');

//*******************************************************************
// passport 

passport.use(new Strategy(  
    function(username, password, done) {

	if (username === 'user' && password === '12345'){
		done(null, {
			id: username,
			firstname: 'first',
			lastname: 'last',
			email: 'name@email.com',
			verified: true
		});
	}
	else {
		done(null, false);
	}
}
));

//*******************************************************************

const serialize = function(req, res, next) {  

	req.user = {
		id: req.user.id
	};
	next();
};

const generate = function(req, res, next) {   
    
	req.token = jwt.sign({
		id: req.user.id
	}, 'superSecret', { expiresIn: 120 * 60 });
	next();
};

const respond = function(req, res) { 

	res.status(200).json({
		user: req.user,
		token: req.token
	});
};

//*******************************************************************=
//exports

module.exports.passport = passport;
module.exports.serialize = serialize;
module.exports.generate = generate;
module.exports.respond = respond;
