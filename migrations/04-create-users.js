'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			user_name: { //eslint-disable-line camelcase
				type: Sequelize.STRING,
				unique: true
			},
			pass_hash: { //eslint-disable-line camelcase
				type: Sequelize.STRING
			},
			user_role: { //eslint-disable-line camelcase
				type: Sequelize.STRING
			},
			created: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updated: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: function(queryInterface, Sequelize) { //eslint-disable-line no-unused-vars
		return queryInterface.dropTable('users');
	}
};
