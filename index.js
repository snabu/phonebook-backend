const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
]


app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('payload', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :payload :status :res[content-length] - :response-time ms'))

app.get('/api/persons', (req, res) => {
    res.json(persons)
})


app.post('/api/persons', (req, res) => {
    if (req.body === undefined) {
        return res.status(400).json({error: 'content missing'})
    }
    const person = req.body
    if (!person.name ) {
        return res.status(400).json({error: 'person.name missing'})
    }
    if (!person.number ) {
        return res.status(400).json({error: 'person.number missing'})
    }

    const index = persons.findIndex(function(person) {
        return person.name.toLowerCase() === name.toLowerCase()
    }, name=person.name)

    if (index > -1) {
        return res.status(409).json({error : 'person with name ' + person.name + ' already exists'})
    }
    person.id = Math.floor(Math.random() * Math.floor(100000000));
    persons = persons.concat(person)
    res.status(201).json(person)
})

app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(person =>{
        return person.id.toString() === req.params.id
    } )
    person ? res.json(person) : res.status(404).send({error : "no entry with id " + req.params.id })
})

app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(person => person.id.toString() != req.params.id)
    res.status(204).end()
})

app.get('/info', (req, res) => {
    res.send('<p>Puhelinluettelossa ' + persons.length + ' henkilön tiedot<p>' + new Date())
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})