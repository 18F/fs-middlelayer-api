'use strict';
module.exports = {
	up: function (queryInterface, Sequelize) { 
		return queryInterface.bulkInsert('users', [
		        {user_name: "admin@fs.fed.us", pass_hash: "$2a$10$6VvFcDU3QnOriEOD1CgzsuED7HntnP484S89tSeZwYZWJs90biyUW", user_role: "admin", created: "now()", updated: "now()" }, 
		        {user_name: "user@fs.fed.us", pass_hash: "$2a$10$Mkhnuk8VFzwSyJ0zgSoeMuZS27K75Dzeaz6gVyjFh9GMW6dXxqBnq", user_role: "user", created: "now()", updated: "now()" } 
		]);
	},
	down: function (queryInterface, Sequelize) { 
		return queryInterface.bulkDelete('users', [
		        {user_name: ["admin@fs.fed.us","user@fs.fed.us"]} 
		]);
	}
};
