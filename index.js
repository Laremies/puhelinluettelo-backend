const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
morgan.token('body', req => {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    } else return ' '
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h3>Go to /api/persons<h3/>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<div>Phonebook has info for ${persons.length} people <br /> ${Date()}<div>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id == id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(p => p.id != id)
  
    res.status(204).end()
})

const generateId = () => {
    let id = Math.floor(Math.random() * 99999)
    const ids = persons.map(p => p.id)
    while (ids.includes(id)) {
        id = Math.floor(Math.random() * 99999)
    }
    return id
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    const names = persons.map(p => p.name)
    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    if (names.includes(body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)

    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})