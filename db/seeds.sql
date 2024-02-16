-- insert values into department table
INSERT INTO department (name)
VALUES (Engineering),
       (Marketing),
       (Human Resources),
       (IT),
       (Sales);

-- insert values into role table
INSERT INTO role (title, salary, department_id)
VALUES ('Senior Software Engineer', 120000, 1),
       ('Junior Software Engineer', 100000, 1),
       ('Social Media Manager', 65000, 2),
       ('Data Analyst', 95000, 1),
       ('Marketing Manager', 85000, 2),
       ('Associate Marketing Manager', 70000, 2),
       ('Product Manager', 110000, 5),
       ('Customer Service Representative', 80000, 3),
       ('IT Helpdesk Technician', 75000, 4),
       ('Sales Associate', 80000, 5);