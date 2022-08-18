require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

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

// let people = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

// list all persons
app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(people => {
            response.json(people)
        })
        .catch(err => next(err))
})

// info page
app.get('/info', (request, response) => {
    Person.find({}).then((people) => {
        const length = people.length
        response.send(
            `<p>Phone book has info for ${length} people</p>
            <p>${new Date()}</p>`
        )
    })
    
})

// display a single person's info
app.get('/api/persons/:id', (request, response, next) => {
    const id = String(request.params.id)
    // const person = people.find(p => p.id === id)

    // if (!person){
    //     return response.status('404').end()
    // }

    // console.log('Person exists')
    // response.json(person)

    Person.findById(id)
        .then(person => {
            if (person){
                response.json(person)
            } else{
                response.status(404).end()
            }
        })
        .catch(err => next(err))
})

// delete a single person
app.delete('/api/persons/:id', (request, response, next) => {
    const id = String(request.params.id)
    // const person = people.find(p => p.id === id)

    // if (!person){
    //     return response.status(400).end()
    // }

    // people = people.filter(p => p.id !== id)
    // response.status(204).end()

    Person.findByIdAndDelete(id)
        .then((person) => {
            if (person){
                console.log(`deleted id: ${person.id}`)
                response.status(204).end()
            } else{
                console.log('id does not exist')
                response.status(400).end()
            }
            
        })
        .catch(err => next(err))

})

const generateId = () => {
    return Math.floor(Math.random() * RANDOM_RANGE)
}

const newPersonErrorHandler = (message) => {
    return response.status(400).json({
        error: `${message}`
    })
}

// add a new single person
app.post('/api/persons/', (request, response) => {
    const body = request.body
    // const duplicatedName = people.find(p => p.name === body.name)
    let duplicatedName = false
    Person.find({name: body.name}).then(() => duplicatedName = true)

    if (!body){
        return newPersonErrorHandler('Missing body content')
    } else if (!body.name){
        return newPersonErrorHandler('Missing name')
    } else if (!body.number){
        return newPersonErrorHandler('Missing number')
    } else if (duplicatedName){
        return newPersonErrorHandler('name must be unique')
    }

    // const id = generateId()
    const newPerson = new Person({
        // "id": generateId(),
        "name": body.name || "anonymous",
        "number": body.number || "unknown"
    })

    // people = people.concat(newPerson)
    newPerson.save()
        .then(savedPerson => {
            console.log(`name: ${body.name} | number: ${body.number} added`)
            response.json(savedPerson)
        })
        .catch(err => next(err))
})

// update new number of a existed person
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    if (!body){
        return newPersonErrorHandler('Missing body content')
    }

    // only fields which need to be updated
    const person = {
        number: body.number
    }

    Person.findByIdAndUpdate(body.id, person, { new: true})
        .then(updatedPerson => {
            if (updatedPerson){
                response.json(updatedPerson)
            } else{
                response.status(400).end()
            }
            
        })
        .catch(err => next(err))
})

// set up handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
    response.status(400).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// set up errorhandler middleware
const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError'){
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`)
})
