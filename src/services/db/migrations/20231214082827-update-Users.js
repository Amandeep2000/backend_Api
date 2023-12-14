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
    await queryInterface.renameTable('Users', 'users');
    await queryInterface.renameTable('Admins', 'admins'); 
    await queryInterface.renameTable('AstrologerExpertises', 'astrologer_expertises');
    await queryInterface.renameTable('Astrologer_Availabilities', 'astrologer_availabilities');  
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameTable('users', 'Users');
    await queryInterface.renameTable('admins', 'Admins'); 
    await queryInterface.renameTable('astrologer_expertises', 'AstrologerExpertises');
    await queryInterface.renameTable('astrologer_availabilities','Astrologer_Availabilities'); 

  }
};
