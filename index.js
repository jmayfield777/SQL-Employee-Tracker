// import dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const sequelize = require('./config/connection.js');
require('console.table');

// connect to staff_db
sequelize.connect(function (err) {
  if (err) throw err;

  // if no error run inquirer promptOne
  promptOne();
  console.log('You are now connected to the database');
});