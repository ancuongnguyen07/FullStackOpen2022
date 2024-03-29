
const express = require('express')
const app = express()


let notes = [  
    {    
        id: 1,    
        content: "HTML is easy",    
        date: "2022-05-30T17:30:31.098Z",    
        important: true  
    },  
    {    
        id: 2,    
        content: "Browser can execute only Javascript",    
        date: "2022-05-30T18:39:34.091Z",    
        important: false  
    },  
    {   
        id: 3,    
        content: "GET and POST are the most important methods of HTTP protocol",    
        date: "2022-05-30T19:20:14.298Z",    
        important: true  
    }
]

// const app = createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json' })
//     response.end(JSON.stringify(notes))
// })

app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note){
        response.json(note)
    } else{
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status('204').end()
})

const generateId = () => {
    const maxID = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0

    return maxID + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body){
        return response.status('400').json({
            error: "data missing"
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    }

    response.json(note)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)