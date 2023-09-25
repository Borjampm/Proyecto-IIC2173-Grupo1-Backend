
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
      Username: {
        type: Sequelize.STRING
      },
      CompanyId: {
        type: Sequelize.INTEGER
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
      ipAdress: {
        type: Sequelize.STRING
      },
      UserId: {
        type: Sequelize.INTEGER
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
