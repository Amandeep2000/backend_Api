'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('transactions', 'order_id', {
      type: Sequelize.STRING,
      allowNull: false // Set to true or false based on your requirements
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('transactions','order_id', {
      type: Sequelize.INTEGER,
      allowNull: false // Set to true or false based on your requirements
    });
  }
};
