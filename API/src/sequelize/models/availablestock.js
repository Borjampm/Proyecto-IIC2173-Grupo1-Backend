'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AvailableStock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AvailableStock.init({
    stock_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    amount: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'AvailableStock',
  });
  return AvailableStock;
};
