'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class call_schedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  call_schedules.init({
    user_id: DataTypes.INTEGER,
    booked_by: DataTypes.INTEGER,
    datetime: DataTypes.INTEGER,
    status: DataTypes.ENUM('value','value1'),
    call_duration: DataTypes.INTEGER,
    call_rating: DataTypes.INTEGER,
    call_comments: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'call_schedules',
  });
  return call_schedules;
};