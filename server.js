// Dependencies
const chalk = require('chalk');
const inquirer = require("inquirer");
const mysql = require('mysql2');
const ctable = require('console.table');
const { renderImage } = require("./renderImage");
require("dotenv").config()

// MySQL DB Connection Information (--> change this with your specific credentials)
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});
connection.connect(err => {
  if (err) throw err;
  startApp();
});

//-----start the Employee Tracker
function startApp() {
  console.clear()
  renderImage()
  menuPrompt();
}

//initial prompt - which type of query?
function menuPrompt() {
  const exitPrompt = chalk.redBright("Exit Program");
  inquirer
    .prompt({
      type: "list",
      name: "promptChoice",
      message: "Make a selection:",
      choices: ["View All Employees", "View All Employees by Manager", "View Roles", "View Departments", "Add Employee", "Add Role", "Add Department", "Update Employee Role", "Update Employee Manager", "Remove Employee", "View Total Used Budget By Department", exitPrompt]
    })
    .then(answer => {
      switch (answer.promptChoice) {
        case "View All Employees":
          queryEmployeesAll();
          break;
       
        case "View All Employees by Manager":
          queryManagers();
          break;

        case "View Roles":
          queryRolesOnly();
          break;

        case "View Departments":
          queryDepartmentsOnly();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Update Employee Manager":
          updateEmployeeManager();
          break;

        case "View Total Used Budget By Department":
          viewTotalBudgetByDepartment();
          break;

        case exitPrompt:
          connection.end();
       //   return;
          break;

      }
    });
}

//manager prompt
function promptManagers(managers) {
  inquirer
    .prompt({
      type: "list",
      name: "promptChoice",
      message: "Select Manager:",
      choices: managers
    })
    .then(answer => {
      queryEmployeesByManager(answer.promptChoice);
    });
}

//query all employees
function queryEmployeesAll() {
  const query = `
  SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name, concat(manager.first_name, " ", manager.last_name) AS manager_full_name
  FROM employee 
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON department.id = role.department_id
  LEFT JOIN employee as manager ON employee.manager_id = manager.id;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    renderScreen("Display all Employees", res);
    menuPrompt();
  });
}

// Query the departments without employees
function queryDepartmentsOnly() {
  const query = `SELECT id, department.name FROM department;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    // Show the departments
    renderScreen(`All Departments`, res);
    menuPrompt();
  });
}

