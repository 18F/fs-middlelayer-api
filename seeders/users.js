/* Disabling eslint rules because this code is interacting with DB*/
/* eslint-disable camelcase, quotes */
'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {
		return queryInterface.bulkInsert('users', [
        {user_name: "admin", pass_hash: "$2a$10$IiiHB2Y5LAVI1XywEnK4qu8hXQ8FR/tybHtlEgPwSeRJba3Xf8ZzW", user_role: "admin", created: "now()", updated: "now()" },
        {user_name: "user", pass_hash: "$2a$10$TbVjcMHCBMu1W/2Rjxfx2uqtM5q0Q3q8XbNLHmYgFKOX/q41qVVse", user_role: "user", created: "now()", updated: "now()" }
		], {}
    );
	},

	down: function (queryInterface, Sequelize) {
		return queryInterface.bulkDelete({tableName: 'users'}, null, {});
	}
};
/* eslint-enable camelcase, quotes */
