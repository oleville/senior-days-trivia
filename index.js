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

app.get('/', (req, res) => {
	res.render('index', {title: 'Senior Days 2017', message: 'Testing'})
})

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

// properly close db connection
process.on('exit', () => {
	db.close()
	console.log('closed db connection')
})

// make connection to SQLite3 and start server
Promise.resolve().then(() => db.open('./db/database.db', {Promise}))
		.catch(err => console.error(err.stack))
		.finally(() => app.listen(3000))


