'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {foreignKey: 'UserId'});
      this.belongsTo(models.Company, {foreignKey: 'CompanyId'});
    }
  }
  Transaction.init({
    UserId: DataTypes.INTEGER,
    CompanyId: DataTypes.INTEGER,
    Quantity: DataTypes.INTEGER,
    Price: DataTypes.FLOAT,
    Currency: DataTypes.STRING,
    TotalAmount: DataTypes.FLOAT,
    Date: DataTypes.STRING,
    Completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};