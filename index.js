const express = require('express')
const app = express()

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

app.get('/api/persons', (req, res) => {
    res.json(persons)
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})