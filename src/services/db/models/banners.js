'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class banners extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  banners.init({
    banner: DataTypes.STRING,
    screen: DataTypes.STRING,
    valid_till: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'banners',
  });
  return banners;
};