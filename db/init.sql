-- Init script
-- Create tables for Senior Days Quiz Game
-- Elijah Verdoorn, May 2017

CREATE TABLE teams (id integer primary key, name varchar);
CREATE TABLE question (id integer primary key, text varchar, answer varchar, catagory_id integer);
CREATE TABLE category (id integer primary key, text varchar);

