// import dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'staff_db'
    },
    console.log(`Connected to the staff_db database.`)
);


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
        updateRole();
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
        db.end();
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
    db.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      promptOne();
    });
}

// functions to add new employees
function addEmployee() {
  let query = 
  `SELECT
        role.id,
        role.title,
        role.salary
    FROM role`

   // sequelize query method 
   db.query(query, (err, res) => {
     if (err) throw err;

     // maps over array and creates a new array called role
     const role = res.map(({ id, title, salary }) => ({
        value: id,
        title: `${title}`,
        salary: `${salary}`
     }));

     console.table(res);
     newEmployeeRoles(role);
   });
}



function newEmployeeRoles(role) {

    
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
    ]).then((response) => {
      let query = `INSERT INTO employee SET ?`
      db.query(query, {
        first_name: response.firstName,
        last_name: response.lastName,
        role_id: response.roleId
      }, (err, result) => {
        if (err) throw err;
        // calls promptOne() to restart the initial prompts
        promptOne();
      });
    });
}


// update employee role
const updateRole = () => {
    const roleArray= [];
    const employeeArray= [];
    // populates role array with all roles
    db.query(`SELECT * FROM role`, function (err, results) {
      for (let i = 0; i < results.length; i++) {
        roleArray.push(results[i].title);
      }
    // populates employee array with all employees
    db.query(`SELECT * FROM employee`, function (err, results) {
      for (let i = 0; i < results.length; i++) {
        let employeeName = `${results[i].first_name} ${results[i].last_name}`
        employeeArray.push(employeeName);
      }
        return inquirer.prompt([
          {
            type: 'list',
            message: "Which employee do you want to update?",
            name: 'employee',
            choices: employeeArray
          },
          {
            type: 'list',
            message: "What is the employee's new role?",
            name: 'role',
            choices: roleArray
          },
        ]).then((data) => {
          // get role id
          db.query(`SELECT id FROM role WHERE role.title = ?;`, data.role, (err, results) => {
            role_id = results[0].id;
            db.query(`SELECT id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?;`, data.employee.split(" "), (err, results) => {
            db.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [role_id, results[0].id], (err, results) => {
              console.log("\nEmployee role updated. See below:");
              viewAllEmployees();
            });
          });

        });
      });
  });
});
}


// functions to delete employees
function removeEmployee() {
  let query =
  `SELECT
        employee.id,
        employee.first_name,
        employee.last_name
   FROM employee`


   db.query(query, (err, res) => {
    if (err) throw err;
    const employee = res.map(({ id, first_name, last_name }) => ({
        value: id, 
        name: `${id} ${first_name} ${last_name}`
    }));
    console.table(res);
    getDelete(employee);
   });
}


function getDelete(employee) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Employee to be deleted: ',
        choices: employee
      },
      
    ]).then((res) => {
      let query = `DELETE FROM employee WHERE ?`;
      db.query(query, { id: res.employee }, (err, res) => {
        if (err) throw err;
        promptOne();
      });
    });
}


// function to view all roles
function viewAllRoles() {
  let query =
  `SELECT *
  FROM role`


  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptOne();
  });
}


// functions to add role
function addRole() {
  // define empty department array
  let department = [];

  let query =
  `SELECT
        department.id,
        department.name,
        MAX(role.salary) AS max_salary
   FROM employee
   JOIN role
        ON employee.role_id = role.id
   JOIN department
        ON department.id = role.department_id
   GROUP BY department.id, department.name`


   db.query(query, (err, res) => {
    if (err) throw err;
    department = res.map(({ id, name }) => ({
      value: id,
      name: `${id} ${name}`
    }));
    console.table(res);
    addToRole(department);
   });
}


function addToRole(department) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter role title: '
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter role salary: '
      },
      {
        type: 'list',
        name: 'department',
        message: 'Enter the department name: ',
        choices: department
      },

    ]).then((res) => {
      let query =  `INSERT INTO role SET ?`;
      
      db.query(query, {
        title: res.title,
        salary: res.salary,
        department_id: res.department
      }, (err, res) => {
        if (err) throw err;
        promptOne();
      });
    });
}


// function to view all departments
function viewAllDepartments() {
  let query =
  `SELECT *
  FROM department`


  db.query(query, (err, res) => {
    console.table(res);
    promptOne();
  });
}


// function to view all employees by department
function viewAllEmployeesByDepartment() {
    let query =
    `SELECT
          department.id,
          department.name,
          role.salary
     FROM employee
     LEFT JOIN role
          ON employee.role_id = role.id
     LEFT JOIN department
          ON  department.id = role.department_id
     GROUP BY department.id, department.name, role.salary`
  
  
     db.query(query, (err, res) => {
      if (err) throw err;
      const deptOptions = res.map((choices) => ({
          value: choices.id,
          name: choices.name
      }));
      console.table(res);
      getDepartment(deptOptions);
     });
}


function getDepartment(deptOptions) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'department',
        message: 'Enter department: ',
        choices: deptOptions
      },

    ]).then((res) => {
      let query =
      `SELECT
            employee.id,
            employee.first_name,
            employee.last_name,
            role.title,
            department.name
       FROM employee
       JOIN role
            ON employee.role_id = role.id
       JOIN department
            ON department.id = role.department_id
       WHERE department.id = ?`

    
       db.query(query, res.department, (err, res) => {
        if (err) throw err;
        promptOne();
        console.table(res);
       });
    });
}


// function to add new department to db
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter department name: '
      },

    ]).then((res) => {
      let query = `INSERT INTO department SET ?`;

      db.query(query, { name: res.name }, (err, res) => {
        if (err) throw err;
        promptOne(); 
      });
    });
}


promptOne();