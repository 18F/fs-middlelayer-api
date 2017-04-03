'use strict';

require('dotenv').config();

module.exports = {
	up: function (queryInterface, Sequelize) { 
		return queryInterface.bulkInsert('users', [
		        {user_name: "admin@fs.fed.us", pass_hash: process.env.ADMINROLE_HASH, user_role: "admin", created: "now()", updated: "now()" }, 
		        {user_name: "user@fs.fed.us", pass_hash: process.env.USERROLE_HASH, user_role: "user", created: "now()", updated: "now()" } 
		]);
	},
	down: function (queryInterface, Sequelize) { 
		return queryInterface.bulkDelete('users', [
		        {user_name: ["admin@fs.fed.us","user@fs.fed.us"]} 
		]);
	}
};
