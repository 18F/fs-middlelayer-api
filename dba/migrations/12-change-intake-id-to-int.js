'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {
		return queryInterface.changeColumn('applications', 'intake_id', {
            type: 'INTEGER USING CAST("intake_id" as INTEGER)'
		});
	},

	down: function (queryInterface, Sequelize) {
		return queryInterface.changeColumn('applications', 'intake_id', {
			type: Sequelize.STRING(255)
		});
	}
};

