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
  ![Database Demo](<iframe src="https://drive.google.com/file/d/1oXEPipyFbXNg6mACOrzxYos6uK8DCD80/preview" width="640" height="480"></iframe>)
  https://drive.google.com/file/d/1oXEPipyFbXNg6mACOrzxYos6uK8DCD80/view
        
 ##usage:
* From a functionality standpoint, from the terminal the end user can: 
* View All Employees 
* View All Employees by Manager 
* View Roles 
* View Departments 
* Add Employee 
* Add Role 
* Add Department
* Update Employee Manager 
* Remove Employee 
* View Total Used Budget By Department 
* Exit Program 
* Note - if the user deletes the manager for a department it will have negative impact on the database due to async behavior
* Feature to be added as validation- to question if end user wants to proceed with deleting manager of dept due to downstream impact on db

        
 ##license:       
  MIT 
        
 
 ##test:
 Validation on data input 
              
  ##profile:
  https://www.linkedin.com/in/jeniferqueen/

