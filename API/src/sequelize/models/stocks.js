'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.CompanyStocks, {
        foreignKey: 'id',
      });
    }
  }
  Stocks.init({
    stocksId: DataTypes.STRING,
    datetime: DataTypes.STRING,
    price: DataTypes.FLOAT,
    currency: DataTypes.STRING,
    source: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Stocks',
  });
  return Stocks;
};
