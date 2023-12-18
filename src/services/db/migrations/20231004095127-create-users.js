'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports={
  async up(queryInterface, Sequelize){
    await queryInterface.createTable('users',{
      id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      FullName:
      {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      mobile_number: {
        type: Sequelize.STRING,
        unique: true
      },
      is_verified: {
        type: Sequelize.BOOLEAN
      },
      otp: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('active','inactive','suspended')
      },
      social_identifier:{
        type: Sequelize.STRING
      },
      user_type: {
        type: Sequelize.ENUM('user','astrologer','admin')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  
  async down(queryInterface,Sequelize) {
    await queryInterface.dropTable('users');
  }
};


// i have create otp file for this user migration