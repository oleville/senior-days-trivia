-- Init script
-- Create tables for Senior Days Quiz Game
-- Elijah Verdoorn, May 2017

CREATE TABLE teams (id INTEGER PRIMARY KEY ASC, name VARCHAR NOT NULL);
CREATE TABLE question (id INTEGER PRIMARY KEY ASC, text VARCHAR, answer VARCHAR, catagory_id INTEGER);
CREATE TABLE category (id INTEGER PRIMARY KEY ASC, text VARCHAR);
