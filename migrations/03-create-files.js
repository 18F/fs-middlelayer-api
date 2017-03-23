'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('files', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
			},
			file_type: {
				type: Sequelize.STRING,
				allowNull: false,
				references: {
					model: 'file_types', // Can be both a string representing the table name, or a reference to the model
					key:   'file_type'
				}
			},
			file_name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			file_path: {
				type: Sequelize.STRING
			},
			application_id: {
				allowNull: false,
				references: {
					model: 'applications',
					key: 'id',
					as: 'application_id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade',
				type: Sequelize.UUID
			},
			created: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updated: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: function(queryInterface, Sequelize) {
		return queryInterface.dropTable('files');
	}
};
