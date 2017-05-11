let express = require('express')
let sqlite3 = require('sqlite3').verbose()

// Start Express
let app = express()
app.set('view engine', 'pug')

// make connection to SQLite3
let db = new sqlite3.Database('db/database.db')

app.get('/', (req, res) => {
	res.render('index', {title: 'Senior Days 2017', message: 'Testing'})
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
