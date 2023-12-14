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

    const enumName = "enum_call_schedule1s_status";
    const tableName = "call_schedule1s";
    const columnName = "status";

    // Add new values 'schedule' and 'decline' to the ENUM type
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(`ALTER TYPE ${enumName} ADD VALUE 'scheduled';`, { transaction });
      await queryInterface.sequelize.query(`ALTER TYPE ${enumName} ADD VALUE 'declined';`, { transaction });
      await queryInterface.sequelize.query(`ALTER TYPE ${enumName} ADD VALUE 'completed';`, { transaction });
  
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
