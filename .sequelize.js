require('dotenv').config();
console.log('Entering 1');
const url = require('url');
console.log('Entering 2');
console.log(url);
const logger = require('./src/controllers/utility.js').logger;
console.log('Entering 3');
console.log(logger);
logger.info('SEQUELIZE initiated');
console.log('Entering 4');
console.log(process.env.DATABASE_URL);

process.env.DATABASE_URL = 'postgres://ubuntu@127.0.0.1/circle_test';

const dbParams = url.parse(process.env.DATABASE_URL, true);
console.log('Entering 5');
console.log(dbParams);
const dbAuth = dbParams.auth.split(':');
console.log('Entering 6');
const Sequelize = require('sequelize');
console.log('Entering 7');

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
	seederStorage: 'sequelize'
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
