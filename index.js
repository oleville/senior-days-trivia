import express from 'express'
import db from 'sqlite'
import bodyParser from 'body-parser'
import Promise from 'bluebird'
import cookieParser from 'cookie-parser'

// Start Express
const app = express()
app.set('view engine', 'pug')

// init the body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// init the cookie parser
app.use(cookieParser())

let currentQuestion = {}; // store information about the current question so we don't have to keep asking the database for the information

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

// return a random integer in the range [min, max]
let getRandomIntInclusive = (min, max) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

// get the main page
app.get('/', (req, res) => {
	res.render('index', {title: 'Senior Days 2017', message: 'Testing'})
})

// some sort of admin panel that manages the advancing of the questions, gives score updates, etc
app.post('/admin', async (req, res, next) => {
	switch (req.body.command) {
		case 'nextQuestion':
			currentQuestion = await getNextQuestion()
			currentQuestion.teamsAnswered = [] // reset the teams that have answered this question, since this is a new question
			res.sendStatus(200); // send 'ok'
			break;
		default:
			break;
	}
})

// render the admin panel
app.get('/admin', async (req, res, next) => {
	res.render('admin')
})

// get all the answers from the database
app.get('/answers', async (req, res, next) => {
	try {
		let a = await db.all('SELECT * FROM choice c, question q WHERE q.id = c.question_id;')
		res.render('answers', {answers: a})
	} catch (err) {
		console.error(err)
		next(err)
	}
})

// register a new team
app.post('/register', async (req, res) => {
	let insertQuery = await db.run('INSERT INTO teams (name) VALUES (?);', req.body.teamName)
	console.log('Inserted team: ' + req.body.teamName)

	let teamId = await db.get('SELECT id FROM teams WHERE name = $name', {
		$name: req.body.teamName
	})

	console.log('sending cookie' + teamId.id)
	res.cookie('teamId', teamId.id)
	res.sendStatus(200) // tell the browser that we got it
})

// show a list of all the teams
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
		let correct = (answer == correctAnswer)

		if (currentQuestion.teamsAnswered.includes(teamId)) { // this team has already answered
			res.render('question-result', {correct: false, answered: true})
			return
		} else {
			currentQuestion.teamsAnswered.push(teamId)

			if (correct) {
				db.run('UPDATE team SET points = (SELECT points FROM team WHERE id = $teamId) + $thisQuestionPoints WHERE id = $teamId', {
					$teamId: teamId,
					$thisQuestionPoints: currentQuestion.points
				})
			}

			res.render('question-result', {answered: false, correct: correct})
		}
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