// Query the Roles only and display them for viewing
function queryRolesOnly() {
  const query = `SELECT id, title FROM role;`;
  //build table data array from query result
  connection.query(query, (err, res) => {
    if (err) throw err;
    renderScreen("All Roles", res);
    menuPrompt();
  });
}
//query all managers
function queryManagers() {
  const query = `
  SELECT DISTINCT concat(manager.first_name, " ", manager.last_name) AS full_name
  FROM employee
  LEFT JOIN employee AS manager ON manager.id = employee.manager_id
  WHERE manager.id IS NOT NULL;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    //extract manager names to array
    const managers = [];
    for (let i = 0; i < res.length; i++) {
      managers.push(res[i].full_name);
    }
    //prompt for manager selection
    promptManagers(managers);
  });
}

//query employees by manager
function queryEmployeesByManager(manager) {
  //sql query
  const query = `
  SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name, concat(manager.first_name, " ", manager.last_name) AS manager_full_name 
  FROM employee 
  INNER JOIN role ON employee.role_id = role.id
  INNER JOIN employee AS manager ON employee.manager_id = manager.id
  INNER JOIN department ON department.id = role.department_id
  WHERE manager.id IS NOT NULL AND concat(manager.first_name, " ", manager.last_name) = "${manager}";`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    //build table data array from query result
    const tableData = [];
    for (let i = 0; i < res.length; i++) {
      tableData.push({
        "ID": res[i].id,
        "First Name": res[i].first_name,
        "Last Name": res[i].last_name,
        "Role": res[i].title,
        "Salary": res[i].salary,
        "Department": res[i].department_name
      });
    }
    //render screen
    renderScreen(`Employees managed by ${manager}`, tableData);
    menuPrompt();
  });
}

//add employee
function addEmployee() {
  //initialize newEmployee object
  const newEmployee = {
    firstName: "",
    lastName: "",
    roleID: 0,
    managerID: 0
  };
  //new employee name prompt
  inquirer
    .prompt([{
      name: "firstName",
      message: "Enter first name: ",
      validate: async (input) => {
        if (!input.match(/^[A-Z][A-Z ]{0,}/i)) { //test
          return "Sorry, the employee's first name must contain at least 1 character and must only contain letters and spaces!".yellow;
        }
        return true;
      }
    }, {
      name: "lastName",
      message: "Enter last name: ",
      validate: async (input) => {
        if (!input.match(/^[A-Z][A-Z ]{0,}/i)) { //test
          return "Sorry, the employee's last name must contain at least 1 character and must only contain letters and spaces!".yellow;
        }
        return true;
      }
    }])
    .then(answers => {
      //set newEmployee name
      newEmployee.firstName = answers.firstName;
      newEmployee.lastName = answers.lastName;
      //sql query for roles
      const query = `SELECT role.title, role.id FROM role;`;
      connection.query(query, (err, res) => {
        if (err) throw err;
        //extract role names and ids to arrays
        const roles = [];
        const rolesNames = [];
        for (let i = 0; i < res.length; i++) {
          roles.push({
            id: res[i].id,
            title: res[i].title
          });
          rolesNames.push(res[i].title);
        }
        //prompt for role selection
        inquirer
          .prompt({
            type: "list",
            name: "rolePromptChoice",
            message: "Select Role:",
            choices: rolesNames
          })
          .then(answer => {
            //get id of chosen role
            const chosenRole = answer.rolePromptChoice;
            let chosenRoleID;
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].title === chosenRole) {
                chosenRoleID = roles[i].id;
              }
            }
            //set newEmployee role ID 
            newEmployee.roleID = chosenRoleID;
            //sql query for managers
            const query = `
                  SELECT DISTINCT concat(manager.first_name, " ", manager.last_name) AS full_name, manager.id
                  FROM employee
                  LEFT JOIN employee AS manager ON manager.id = employee.manager_id
                  WHERE manager.id IS NOT NULL;`;
            connection.query(query, (err, res) => {
              if (err) throw err;
              //extract manager names and ids to arrays
              const managers = [];
              const managersNames = [];
              for (let i = 0; i < res.length; i++) {
                managersNames.push(res[i].full_name);
                managers.push({
                  id: res[i].id,
                  fullName: res[i].full_name
                });
              }
              // Allow for an employee with no manager.
              managers.push({id: null, fullName: "None"});
              managersNames.push("None");
              //prompt for manager selection
              inquirer
                .prompt({
                  type: "list",
                  name: "managerPromptChoice",
                  message: "Select Manager:",
                  choices: managersNames
                })
                .then(answer => {
                  //get id of chosen manager
                  const chosenManager = answer.managerPromptChoice;
                  let chosenManagerID;
                  for (let i = 0; i < managers.length; i++) {
                    if (managers[i].fullName === chosenManager) {
                      chosenManagerID = managers[i].id;
                      break;
                    }
                  }
                  //set newEmployee manager ID
                  newEmployee.managerID = chosenManagerID;
                  //add employee insert sql query
                  const query = "INSERT INTO employee SET ?";
                  connection.query(query, {
                    first_name: newEmployee.firstName,
                    last_name: newEmployee.lastName,
                    role_id: newEmployee.roleID || 0,
                    manager_id: newEmployee.managerID || 0
                  }, (err, res) => {
                    if (err) throw err;
                    //show updated employee table
                    setTimeout(queryEmployeesAll, 500);
                  });
                });
            });
          });
      });
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "dName",
        type: "input",
        message: "Enter new Department title:",
        validate: async function confirmStringInput(input) {
          if (input.trim() != "" && input.trim().length <= 50) {
            return true;
          }
          return "Invalid input. Please limit your input to 50 characters or less.";
        },
      },
    ])
    .then((answer) => {
      const query = `INSERT INTO department (name) VALUES (?);`;
      connection.query(query, [answer.dName], (err, res) => {
        if (err) throw err;
        queryDepartmentsOnly();
      })
    });
}

function addRole() {
  //initialize 
  const departments = [];
  const departmentsName = [];
  //sql query
  const query = `SELECT id, name FROM department`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      departments.push({
        id: res[i].id,
        name: res[i].name
      });
      departmentsName.push(res[i].name);
    }
    inquirer
      .prompt([
        {
          name: "rName",
          type: "input",
          message: "Enter new role title:",
          validate: async function confirmStringInput(input) {
            if (input.trim() != "" && input.trim().length <= 50) {
              return true;
            }
            return "Invalid input. Please limit your input to 50 characters or less.";
          },
        },
        {
          name: "salNum",
          type: "input",
          message: "Enter role salary:",
          validate: (input) => {
            if (!input.match(/^[0-9]+$/)) {
              return "Please enter a number".yellow;
            }
            return true;
          }
        },
        {
          type: "list",
          name: "roleDept",
          message: "Select department:",
          choices: departmentsName
        },
      ])
      .then((answer) => {
        let deptID = departments.find((obj) => obj.name === answer.roleDept).id;
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
          [answer.rName, answer.salNum, deptID], (err, res) => {
            if (err) throw err;
            queryRolesOnly();
          });
      });
  });
}

// Remove an employee from the database
function removeEmployee() {
  const query = `
  SELECT id, concat(employee.first_name, " ", employee.last_name) AS employee_full_name
  FROM employee ;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    //extract employee names and ids
    let employees = [];
    let employeesNames = [];
    for (let i = 0; i < res.length; i++) {
      employees.push({
        id: res[i].id,
        fullName: res[i].employee_full_name
      });
      employeesNames.push(res[i].employee_full_name);
    }
    //prompt for employee to remove
    inquirer
      .prompt({
        type: "list",
        name: "employeePromptChoice",
        message: "Select employee to delete:",
        choices: employeesNames
      })
      .then(answer => {
        //get id of chosen employee
        const chosenEmployee = answer.employeePromptChoice;
        let chosenEmployeeID;
        for (let i = 0; i < employees.length; i++) {
          if (employees[i].fullName === chosenEmployee) {
            chosenEmployeeID = employees[i].id;
            break;
          }
        }
        const query = "DELETE FROM employee WHERE ?";
        connection.query(query, { id: chosenEmployeeID }, (err, res) => {
          if (err) throw err;
          //show updated employee table
          setTimeout(queryEmployeesAll, 500);
        });
      });
  });
}

