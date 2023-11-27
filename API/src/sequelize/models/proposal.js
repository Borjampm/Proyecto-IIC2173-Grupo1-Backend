'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Proposal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Proposal.init({
    proposal_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    auction_id: DataTypes.UUID,
    offered_stock: DataTypes.UUID,
    offered_quantity: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER,
    state: {
      type: DataTypes.STRING,
      defaultValue: 'waiting'
    }
  }, {
    sequelize,
    modelName: 'Proposal',
  });
  return Proposal;
};
