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
    await queryInterface.changeColumn('astrologer_meta', 'profile_pic', {
      type: Sequelize.TEXT,
      // include other options here if necessary, like allowNull
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('astrologer_meta', 'profile_pic', {
      type: Sequelize.STRING,
      // make sure to match the original STRING length if there was one
    });
  }
};
