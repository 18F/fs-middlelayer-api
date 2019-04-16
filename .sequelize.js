require('dotenv').config();

const url = require('url');
const logger = require('./src/controllers/utility.js').logger;
logger.info('SEQUELIZE initiated');

const dbParams = url.parse(process.env.DATABASE_URL, true);
const dbAuth = dbParams.auth.split(':');

const Sequelize = require('sequelize');


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
