
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
      this.hasMany(models.CompanyStock, {
        foreignKey: 'id',
      });
      this.hasMany(models.Transaction, {
        foreignKey: 'id',
      });
      this.hasMany(models.FractionStock, {
        foreignKey: 'id',
      });
    }
  }
  Company.init({
    shortName: DataTypes.STRING,
    symbol: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};