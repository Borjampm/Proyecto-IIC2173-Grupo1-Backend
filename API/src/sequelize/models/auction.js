'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Auction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Auction.init({
    auction_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    proposal_id: DataTypes.UUID,
    stock_id: DataTypes.UUID,
    quantity: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Auction',
  });
  return Auction;
};
