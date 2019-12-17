const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
var morgan = require('morgan')

app.use(cors())

app.use(bodyParser.json())
morgan.token('object', function(req, res) {
	return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

let persons = [
	{ 
	  "name": "Arto Hellas", 
	  "number": "040-123456",
	  "id": 1
	},
	{ 
	  "name": "Ada Lovelace", 
	  "number": "39-44-5323523",
	  "id": 2
	},
	{ 
	  "name": "Dan Abramov", 
	  "number": "12-43-234345",
	  "id": 3
	},
	{ 
	  "name": "Mary Poppendieck", 
	  "number": "39-23-6423122",
	  "id": 4
	}
]

app.get('/info', (req, res) => {
	const num = persons.length

	const content = `<p>Phonebook has info for ${num} people</p>
		<p>${new Date()}</p>`

	res.send(content)
})

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(p => p.id === id)
	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(p => p.id !== id)
	res.status(204).end()
})

app.post('/api/persons', (req, res) => {
	const body = req.body

	if (!body.name || !body.number) {
		return res.status(400).json({
			error: 'name or number is missing'
		})
	} else if (persons.find(p => p.name === body.name)) {
		return res.status(400).json({
			error: 'name must be unique'
		})
	}

	const person = {
		name: body.name,
		number: body.number,
		id: Math.round(Math.random()*100000)
	}

	persons = persons.concat(person)
	res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})