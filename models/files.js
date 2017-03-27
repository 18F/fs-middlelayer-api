'use strict';
module.exports = function(sequelize, DataTypes) {
	const files = sequelize.define('files', {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		file_type: DataTypes.STRING, //eslint-disable-line camelcase
		file_name: DataTypes.STRING, //eslint-disable-line camelcase
		file_path: DataTypes.STRING, //eslint-disable-line camelcase
		application_id: DataTypes.INTEGER, //eslint-disable-line camelcase
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
