'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class call_histories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  call_histories.init({
    url: DataTypes.STRING,
    to: DataTypes.STRING,
    from: DataTypes.STRING
  },{
    sequelize,
    modelName:'call_histories',
  });
  return call_histories;
};



