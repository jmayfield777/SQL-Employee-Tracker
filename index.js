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
        updateEmployee();
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


// viewAllEmployees function
function viewAllEmployees() {
  // create query string to select all employees and their data from the employee table in the database
  let query =
  `SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        department.name AS department,
        role.salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
        ON employee.role_id = role.id
    LEFT JOIN department
        ON department.id = role.department_id
    LEFT JOIN employee manager
        ON manager.id = employee.manager_id`

    // console.table query results and throw error if there is an issue with the SQL command
    sequelize.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      promptOne();
    });
}

// function for adding an employee
function addEmployee() {
  let query = 
  `SELECT
        role.id,
        role.title,
        role.salary
    FROM role`

   // sequelize query method 
   sequelize.query(query, (err, res) => {
     if (err) throw err;

     // maps over array and creates a new array called role
     const role = res.map(({ id, title, salary}) => ({
        value: id,
        title: `${title}`,
        salary: `${salary}`
     }));

     console.table(res);
     newEmployeeRoles(role);
   });
}

// function to handle the addition of a new employees's role
function newEmployeeRoles() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Employee First Name: '
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Employee Last Name: '
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Employee role: ',
        choices: role
      }
    // uses query method to insert the data received from the inquirer prompt
    ]).then((res) => {
      let query = `INSERT INTO employee SET ?`
      sequelize.query(query, {
        first_name: res.firstName,
        last_name: res.lastName,
        role_id: res.roleId
      }, (err, res) => {
        if (err) throw err;
        // calls promptOne() to restart the initial prompts
        promptOne();
      });
    });
}

// function to update employee roles
function updateEmployee() {
  let query =
  `SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        department.name,
        role.salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    JOIN role
        ON employee.role_id = role.id
    JOIN department 
        ON department.id = role.department_id
    JOIN employee manager
        ON manager.id = employee.manager_id`
    
    
    sequelize.query(query, (err, res) => {
      if (err) throw err;
      const employee = res.map(({ id, first_name, last_name }) => ({
        value: id,
        name: `${first_name} ${last_name}`
      }));
      console.table(res);
      updateRole(employee);
    });
}