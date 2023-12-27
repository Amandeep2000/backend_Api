"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasOne(models.astrologer_meta, {
        foreignKey: "user_id",
        as: "AstrologerMeta",
      });

      users.belongsToMany(models.expertise, {
        through: models.astrologer_expertises,
        foreignKey:"user_id",
        otherKey:"expertise_id",
        as: "astrologerexpertise",
      });


    }
     
    // hidden fields
    toJSON() {
      const attributes = { ...this.get() };
      delete attributes.otp;
      return attributes;
    }
  }
  users.init(
    {
      FullName: DataTypes.STRING,
      email: DataTypes.STRING,
      mobile_number: DataTypes.STRING,
      is_verified: DataTypes.BOOLEAN,
      otp: DataTypes.STRING,
      status: DataTypes.ENUM("active", "inactive", "suspended"),
      social_identifier: DataTypes.STRING,
      user_type: DataTypes.ENUM("user", "astrologer", "admin"),
    },
    {
      sequelize,
      modelName: "users",
      tableName: "users",
    }
  );
  return users;
};
