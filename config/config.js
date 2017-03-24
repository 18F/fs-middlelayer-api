const dotenv = require('dotenv').config();

const url = require('url');

const dbParams = url.parse(process.env.DATABASE_URL);
const dbAuth = dbParams.auth.split(':');

const dbConfig = {
	database: dbParams.pathname.split('/')[1],
	username: dbAuth[0],
	password: dbAuth[1],
	host: dbParams.hostname,
	port: dbParams.port,
	dialect: dbParams.protocol.split(':')[0],
	ssl: true
};

module.exports = {
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect
}
