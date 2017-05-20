-- Init script
-- Create tables for Senior Days Quiz Game
-- Elijah Verdoorn, May 2017

CREATE TABLE teams (
	id INTEGER PRIMARY KEY ASC,
	name VARCHAR NOT NULL,
	points INTEGER
);

CREATE TABLE question (
	id INTEGER PRIMARY KEY ASC,
	category_id INTEGER,
	question VARCHAR,
	used INTEGER,
	FOREIGN KEY(category_id) REFERENCES category(id)
);

CREATE TABLE category (
	id INTEGER PRIMARY KEY ASC,
	text VARCHAR
);

CREATE TABLE choice (
	id INTEGER PRIMARY KEY ASC,
	question_id INTEGER,
	choice VARCHAR,
	correct INTEGER,
	FOREIGN KEY(question_id) REFERENCES question(id)
);
