'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Auctions', {
      auction_id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      stock_id: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      group_id: {
        type: Sequelize.INTEGER
      },
      state: {
        type: Sequelize.STRING,
        defaultValue: 'waiting'
      },
      type: {
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
    await queryInterface.dropTable('Auctions');
  }
};
