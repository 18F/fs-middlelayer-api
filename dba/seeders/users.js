'use strict';

require('dotenv').config();

module.exports = {
	up: function (queryInterface, Sequelize) {
		let userAccounts = [];
		if(process.env.ADMINROLE_USER && process.env.ADMINROLE_HASH){
			userAccounts.push({user_name: process.env.ADMINROLE_USER, pass_hash: process.env.ADMINROLE_HASH, user_role: 'admin', created: 'now()', updated: 'now()'});
		}
		if(process.env.USERROLE_USER && process.env.USERROLE_HASH){
			userAccounts.push({user_name: process.env.USERROLE_USER, pass_hash: process.env.USERROLE_HASH, user_role: 'user', created: 'now()', updated: 'now()'});
		}
		if(userAccounts.length > 0){
			return queryInterface.bulkInsert('users', userAccounts);	
		}
	},
	down: function (queryInterface, Sequelize) { 
		return queryInterface.bulkDelete('users', [
			{user_name: [process.env.ADMINROLE_USER,process.env.USERROLE_USER]} 
		]);
	}
};
