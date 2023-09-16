'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  Company.init({
    symbol: DataTypes.STRING,
    shortName: DataTypes.STRING,
    price: DataTypes.STRING,
    currency: DataTypes.STRING,
    source: DataTypes.STRING,
    stockId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};