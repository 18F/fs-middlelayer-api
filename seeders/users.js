'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) { //eslint-disable-line no-unused-vars
		return queryInterface.bulkInsert('users', [
        {user_name: "admin", pass_hash: "$2a$10$IiiHB2Y5LAVI1XywEnK4qu8hXQ8FR/tybHtlEgPwSeRJba3Xf8ZzW", user_role: "admin", created: "now()", updated: "now()" }, //eslint-disable-line camelcase, quotes
        {user_name: "user", pass_hash: "$2a$10$TbVjcMHCBMu1W/2Rjxfx2uqtM5q0Q3q8XbNLHmYgFKOX/q41qVVse", user_role: "user", created: "now()", updated: "now()" } //eslint-disable-line camelcase, quotes
		], {}
    );
	},

	down: function (queryInterface, Sequelize) { //eslint-disable-line no-unused-vars
		return queryInterface.bulkDelete({tableName: 'users'}, null, {});
	}
};
