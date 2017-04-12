'use strict';

require('dotenv').config();

module.exports = {
	up: function (queryInterface, Sequelize) { 
		return queryInterface.bulkInsert('users', [
			{user_name: process.env.ADMINROLE_USER, pass_hash: process.env.ADMINROLE_HASH, user_role: 'admin', created: 'now()', updated: 'now()'}, 
			{user_name: process.env.USERROLE_USER, pass_hash: process.env.USERROLE_HASH, user_role: 'user', created: 'now()', updated: 'now()'} 
		]);
	},
	down: function (queryInterface, Sequelize) { 
		return queryInterface.bulkDelete('users', [
			{user_name: [process.env.ADMINROLE_USER,process.env.USERROLE_USER]} 
		]);
	}
};
