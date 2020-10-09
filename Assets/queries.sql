-- Query to insert new Employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (?, ?, ?, ?);

-- Query to insert departments
INSERT INTO department (id, name)
VALUES (?, ?);

-- Query to insert Roles
INSERT INTO role (id, title, salary, department_id)
VALUES (?, ?, ?, ?);

-- Query to view Employees
SELECT * FROM employee where employee_id like 2;

-- Query to view Roles
SELECT * FROM role where role_id like 2;

-- Query to view Departments
SELECT * FROM department where department_id like 2;

-- Query to update employee Roles
UPDATE employees SET role = 4 WHERE employee_id like 5;

-- View employees by manager
 SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name, concat(manager.first_name, " ", manager.last_name) AS manager_full_name 
 FROM employee 
 INNER JOIN role ON employee.role_id = role.id
 INNER JOIN employee AS manager ON employee.manager_id = manager.id
 INNER JOIN department ON department.id = role.department_id
  WHERE manager.first_name like "John" and department.name like 'Management';

-- View Employees by Department
SELECT first_name AS 'First Name', last_name AS 'Last Name', department.name AS 'Department Name' FROM 
    (employee INNER JOIN role ON role_id = role.id) 
INNER JOIN department ON department_id = department.id)
ORDER BY employee.id ASC

--Query to Delete Employees, Roles, Department 
DELETE FROM employee WHERE first_name like 'Andrew' AND last_name like 'Adam';

-- Query to Delete Roles
DELETE FROM role WHERE role_id like 1;

--Query to Delete Departments
DELETE FROM department WHERE name like 'Finance';


-- View the total utilized budget of a department
SELECT name, sum(r.salary) from  employeesdb.department d
INNER JOIN employees_db.role r on d.id = r.department_id
where d.id like 2;

