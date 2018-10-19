const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')


app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('payload', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :payload :status :res[content-length] - :response-time ms'))

app.get('/api/persons', (req, res) => {

    Person
        .find({})
        .then(persons => {
            console.log('puhelinluettelo:')
            persons.map(person => {
                console.log(Person.format(person))
            })
            res.json(persons.map(Person.format))
        })
})


app.post('/api/persons', (req, res) => {
    if (req.body === undefined) {
        return res.status(400).json({error: 'content missing'})
    }
    if (!req.body.name ) {
        return res.status(400).json({error: 'person.name missing'})
    }
    if (!req.body.number ) {
        return res.status(400).json({error: 'person.number missing'})
    }
    const person = new Person({
        name : req.body.name,
        number : req.body.number
    })

    Person.find({name : req.body.name})
        .then(persons => {
            if (persons.length > 0)
                return res.status(409).send()
            person
                .save()
                .then(savedPerson => {
                    res.status(201).json(Person.format(savedPerson))
                })
                .catch(error => {
                    console.log(error)
                    res.status(500).send()
                })

        })


})



app.put('/api/persons/:id', (req, res) => {
    if (req.body === undefined) {
        return res.status(400).json({error: 'content missing'})
    }
    if (!req.body.name ) {
        return res.status(400).json({error: 'person.name missing'})
    }
    if (!req.body.number ) {
        return res.status(400).json({error: 'person.number missing'})
    }

    Person.findByIdAndUpdate(req.params.id, { $set: { number: req.body.number }}, { new: true })
        .then(person => {
            res.status(200).json(person)
        })
        .catch(error => {
            console.log(error)
            res.status(500).send()
        })

})


app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(person => {
            res.json(Person.format(person))
        })
        .catch(err => {
            res.status(404).send({error : 'no entry with id ' + req.params.id })
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findOneAndDelete({_id: req.params.id})
        .then(resp => {
            res.status(204).end()
        })
})

app.get('/info', (req, res) => {
    Person.count({})
        .then(result => {
            res.send('<p>Puhelinluettelossa ' + result + ' henkilön tiedot<p>' + new Date())
        })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})