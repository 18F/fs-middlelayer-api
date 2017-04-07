'use strict';
module.exports = function(sequelize, DataTypes) {
	const applications = sequelize.define('applications', {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		control_number: DataTypes.STRING(50),
		form_name: DataTypes.STRING(100),
		region: DataTypes.STRING(2),
		forest: DataTypes.STRING(2),
		district: DataTypes.STRING(2),
		website: DataTypes.STRING(255),
		activity_description: DataTypes.STRING(255),
		location_description: DataTypes.STRING(255),
		start_datetime: DataTypes.DATE,
		end_datetime: DataTypes.DATE,
		number_participants: DataTypes.INTEGER,
		individual_is_citizen: DataTypes.BOOLEAN,
		small_business: DataTypes.BOOLEAN,
		advertising_url: DataTypes.STRING(255),
		advertising_description: DataTypes.STRING(255),
		client_charges: DataTypes.STRING(255),
		experience_list: DataTypes.STRING(255),
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created' },
		updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated' }
	}, {
		timestamps  : true
	}, {
		classMethods: {
			associate: function(models) {
				applications.hasMany(models.files, {
					foreignKey: 'application_id',
					as: 'file_items'
				});
			}
		}
	});
	return applications;
};
