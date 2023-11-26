'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FractionStock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Transaction, {
        foreignKey: 'source_transaction_id',
      });
      this.belongsTo(models.Company, {
        foreignKey: 'company_id',
      });
      this.hasMany(models.FractionTransaction, {
        foreignKey: 'id',
      });
    }
  }
  FractionStock.init({
    source_transaction_id: DataTypes.UUID,
    company_id: DataTypes.INTEGER,
    avalible: DataTypes.FLOAT,
    bought: DataTypes.FLOAT,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'FractionStock',
  });
  return FractionStock;
};