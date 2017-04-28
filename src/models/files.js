'use strict';
module.exports = function(sequelize, DataTypes) {
	const files = sequelize.define('files', {
		id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
		applicationId: { type: DataTypes.UUID, field: 'application_id' },
		fileType: { type: DataTypes.STRING(10), field: 'file_type' },
		filePath: { type: DataTypes.STRING(255), field: 'file_path' },
		fileName: { type: DataTypes.STRING(255), field: 'file_name' },
		fileOriginalname: { type: DataTypes.STRING(255), field: 'file_originalname' },
		fileExt: { type: DataTypes.STRING(20), field: 'file_ext' },
		fileSize: { type: DataTypes.BIGINT, field: 'file_size' },
		fileMimetype: { type: DataTypes.STRING(100), field: 'file_mimetype' },
		fileEncoding: { type: DataTypes.STRING(100), field: 'file_encoding' },
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created' },
		updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated' }
	}, {
		timestamps  : true
	}, {
		classMethods: {
			associate: function(models) {
				files.belongsTo(models.applications, {
					foreignKey: 'application_id',
					onDelete: 'CASCADE'
				});
			}
		}
	});
	return files;
};
