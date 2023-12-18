'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class astrologer_availabilities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  astrologer_availabilities.init({
    date: DataTypes.DATE,
    time: DataTypes.TIME,
    userid: DataTypes.INTEGER,
    is_block: DataTypes.BOOLEAN
  },{
    sequelize,
    modelName: 'astrologer_availabilities',
  });
  return astrologer_availabilities;
};