'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Astrologer_Availability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Astrologer_Availability.init({
    date: DataTypes.DATE,
    time: DataTypes.TIME,
    userid: DataTypes.INTEGER,
    is_block: DataTypes.BOOLEAN
  },{
    sequelize,
    modelName: 'Astrologer_Availability',
  });
  return Astrologer_Availability;
};