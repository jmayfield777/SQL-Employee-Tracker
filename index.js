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


// inquirer promptOne function
function promptOne() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'userChoice',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'Add Employee',
        'Update Employee Role',
        'Remove Employee',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'View Employees By Department',
        'Add Department',
        'Quit'
      ]
    }
  ]).then((res) => {
    console.log(res.userChoice);
    switch (res.userChoice) {
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'Remove Employee':
        removeEmployee();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'View Employees By Department':
        viewAllEmployeesByDepartment();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Quit':
        sequelize.end();
        break;
    }
  }).catch((err) => {
    if (err) throw err;
  });
}