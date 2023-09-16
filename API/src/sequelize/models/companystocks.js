'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompanyStocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Company, {
        foreignKey: 'id',
      });
      this.belongsTo(models.Stocks, {
        foreignKey: 'id',
      });
    }
  }
  CompanyStocks.init({
    companyId: DataTypes.INTEGER,
    stockId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CompanyStocks',
  });
  return CompanyStocks;
};
