'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('file_types', {
			file_type: { //eslint-disable-line camelcase
				allowNull: false,
				primaryKey: true,
				type: Sequelize.STRING
			},
			file_type_desc: { //eslint-disable-line camelcase
				type: Sequelize.STRING,
				allowNull: false
			}
		});
	},
	down: function(queryInterface, Sequelize) { //eslint-disable-line no-unused-vars
		return queryInterface.dropTable('file_types');
	}
};
