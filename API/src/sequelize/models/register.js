'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Register extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Register.init({
    request_id: DataTypes.STRING,
    group_id: DataTypes.INTEGER,
    symbol: DataTypes.STRING,
    datetime: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    valid: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Register',
  });
  return Register;
};