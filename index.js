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

// init the static views for images
app.use('/public', express.static(__dirname + '/public'))

let currentQuestion = {}; // store information about the current question so we don't have to keep asking the database for the information

// check if the answer that the user gave us is correct
let checkAnswer = (userAnswer) => {
	currentQuestion.answers.forEach((ele) => {
		if (ele.letter == userAnswer) {
			// this is the one that they chose
			return ele.correct
		}
	})
}

// function to get a random question and its answers from the database
let getNextQuestion = async () => {
	let q = await db.all('SELECT * from question WHERE used = 0;')
	q = q[getRandomIntInclusive(0, q.length - 1)] // select a question
	let c = await db.all('SELECT * from choice WHERE question_id = $id ORDER BY random();', {
		$id: q.id
	})
	db.run('UPDATE question SET used = 1 WHERE id = ?;', q.id)
	// this is how they'll be displayed on the user's screen, so we need to know the letter. We can't store it in the DB since we're randomizing the order that we get them out
	c[0].letter = 'a'
	c[1].letter = 'b'
	c[2].letter = 'c'
	c[3].letter = 'd'
	return {question: q, answers: c}
}

let resetAll = async () => {
	// reset this session
	db.run('DELETE FROM teams;')
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
			res.sendStatus(200) // send 'ok'
			break;
		case 'resetSession':
			resetAll()
			res.sendStatus(200)
			break;
		default:
			break;
	}
})

// render the admin panel
app.get('/admin', async (req, res, next) => {
	res.render('admin')
})

// register a new team
app.post('/register', async (req, res) => {
	let insertQuery = await db.run('INSERT INTO teams (name, points) VALUES (?, 0);', req.body.teamName)
	console.log('Inserted team: ' + req.body.teamName)

	let teamId = await db.get('SELECT id FROM teams WHERE name = $name', {
		$name: req.body.teamName
	})

	console.log('sending cookie' + teamId.id)
	res.cookie('teamId', teamId.id)
	res.redirect('/answer')
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

// render the answer page to the user's device
app.get('/answer', (req, res, next) => {
	res.render('answer')
})

// get the team's response to the questions - this responds with a screen telling them if they are right or not
app.post('/answer', async (req, res, next) => {
	try {
		console.log('got an answer')
		let teamId = req.cookies.teamId;
		let answer = req.body.answerId;
		let correct = checkAnswer(answer)

		if (currentQuestion.teamsAnswered.includes(teamId)) { // this team has already answered
			console.log('already answered')
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

