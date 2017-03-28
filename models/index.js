'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);

const db = {};

const sequelizeOptions = {
	dialect: url.parse(process.env.DATABASE_URL, true).protocol.split(':')[0]
};

if (url.parse(process.env.DATABASE_URL, true).hostname !== 'localhost') {
	sequelizeOptions.dialectOptions = {
		ssl: true
	};
}

const sequelize = new Sequelize(process.env.DATABASE_URL, sequelizeOptions);

fs
  .readdirSync(__dirname)
  .filter(function(file) {
	return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
})
  .forEach(function(file) {
	const model = sequelize.import(path.join(__dirname, file));
	db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
