'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {
		return queryInterface.changeColumn('applications', 'activity_description', {
			type: Sequelize.STRING(4000),
			allowNull: true
		});
	},

	down: function (queryInterface, Sequelize) {
		return queryInterface.changeColumn('applications', 'activity_description', {
			type: Sequelize.STRING(512),
			allowNull: true
		});
	}
};
