DROP DATABASE IF EXISTS staff_db;
CREATE DATABASE staff_db;

USE staff_db;

-- create table for department
CREATE TABLE department (
  id INT NOT NULL,
  name VARCHAR(30) NOT NULL
);