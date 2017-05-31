'use strict';
module.exports = function(sequelize, DataTypes) {
	const applications = sequelize.define('applications', {
		id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
		controlNumber: { type: DataTypes.STRING(50), field: 'control_number' },
		formName: { type: DataTypes.STRING(100), field: 'form_name' },
		region: { type: DataTypes.STRING(2), field: 'region' },
		forest: { type: DataTypes.STRING(2), field: 'forest' },
		district: { type: DataTypes.STRING(2), field: 'district' },
		website: { type: DataTypes.STRING(255), field: 'website' },
		activityDescription: { type: DataTypes.STRING(255), field: 'activity_description' },
		locationDescription: { type: DataTypes.STRING(255), field: 'location_description' },
		startDatetime: { type: DataTypes.DATE, field: 'start_datetime' },
		endDatetime: { type: DataTypes.DATE, field: 'end_datetime' },
		numberParticipants: { type: DataTypes.INTEGER, field: 'number_participants' },
		individualIsCitizen: { type: DataTypes.BOOLEAN, field: 'individual_is_citizen' },
		smallBusiness: { type: DataTypes.BOOLEAN, field: 'small_business' },
		advertisingURL: { type: DataTypes.STRING(255), field: 'advertising_url' },
		advertisingDescription: { type: DataTypes.STRING(255), field: 'advertising_description' },
		clientCharges: { type: DataTypes.STRING(255), field: 'client_charges' },
		experienceList: { type: DataTypes.STRING(255), field: 'experience_list' },
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created' },
		updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated' },
		numberSpectators: { type: DataTypes.INTEGER, field: 'number_spectators' }
	}, {
		timestamps  : true
	}, {
		classMethods: {
			associate: function(models) {
				applications.hasMany(models.files, {
					foreignKey: 'application_id',
					as: 'files'
				});
			}
		}
	});
	return applications;
};
