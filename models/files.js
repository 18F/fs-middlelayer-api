'use strict';
module.exports = function(sequelize, DataTypes) {
	const files = sequelize.define('files', {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		application_id: DataTypes.INTEGER,
		file_type: DataTypes.STRING(10),
		file_path: DataTypes.STRING(255),
		file_name: DataTypes.STRING(255),
		file_originalname: DataTypes.STRING(255),
		file_ext: DataTypes.STRING(20),
		file_size: DataTypes.BIGINT,
		file_mimetype: DataTypes.STRING(100),
		file_encoding: DataTypes.STRING(100),
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
