'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExpertiseList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ExpertiseList.init({
    title: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ExpertiseList',
  });
  return ExpertiseList;
};