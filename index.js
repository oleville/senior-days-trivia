let express = require('express')

let app = express()
app.set('view engine', 'pug')

app.get('/', (req, res) => {
	res.render('index', {title: 'Senior Days 2017', message: 'Testing'})
})


app.listen(3000, () => {
	console.log('Running on port 3000')
})

