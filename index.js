let express = require('express')
let sqlite3 = require('sqlite3').verbose()
let bodyParser = require('body-parser')

// Start Express
let app = express()
app.set('view engine', 'pug')

// make connection to SQLite3
let db = new sqlite3.Database('db/database.db')

// init the body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
	res.render('index', {title: 'Senior Days 2017', message: 'Testing'})
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

app.get('/db', (req, res) => {
	console.log('db request')
	// testing the db
	db.serialize(() => {
		db.each('SELECT * from teams', (err, row) => {
			console.log('Team name: ' + row.name)
		})
	})
	res.send('ran query')
})

app.listen(3000, () => {
	console.log('Running on port 3000')
})

// properly close db connection
process.on('exit', () => {
	db.close()
	console.log('closed db connection')
})
