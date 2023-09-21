'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      UserId:{
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'}
      },
      CompanyId:{
        type: Sequelize.INTEGER,
        references: {
          model: 'Companies',
          key: 'id'}
      },
      Quantity: {
        type: Sequelize.INTEGER
      },
      Price: {
        type: Sequelize.FLOAT
      },
      Currency: {
        type: Sequelize.STRING
      },
      TotalAmount: {
        type: Sequelize.FLOAT
      },
      Date: {
        type: Sequelize.STRING
      },
      Completed: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Transactions');
  }
};