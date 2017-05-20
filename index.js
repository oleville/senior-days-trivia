import express from 'express'
import db from 'sqlite'
import bodyParser from 'body-parser'
import Promise from 'bluebird'

// Start Express
const app = express()
app.set('view engine', 'pug')

// init the body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

let currentQuestion = {};

// function to get a random question and its answers from the database
let getNextQuestion = async () => {
	let q = await db.all('SELECT * from question WHERE used = 0;')
	q = q[getRandomIntInclusive(0, q.length - 1)] // select a question
	let c = await db.all('SELECT * from choice WHERE question_id = $id ORDER BY random();', {
		$id: q.id
	})
	db.run('UPDATE question SET used = 1 WHERE id = ?;', q.id)
	return {question: q, answers: c}
}

let getRandomIntInclusive = (min, max) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

app.get('/', (req, res) => {
	res.render('index', {title: 'Senior Days 2017', message: 'Testing'})
})

// some sort of admin panel that manages the advancing of the questions, gives score updates, etc
app.post('/admin', async (req, res, next) => {
	switch (req.body.command) {
		case 'nextQuestion':
			currentQuestion = getNextQuestion()
			res.sendStatus(200); // send 'ok'
			break;
		default:
	}
}

app.get('/admin', async (req, res, next) => {
	res.render('admin')
}

app.get('/answers', async (req, res, next) => {
	try {
		let a = await db.all('SELECT * FROM choice c, question q WHERE q.id = c.question_id;')
		res.render('answers', {answers: a})
	} catch (err) {
		console.error(err)
		next(err)
	}
})

app.post('/register', (req, res) => {
	db.serialize(() => {
		let insertQuery = db.prepare('INSERT INTO teams (name) VALUES (?);')
		insertQuery.run(req.body.teamName)
		insertQuery.finalize()
		console.log('Inserted team: ' + req.body.teamName)
	})

	res.sendStatus(200) // tell the browser that we got it
})

app.get('/teams', async (req, res, next) => {
	try {
		let t = await db.all('SELECT * from teams;')
		res.render('teams', {teams: t})
	} catch (err) {
		console.error(err)
		next(err)
	}
})

// this should just display the current question, let the admin panel advance the question - ensure that multiple users get the same question
app.get('/question', async (req, res, next) => {
	try {
		res.render('question', currentQuestion);
	} catch (err) {
		console.error(err)
		next(err)
	}
})

// get the team's response to the questions - this responds with a screen telling them if they are right or not
app.post('/question', async (req, res, next) => {
	try {
		let teamId = req.cookies.teamId;
		let answer = req.body.answerId;
		res.render('question-result', {correct: (answer == correctAnswer)})
	} catch (err) {
		console.error(err)
		next(err)
	}
})

// properly close db connection
process.on('exit', () => {
	db.close()
	console.log('closed db connection')
})

// make connection to SQLite3 and start server
Promise.resolve().then(() => db.open('./db/database.db', {Promise}))
		.catch(err => console.error(err.stack))
		.finally(() => app.listen(3000))


