'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class filter_categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  filter_categories.init({
    filter_category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'filter_categories',
  });
  return filter_categories;
};