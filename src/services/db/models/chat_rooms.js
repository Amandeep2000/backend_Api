"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class chat_rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      chat_rooms.belongsTo(models.users,{
        foreignKey: "astrologer_id",
        as: "astrologer",
      });
    }
  }
  chat_rooms.init(
    {      
      user_id: DataTypes.INTEGER,
      astrologer_id: DataTypes.INTEGER,
      status: DataTypes.ENUM("active","inactive","end"),
    },
    {
      sequelize,
      modelName: "chat_rooms",
    }
  );
  return chat_rooms;
};
