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
const passport = require('passport');  
const Strategy = require('passport-local');
const bcrypt = require('bcrypt-nodejs');

const models = include('models');
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY;

//*******************************************************************
// passport 

passport.use(new Strategy(  

	function(username, password, done) {
		
		models.users.findOne({
			where: {user_name: username} //eslint-disable-line camelcase
		}).then(function(user) {
			if (user){
				if (bcrypt.compareSync(password, user.pass_hash)){
					done(null, {
						id: user.user_name,
						role: user.user_role,
						verified: true
					});	
				}
				else {
					done(null, false);
				}
			}
			else {
				done(null, false);
			}
		}).catch(function (err) {
			console.error(err);
			done(null, false);
		});
	}
));

//*******************************************************************

const serialize = function(req, res, next) {  

	req.user = {
		id: req.user.id,
		role: req.user.role
	};
	next();
};

const generate = function(req, res, next) {   
	
	req.token = jwt.sign({
		id: req.user.id,
		role: req.user.role
	}, jwtSecretKey, { expiresIn: 120 * 60 });
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
