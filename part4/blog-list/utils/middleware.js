const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
const errorHandler = (error, request, response, next) => {

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    }

    logger.error(error.message)
    next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')){
        const token = authorization.substring(7)
        request.token = token
    }
    else{
        request.token = null
    }

    next()
}

const userExtractor = async (request, response, next) => {
    const token = request.token
    // logger.info(token)

    try{
        const decodedToken = jwt.verify(token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)

        request.user = user
        // logger.info(user.id)
        next()
    }
    catch(error){
        next(error)
    }
}

module.exports = { 
    unknownEndpoint, errorHandler, tokenExtractor, userExtractor }