"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("call_schedule", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      booked_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      datetime: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM("requested", "scheduled", "declined", "completed"),
      },
      call_duration: {
        type: Sequelize.INTEGER,
      },
      call_rating: {
        type: Sequelize.INTEGER,
      },
      call_comments: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("call_schedule");
  },
};
