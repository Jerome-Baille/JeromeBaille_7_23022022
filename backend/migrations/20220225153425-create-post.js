'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        allowNull: true,
        type: Sequelize.STRING
      },
      content: {
        allowNull: true,
        type: Sequelize.STRING
      },
      attachment: {
        allowNull: true,
        type: Sequelize.STRING
      },
      thumbnail: {
        allowNull: true,
        type: Sequelize.STRING
      },
      isActive: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        default: true,
      },
      isSignaled: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        default: false,
      },
      points: {
        allowNull: false,
        type: Sequelize.INTEGER,
        default: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};