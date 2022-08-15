const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

// middleware config
app.use(express.json())
app.use(morgan((tokens, req, res) => {
    const body = req.body
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(body)
    ].join(' ')
}))
app.use(cors())
app.use(express.static('build'))


const RANDOM_RANGE = 100000

let people = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// list all persons
app.get('/api/persons', (request, response) => {
    response.json(people)
})

// info page
app.get('/info', (request, response) => {
    response.send(
        `<p>Phone book has info for ${people.length} people</p>
        <p>${new Date()}</p>`
    )
})

// display a single person's info
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = people.find(p => p.id === id)

    if (!person){
        return response.status('404').end()
    }

    console.log('Person exists')
    response.json(person)
})

// delete a single person
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = people.find(p => p.id === id)

    if (!person){
        return response.status(400).end()
    }

    people = people.filter(p => p.id !== id)
    response.status(204).end()

})

const generateId = () => {
    return Math.floor(Math.random() * RANDOM_RANGE)
}

// add a new single person
app.post('/api/persons/', (request, response) => {
    const body = request.body
    const duplicatedName = people.find(p => p.name === body.name)

    const errorHandling = (message) => {
        return response.status(400).json({
            error: `${message}`
        })
    }

    if (!body){
        return errorHandling('Missing body content')
    } else if (!body.name){
        return errorHandling('Missing name')
    } else if (!body.number){
        return errorHandling('Missing number')
    } else if (duplicatedName){
        return errorHandling('name must be unique')
    }

    const id = generateId()
    const newPerson = {
        "id": generateId(),
        "name": body.name || "anonymous",
        "number": body.number || "unknown"
    }

    people = people.concat(newPerson)
    response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`)
})
