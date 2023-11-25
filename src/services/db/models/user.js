'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {   
      // define association here
      User.hasOne(models.astrologer_meta, {
        foreignKey: 'user_id',
        as: 'AstrologerMeta',
      });

      User.belongsToMany(models.ExpertiseList,
        {
          through: models.AstrologerExpertise,
          foreignKey: 'user_id',
          otherKey: 'expertise_id',
          as: 'astrologerexpertise'
        })
    }

    // hidden fields
    toJSON() {
      const attributes = { ...this.get() };
      delete attributes.otp;
      return attributes;
    }

  }
  User.init({
    FullName: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile_number: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    otp: DataTypes.STRING,
    status: DataTypes.ENUM('active', 'inactive', 'suspended'),
    social_identifier: DataTypes.STRING,
    user_type: DataTypes.ENUM('user', 'astrologer', 'admin'),
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};

