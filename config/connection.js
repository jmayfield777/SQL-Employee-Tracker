// import dependencies
const Sequelize = require('sequelize');
require('dotenv').config();

// create new instance of sequelize to connect to .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3001
  }
);

module.exports = sequelize;