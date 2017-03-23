'use strict';
module.exports = function(sequelize, DataTypes) {
	const fileTypes = sequelize.define('file_types', {
		file_type: DataTypes.STRING, //eslint-disable-line camelcase
		file_type_desc: DataTypes.STRING //eslint-disable-line camelcase
	});
	return fileTypes;
};
