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
const enumName="enum_astrologer_meta_charge_type";
const tableName="astrologer_meta";
const columnName="Charges"


await queryInterface.sequelize.transaction(async(transaction)=>{
await queryInterface.sequelize.query(`ALTER TYPE ${enumName} ADD VALUE 'hourly'`, { transaction });
await queryInterface.sequelize.query(`ALTER TYPE ${enumName} ADD VALUE 'per_minute'`, { transaction });

})

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
