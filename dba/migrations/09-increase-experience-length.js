'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {
		return queryInterface.changeColumn('applications', 'experience_list', {
			type: Sequelize.STRING(512),
			allowNull: true
		});
	},
	down: function (queryInterface, Sequelize) {
		return queryInterface.changeColumn('applications', 'experience_list', {
			type: Sequelize.STRING(255),
			allowNull: true
		});
	}
};
