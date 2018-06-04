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

const models = include('src/models');
const jwt = require('jsonwebtoken');
const uuidV4 = require('uuid/v4');
const vcapConstants = require('../vcap-constants.js');
const logger = require('../utility.js').logger;

//*******************************************************************
// passport

passport.use(new Strategy(

	function(un, pw, done) {

		models.users.findOne({
			where: {userName: un}
		}).then(function(user) {
			if (user){
				if (bcrypt.compareSync(pw, user.passHash)){
					logger.info(`AUTHENTICATION: ${user.userName}:${user.userRole} authenicated session for the middlelayer.`);
					done(null, {
						id: user.userName,
						role: user.userRole,
						verified: true
					});
				}
				else {
					logger.warn(`AUTHENTICATION: ${un} - a registered userName submitted bad password.`);
					done(null, false);
				}
			}
			else {
				logger.warn(`AUTHENTICATION: ${un} - a not registered user attempted to log into the middlelayer.`);
				done(null, false);
			}
		}).catch(function (err) {
			logger.warn('AUTHENTICATION: Error:', err);
			done(null, false);
		});
	}
));

//*******************************************************************

/**
 * Serializes user info
 * @param  {Object}   req - Request object
 * @param  {Object}   res - Response object
 * @param  {Function} next - What to call after serializing user info
 */
function serialize(req, res, next) {

	req.user = {
		id: req.user.id,
		role: req.user.role
	};
	next();
}

/**
 * Creates JWT to return to user
 * @param  {Object}   req - Request object
 * @param  {Object}   res - Response object
 * @param  {Function} next - What to call after creating JWT
 */
function generate(req, res, next) {

	const claims = {
		expiresIn: 120 * 60,
		notBefore: 0,
		jwtid: uuidV4(),
		issuer: 'fs-epermit-api',
		subject: 'permit applications',
		audience: 'fs-epermit-api-intake-users'
	};

	req.token = jwt.sign({
		id: req.user.id,
		role: req.user.role
	}, vcapConstants.JWT_SECRET_KEY, claims);

	next();
}

/**
 * Responds to user request with token
 * @param  {Object}   req - Request object
 * @param  {Object}   res - Response object
 */
function respond(req, res) {

	res.status(200).json({
		user: req.user,
		token: req.token
	});
}

//*******************************************************************=
//exports

module.exports.passport = passport;
module.exports.serialize = serialize;
module.exports.generate = generate;
module.exports.respond = respond;
