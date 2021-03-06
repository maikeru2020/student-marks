CREATE TABLE account_types (
    id SERIAL PRIMARY KEY,
    account_type VARCHAR(255)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    account_type INT REFERENCES account_types
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

CREATE TABLE student_parent (
    student_id INT REFERENCES students,
    parent_id INT REFERENCES users
);

CREATE TABLE student_teacher (
    student_id INT REFERENCES students,
    teacher_id INT REFERENCES users
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    max_score INT NOT NULL
);

CREATE TABLE marks (
    id SERIAL PRIMARY KEY,
    score INT NOT NULL,
    task_id INT REFERENCES tasks,
    student_id INT REFERENCES students
);

INSERT INTO account_types (account_type)
VALUES ('parent'), ('teacher'), ('admin');

INSERT INTO students (first_name, last_name)
VALUES ('Apple', 'Bloom'), ('Scoot', 'Aloo'), ('Sweetie', 'Belle');

INSERT INTO tasks (task_name, max_score)
VALUES ('Individual Class Test 1', 30), ('Group Exercise', 20), ('Individual Class Test 2', 30), ('Project Homework', 20), ('End of Term Exam', 100); 

INSERT INTO marks (score, task_id, student_id)
VALUES (29, 1, 1), (10, 2, 1), (30, 3, 1), (19, 4, 1), (95, 5, 1),
       (0, 1, 2), (20, 2, 2), (3, 3, 2), (5, 4, 2), (40, 5, 2),
       (15, 1, 3), (10, 2, 3), (15, 3, 3), (10, 4, 3), (75, 5, 3);

INSERT INTO student_teacher (student_id, teacher_id)
VALUES (1, 4), (2, 4), (3, 4);

INSERT INTO student_parent (student_id, parent_id)
VALUES (1, 1), (2, 3), (3, 2);

DROP TABLE marks;
DROP TABLE tasks;
DROP TABLE student_parent;
DROP TABLE student_teacher;
DROP TABLE students;
DROP TABLE users;
DROP TABLE account_types;