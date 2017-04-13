'use strict';
module.exports = function(sequelize, DataTypes) {
	const fileTypes = sequelize.define('file_types', {
		file_type: DataTypes.STRING(10),
		file_type_name: DataTypes.STRING(100),
		file_type_desc: DataTypes.STRING(255)
	});
	return fileTypes;
};
