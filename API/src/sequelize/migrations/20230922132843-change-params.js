'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'Username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'Username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false, // You can revert the uniqueness in the down migration if needed
    });
  },
};

