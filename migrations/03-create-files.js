'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('files', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
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
			file_type: {
				type: Sequelize.STRING(10),
				allowNull: false,
				references: {
					model: 'file_types',
					key:   'file_type'
				}
			},
			file_path: {
				type: Sequelize.STRING(255),
				allowNull: false
			},
			file_name: {
				type: Sequelize.STRING(255)
			},
			file_originalname: {
				type: Sequelize.STRING(255)
			},
			file_ext: {
				type: Sequelize.STRING(20)
			},
			file_size: {
				type: Sequelize.BIGINT
			},
			file_mimetype: {
				type: Sequelize.STRING(100)
			},
			file_encoding: {
				type: Sequelize.STRING(100)
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
