'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('file_types', {
			file_type: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.STRING(10)
			},
			file_type_name: {
				type: Sequelize.STRING(100),
				allowNull: false
			},
			file_type_desc: {
				type: Sequelize.STRING(255)
			}
		});
	},
	down: function(queryInterface, Sequelize) {
		return queryInterface.dropTable('file_types');
	}
};
