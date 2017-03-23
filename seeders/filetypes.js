'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) { //eslint-disable-line no-unused-vars
		return queryInterface.bulkInsert('file_types', [
        {file_type: "INC", file_type_desc: "Insurance Certificate" }, //eslint-disable-line camelcase, quotes
        {file_type: "GSE", file_type_desc: "Good Standing Evidence" }, //eslint-disable-line camelcase, quotes
        {file_type: "OPP", file_type_desc: "Operating Plan" } //eslint-disable-line camelcase, quotes
		], {}
    );
	},

	down: function (queryInterface, Sequelize) { //eslint-disable-line no-unused-vars
		return queryInterface.bulkDelete({tableName: 'file_types'}, null, {});
	}
};
