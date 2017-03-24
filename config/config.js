require('dotenv').config();

const url = require('url');

const dbParams = url.parse(process.env.DATABASE_URL, true);
const dbAuth = dbParams.auth.split(':');

let dbConfig = {
	database: dbParams.pathname.split('/')[1],
	username: dbAuth[0],
	password: dbAuth[1],
	host: dbParams.hostname,
	port: dbParams.port,
	dialect: dbParams.protocol.split(':')[0],
	logging: console.log,
	seederStorage: "sequelize"
};

if (dbParams.hostname !== 'localhost') {
	dbConfig.ssl = true;
	dbConfig.dialectOptions = {
		ssl:{
			require:true
		}
	};
}

module.exports = dbConfig;
