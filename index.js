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

let questionsUsed = []

app.get('/', (req, res) => {
	res.render('index', {title: 'Senior Days 2017', message: 'Testing'})
})

let getRandomIntInclusive = (min, max) => {
	  min = Math.ceil(min);
	    max = Math.floor(max);
	      return Math.floor(Math.random() * (max - min + 1)) + min;
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

app.get('/question', async (req, res, next) => {
	try {
		let q = await db.all('SELECT * from question WHERE used = 0;')
		q = q[getRandomIntInclusive(0, q.length - 1)] // select a question
		let c = await db.all('SELECT * from choice WHERE question_id = $id ORDER BY random();', {
			$id: q.id
		})
		db.run('UPDATE question SET used = 1 WHERE id = ?;', q.id)
		res.render('question', {question: q, answers: c});
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


