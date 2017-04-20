'use strict';
module.exports = function(sequelize, DataTypes) {
	const fileTypes = sequelize.define('file_types', {
		fileType: { type: DataTypes.STRING(10), field: 'file_type' },
		fileTypeName: { type: DataTypes.STRING(100), field: 'file_type_name' },
		fileTypeDesc: { type: DataTypes.STRING(255), field: 'file_type_desc' }
	});
	return fileTypes;
};
