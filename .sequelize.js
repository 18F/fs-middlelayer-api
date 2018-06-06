require('dotenv').config();

const url = require('url');

const dbParams = url.parse(process.env.DATABASE_URL, true);
const dbAuth = dbParams.auth.split(':');

const Sequelize = require('sequelize');
const Operators = Sequelize.Op;


const dbConfig = {
	database: dbParams.pathname.split('/')[1],
	username: dbAuth[0],
	password: dbAuth[1],
	host: dbParams.hostname,
	port: dbParams.port,
	ssl: false,
	dialect: dbParams.protocol.split(':')[0],
	logging: console.log,
	seederStorage: 'sequelize',
	operatorAliases: false
};

if (dbParams.hostname !== 'localhost' &&
	dbParams.hostname !== '127.0.0.1' &&
    dbParams.hostname !== 'postgres') {
	dbConfig.ssl = true;
	dbConfig.dialectOptions = {
		ssl:{
			require:true
		}
	};
}

module.exports = dbConfig;
