'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class filters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  filters.init({
    category: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'filters',
  });
  return filters;
};