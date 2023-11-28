'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Proposals', {
      proposal_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      auction_id: {
        type: Sequelize.UUID
      },
      offered_stock: {
        type: Sequelize.STRING
      },
      offered_quantity: {
        type: Sequelize.INTEGER
      },
      group_id: {
        type: Sequelize.INTEGER
      },
      state: {
        type: Sequelize.STRING,
        defaultValue: 'waiting'
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
    await queryInterface.dropTable('Proposals');
  }
};