function updateEmployeeRole() {
  //initialize updatedEmployee object
  const updatedEmployee = {
    id: 0,
    roleID: 0,
  };
  const query = `
  SELECT id, concat(employee.first_name, " ", employee.last_name) AS employee_full_name
  FROM employee ;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    //extract employee names and ids to [arrays]
    let employees = [];
    let employeesNames = [];
    for (let i = 0; i < res.length; i++) {
      employees.push({
        id: res[i].id,
        fullName: res[i].employee_full_name
      });
      employeesNames.push(res[i].employee_full_name);
    }
    //prompt for employee to update
    inquirer
      .prompt({
        type: "list",
        name: "employeePromptChoice",
        message: "Select employee to update:",
        choices: employeesNames
      })
      .then(answer => {
        //get id of chosen employee
        const chosenEmployee = answer.employeePromptChoice;
        let chosenEmployeeID;
        for (let i = 0; i < employees.length; i++) {
          if (employees[i].fullName === chosenEmployee) {
            chosenEmployeeID = employees[i].id;
            break;
          }
        }
        //set updatedEmployee id
        updatedEmployee.id = chosenEmployeeID;
        //sql query for roles
        const query = `SELECT role.title, role.id FROM role;`;
        connection.query(query, (err, res) => {
          if (err) throw err;
          //extract role names and ids to [arrays]
          const roles = [];
          const rolesNames = [];
          for (let i = 0; i < res.length; i++) {
            roles.push({
              id: res[i].id,
              title: res[i].title
            });
            rolesNames.push(res[i].title);
          }
          //prompt for role selection
          inquirer
            .prompt({
              type: "list",
              name: "rolePromptChoice",
              message: "Select Role:",
              choices: rolesNames
            })
            .then(answer => {
              //get id of the chosen role
              const chosenRole = answer.rolePromptChoice;
              let chosenRoleID;
              for (let i = 0; i < roles.length; i++) {
                if (roles[i].title === chosenRole) {
                  chosenRoleID = roles[i].id;
                }
              }
              //set updatedEmployee role ID 
              updatedEmployee.roleID = chosenRoleID;
              //sql query to update role
              const query = `UPDATE employee SET ? WHERE ?`;
              connection.query(query, [
                {
                  role_id: updatedEmployee.roleID
                },
                {
                  id: updatedEmployee.id
                }
              ], (err, res) => {
                if (err) throw err;
                //show updated employee table
                setTimeout(queryEmployeesAll, 500);
              });
            });
        });
      });
  });
}

function updateEmployeeManager() {
  //initialize updatedEmployee object
  const updatedEmployee = {
    id: 0,
    managerID: 0
  };
  //sql query for Employees
  const query = `
  SELECT id, concat(employee.first_name, " ", employee.last_name) AS employee_full_name
  FROM employee ;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    //extract employee names and ids to [arrays]
    let employees = [];
    let employeesNames = [];
    for (let i = 0; i < res.length; i++) {
      employees.push({
        id: res[i].id,
        fullName: res[i].employee_full_name
      });
      employeesNames.push(res[i].employee_full_name);
    }
    //prompt for employee to update
    inquirer
      .prompt({
        type: "list",
        name: "employeePromptChoice",
        message: "Select employee to update:",
        choices: employeesNames
      })
      .then(answer => {
        //get id of chosen employee
        const chosenEmployee = answer.employeePromptChoice;
        let chosenEmployeeID;
        for (let i = 0; i < employees.length; i++) {
          if (employees[i].fullName === chosenEmployee) {
            chosenEmployeeID = employees[i].id;
            break;
          }
        }
        //set updatedEmployee id
        updatedEmployee.id = chosenEmployeeID;
        const query = `
          SELECT DISTINCT concat(manager.first_name, " ", manager.last_name) AS full_name, manager.id
          FROM employee
          LEFT JOIN employee AS manager ON manager.id = employee.manager_id
          WHERE manager.id IS NOT NULL;`;
        connection.query(query, (err, res) => {
          if (err) throw err;
          //extract manager names and ids to [arrays]
          const managers = [];
          const managersNames = [];
          for (let i = 0; i < res.length; i++) {
            managersNames.push(res[i].full_name);
            managers.push({
              id: res[i].id,
              fullName: res[i].full_name
            });
          }
          //prompt for manager selection
          inquirer
            .prompt({
              type: "list",
              name: "managerPromptChoice",
              message: "Select Manager:",
              choices: managersNames
            })
            .then(answer => {
              //get id of chosen manager
              const chosenManager = answer.managerPromptChoice;
              let chosenManagerID;
              for (let i = 0; i < managers.length; i++) {
                if (managers[i].fullName === chosenManager) {
                  chosenManagerID = managers[i].id;
                  break;
                }
              }
              //set newEmployee manager ID
              updatedEmployee.managerID = chosenManagerID;
              //sql query to update manager
              const query = `UPDATE employee SET ? WHERE ?`;
              connection.query(query, [
                {
                  manager_id: updatedEmployee.managerID
                },
                {
                  id: updatedEmployee.id
                }
              ], (err, res) => {
                if (err) throw err;
                //show updated employee table
                setTimeout(queryEmployeesAll, 500);
              });
            });
        });
      });
  });
}

function viewTotalBudgetByDepartment() {
  const query = `select d.name "Department", SUM(r.salary) "BudgetUsed" 
  from role r
  JOIN department d 
  JOIN employee e 
  where r.id = e.role_id and r.id = d.id group by r.id;`;
  connection.query(query, (err, res) => {
    if (err)
      throw err;
    //build table data array from query result
    const tableData = [];
    for (let i = 0; i < res.length; i++) {
      tableData.push({
        "Department": res[i].Department,
        "Budget Used": res[i].BudgetUsed
      });
    }
    renderScreen(`Total Budget per Department`, tableData);
    menuPrompt();
  });
}

function renderScreen(heading , data){
  console.clear();
  console.table(heading, data);
}

