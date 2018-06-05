require('dotenv').config();

const url = require('url');
const logger = require('./src/controllers/utility.js').logger;
logger.info('SEQUELIZE initiated');

const dbParams = url.parse(process.env.DATABASE_URL, true);
const dbAuth = dbParams.auth.split(':');

const Sequelize = require('sequelize');
const Operators = Sequelize.Op;

const operatorsAliases = {
	$eq: Operators.eq,
	$ne: Operators.ne,
	$gte: Operators.gte,
	$gt: Operators.gt,
	$lte: Operators.lte,
	$lt: Operators.lt,
	$not: Operators.not,
	$in: Operators.in,
	$notIn: Operators.notIn,
	$is: Operators.is,
	$like: Operators.like,
	$notLike: Operators.notLike,
	$iLike: Operators.iLike,
	$notILike: Operators.notILike,
	$regexp: Operators.regexp,
	$notRegexp: Operators.notRegexp,
	$iRegexp: Operators.iRegexp,
	$notIRegexp: Operators.notIRegexp,
	$between: Operators.between,
	$notBetween: Operators.notBetween,
	$overlap: Operators.overlap,
	$contains: Operators.contains,
	$contained: Operators.contained,
	$adjacent: Operators.adjacent,
	$strictLeft: Operators.strictLeft,
	$strictRight: Operators.strictRight,
	$noExtendRight: Operators.noExtendRight,
	$noExtendLeft: Operators.noExtendLeft,
	$and: Operators.and,
	$or: Operators.or,
	$any: Operators.any,
	$all: Operators.all,
	$values: Operators.values,
	$col: Operators.col
};


const dbConfig = {
	database: dbParams.pathname.split('/')[1],
	username: dbAuth[0],
	password: dbAuth[1],
	host: dbParams.hostname,
	port: dbParams.port,
	ssl: false,
	dialect: dbParams.protocol.split(':')[0],
	logging: function (sql, sequelizeObject) {
		logger.info(`SEQUELIZE: ${sql}`);
	},
	seederStorage: 'sequelize',
	operatorAliases: Operators
};

if (dbParams.hostname !== 'localhost' &&
	dbParams.hostname !== '127.0.0.1') {
	dbConfig.ssl = true;
	dbConfig.dialectOptions = {
		ssl:{
			require:true
		}
	};
}

module.exports = dbConfig;
