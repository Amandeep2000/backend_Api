const { Sequelize } = require('sequelize');

// Option 1: Passing a connection URI
// const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres



// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('Asthasamey', 'postgres', '12345', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});


async function testconnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:',error);
  }
}

testconnection();
module.exports = sequelize;