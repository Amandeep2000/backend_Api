"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class call_schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      call_schedule.belongsTo(models.users, {
        foreignKey: "booked_by",
        as: "booker",
      });

      call_schedule.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "astrologer",
      });

      call_schedule.belongsTo(models.astrologer_availabilities, {
        foreignKey: "datetime",
        as: "astrologer_availabilities",
      });
 
    }
  }

  call_schedule.init(
    {
      user_id: DataTypes.INTEGER,
      booked_by: DataTypes.INTEGER,
      datetime: DataTypes.INTEGER,
      status: DataTypes.ENUM("requested", "scheduled", "declined", "completed"),
      type: DataTypes.STRING,
      call_duration: DataTypes.INTEGER,
      call_rating: DataTypes.INTEGER,
      call_comments: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "call_schedule",
      tableName: "call_schedule",
    }
  );
  return call_schedule;
};
