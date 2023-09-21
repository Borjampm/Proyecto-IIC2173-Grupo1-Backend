'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Purchases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Purchases');
  }
};