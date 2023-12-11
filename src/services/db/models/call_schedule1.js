'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class call_schedule1 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      call_schedule1.belongsTo(models.User,{ 
        foreignKey:'booked_by',
        as:'booker'
     });
    }
  }

  call_schedule1.init
  ({
    user_id: DataTypes.INTEGER,
    booked_by: DataTypes.INTEGER,
    datetime: DataTypes.INTEGER,
    status: DataTypes.ENUM('requested'),
    call_duration: DataTypes.INTEGER,
    call_rating: DataTypes.INTEGER,
    call_comments: DataTypes.TEXT
  },
  {
    sequelize,
    modelName: 'call_schedule1',
  });
  return call_schedule1;
};