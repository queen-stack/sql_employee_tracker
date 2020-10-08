# sql_employee_tracker
Command-line application to manage a company's database of employees using Node.js, Inquirer, and MySQL


![GitHub license](https://img.shields.io/badge/license-MIT-purple.svg)

# Table of Content
-[description](#description)
-[installation](#installation)
-[usage](#usage)
-[license](#license)
-[test](#test)
-[username](#username)
-[profile](#profile)
        
 ##username:
   queen-stack 
        
 ##description: <br>
     Command-line application to manage a company's database of employees using Node.js, Inquirer, and MySQL
     This application won’t be deployed as it is an exercise in MYSQL from the terminal.

       
 ##installation:
* You’ll need to use the MySQL2 package (https://www.npmjs.com/package/mysql2) to connect to MySQL database and perform queries
* You’ll need to use Inquirer package (Inquirer package (https://www.npmjs.com/package/inquirer) to interact with the user via the command-line
* You'll need to use the console.table package (https://www.npmjs.com/package/console.table) to print MySQL rows to the console.
 

  ![Command Line demo](./Assets/12-sql-homework-demo-01.gif)
  ![Database Demo](./Assets/12-sql-homework-demo-02.png)
        
 ##usage:
* GIVEN a command-line application that accepts user input
* WHEN I start the application
* THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and    
  update an employee role
* WHEN I choose to view all departments
* THEN I am presented with a formatted table showing department names and department ids
* WHEN I choose to view all roles
* THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
* WHEN I choose to view all employees
* THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and 
  managers that the employees report to
* WHEN I choose to add a department
* THEN I am prompted to enter the name of the department and that department is added to the database
* WHEN I choose to add a role
* THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
* WHEN I choose to add an employee
* THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database
* WHEN I choose to update an employee role
* THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

        
 ##license:       
  MIT 
        
 
 ##test:
              
  ##profile:
  https://www.linkedin.com/in/jeniferqueen/

