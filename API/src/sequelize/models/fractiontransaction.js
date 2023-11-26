'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FractionTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.FractionStock, {
        foreignKey: 'fraction_stock_id',
      });
      this.belongsTo(models.User, {
        foreignKey: 'client_username',
      });
      this.belongsTo(models.Transaction, {
        foreignKey: 'sale_transaction_id',
      });
    }
  }
  FractionTransaction.init({
    fraction_stock_id: DataTypes.INTEGER,
    client_username: DataTypes.STRING,
    sale_transaction_id: DataTypes.UUID,
    fractions_selected: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'FractionTransaction',
  });
  return FractionTransaction;
};