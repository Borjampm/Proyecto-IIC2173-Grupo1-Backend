'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Transaction);
    }
  }
  User.init({
    Username: DataTypes.STRING,
    Password: DataTypes.STRING,
    Mail: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {msg: "Mail must be a valid email"}
      } 
    },
    Wallet: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};