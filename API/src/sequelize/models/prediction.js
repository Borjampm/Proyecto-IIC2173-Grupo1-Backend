'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prediction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Prediction.init({
    user_id: DataTypes.STRING,
    job_id: DataTypes.STRING,
    state: DataTypes.STRING,
    value: DataTypes.STRING,
    days_back: DataTypes.INTEGER,
    symbol: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    datetime: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Prediction',
  });
  return Prediction;
};