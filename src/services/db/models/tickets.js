'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tickets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tickets.init({
    report_type: DataTypes.STRING,
    summary: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.ENUM('active','inactive','suspended'),
    assign_to: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tickets',
  });
  return tickets;
};