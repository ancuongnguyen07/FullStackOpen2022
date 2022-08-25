const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())

const blogRouter = require('./controllers/blog')
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

app.use('/api/blogs', blogRouter)

app.listen(config.PORT, () => {
    logger.info(`Server is running on ${config.PORT} port`)
})