USE employees_db;

INSERT INTO department (name)
VALUES 
('Executive Leadership'), 
('Human Resources'), 
('InfoSec'), 
('Research & Development'),
('Finance');

INSERT INTO role (title, salary, department_id)
VALUES 
('COO', 250000, 1), 
('Chief HR Officer', 175000, 2), 
('Senior Engineer', 80000, 4),
('Analyst', 75000, 3),
('Finance Director', 95000, 5),
('Research Manager', 65000, 4),
('Chief Development Manager', 95000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Andrew', 'Adam', 2, 1), 
('Bob', 'Run', 3, 7), 
('Jane', 'Pill', 2, 6), 
('Marylin', 'Pop', 3, 5), 
('Randy', 'Debug', 4, 3), 
('Coach', 'Prob', 3, 2),
('Val', 'Serv', 2, 4),
('Honesty', 'Tarn', 4 ,1);

