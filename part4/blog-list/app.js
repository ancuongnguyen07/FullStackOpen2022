const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const bodyParser = require('body-parser')

app.use(cors())
app.use(express.json())

const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const config = require('./utils/config')
// const Blog = require('./models/blog')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB")
    })
    .catch(err => {
        logger.error("error connecting to MongoDB", err.message)
    })

// app.use(bodyParser.json())

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app