INSERT INTO category('text') VALUES ('category1');
INSERT INTO category('text') VALUES ('category2');
INSERT INTO category('text') VALUES ('category3');

INSERT INTO question('category_id', 'question', 'used', 'points') VALUES (1, 'Question 1', 0, 10);
INSERT INTO question('category_id', 'question', 'used', 'points') VALUES (1, 'Question 2', 0, 10);
INSERT INTO question('category_id', 'question', 'used', 'points') VALUES (1, 'Question 3', 0, 10);
INSERT INTO question('category_id', 'question', 'used', 'points') VALUES (1, 'Question 4', 0, 10);

INSERT INTO choice('question_id', 'choice', 'correct') VALUES (1, 'q1 Right answer', 1);
INSERT INTO choice('question_id', 'choice', 'correct') VALUES (1, 'q1 wrong answer 1', 0);
INSERT INTO choice('question_id', 'choice', 'correct') VALUES (1, 'q1 wrong answer 2', 0);
INSERT INTO choice('question_id', 'choice', 'correct') VALUES (1, 'q1 wrong answer 3', 0);

INSERT INTO choice('question_id', 'choice', 'correct') VALUES (2, 'q2 Right answer', 1);
INSERT INTO choice('question_id', 'choice', 'correct') VALUES (2, 'q2 wrong answer 1', 0);
INSERT INTO choice('question_id', 'choice', 'correct') VALUES (2, 'q2 wrong answer 2', 0);
INSERT INTO choice('question_id', 'choice', 'correct') VALUES (2, 'q2 wrong answer 3', 0);

INSERT INTO choice('question_id', 'choice', 'correct') VALUES (3, 'q3 Right answer', 1);
INSERT INTO choice('question_id', 'choice', 'correct') VALUES (3, 'q3 wrong answer 1', 0);
INSERT INTO choice('question_id', 'choice', 'correct') VALUES (3, 'q3 wrong answer 2', 0);
INSERT INTO choice('question_id', 'choice', 'correct') VALUES (3, 'q3 wrong answer 3', 0);

INSERT INTO choice('question_id', 'choice', 'correct') VALUES (4, 'q4 Right answer', 1);
INSERT INTO choice('question_id', 'choice', 'correct') VALUES (4, 'q4 wrong answer 1', 0);
INSERT INTO choice('question_id', 'choice', 'correct') VALUES (4, 'q4 wrong answer 2', 0);
INSERT INTO choice('question_id', 'choice', 'correct') VALUES (4, 'q4 wrong answer 3', 0);

