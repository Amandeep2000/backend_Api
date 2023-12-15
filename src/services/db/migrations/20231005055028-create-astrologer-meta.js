'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('astrologer_meta', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references:{
          model:'users',
          key:'id'
        }
      },
      profile_pic: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('active','inactive','suspended')
      },
      description: {
        type: Sequelize.TEXT
      },
      is_profile_verified: {
        type: Sequelize.BOOLEAN
      },
      languages: {
        type: Sequelize.JSON
      },
      experience: {
        type: Sequelize.STRING
      },
      Charges: {
        type: Sequelize.INTEGER
      },
      charge_type:{
        type: Sequelize.ENUM('hourly','per_minute')
      },
      referral_code:{
        type: Sequelize.STRING
      },
      is_recommended:{
        type: Sequelize.BOOLEAN
      },
      createdAt:{
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt:{
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('astrologer_meta');
  }
};