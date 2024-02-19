-- insert values into department table
INSERT INTO department (name)
VALUES ('Engineering'),
       ('Marketing'),
       ('Human Resources'),
       ('IT'),
       ('Sales');

-- insert values into role table
INSERT INTO role (title, salary, department_id)
VALUES ('Senior Engineer', 120000, 1),
       ('Junior Engineer', 100000, 1),
       ('Social Media Manager', 65000, 2),
       ('Data Analyst', 95000, 1),
       ('Marketing Manager', 85000, 2),
       ('Associate Marketing', 70000, 2),
       ('Product Manager', 110000, 5),
       ('Customer Service Rep', 80000, 3),
       ('IT Technician', 75000, 4),
       ('Sales Associate', 80000, 5),
       ('Sales Manager', 90000, 5);


-- insert values into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jill', 'Saunders', 1, null),
       ('Michelle', 'Jones', 2, null),
       ('John', 'Smith', 3, null),
       ('Bruce', 'Peters', 4, null),
       ('Tony', 'Todd', 5, null),
       ('Tiffany', 'Johnson', 6, null),
       ('Shaun', 'Thomas', 7, null),
       ('Betty', 'Jones', 8, null),
       ('Trinity', 'Smook', 9, null),
       ('Anthony', 'Soprano', 10, null),
       ('Sonia', 'Lewis', 11, null);