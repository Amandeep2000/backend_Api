'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class astrologer_meta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models)
     {
  //define association here
  // astrologer_meta.belongsToMany(models.ExpertiseList,
  //   {
  //   through:models.AstrologerExpertise,
  //   foreignKey:'user_id',
  //   otherKey:'expertise_id',
  //   as:'astrologerexpertise'
  // })

    }
  }
  astrologer_meta.init({
    user_id: DataTypes.INTEGER,
    profile_pic: DataTypes.STRING,
    status: DataTypes.ENUM('active','inactive','suspended'),
    description: DataTypes.TEXT,
    is_profile_verified: DataTypes.BOOLEAN,
    languages: DataTypes.JSON,
    experience: DataTypes.STRING,
    Charges: DataTypes.INTEGER,
    charge_type: DataTypes.ENUM('hourly','per_minute'),
    referral_code: DataTypes.STRING,
    is_recommended: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'astrologer_meta',
  });
  return astrologer_meta;
};