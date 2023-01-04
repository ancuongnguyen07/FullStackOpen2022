const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
// const { response } = require('../app')

// list all users
userRouter.get('/', async (request, response) => {
    const userList = await User.find({})
                        .populate('blogs', {title: 1, author: 1, likes: 1, url: 1})
    response.json(userList)
})

// add a new user
userRouter.post('/', async (request, response, next) => {
    const { username, name, password} = request.body

    if (typeof username === 'undefined' || typeof password === 'undefined'){
        return response.status(400).send({ error: 'NULL password and username'})
    }
    else if (username.length < 3 || password.length < 3){
        return response.status(400).send({ error: 'invalid length of username or password (min 3 characters'})
    }

    // console.log('hehehe')
    const saltRound = 10
    const passwordHash = await bcrypt.hash(password, saltRound)

    const newUser = new User({
        username,
        name,
        passwordHash
    })

    try{
        const savedUser = await newUser.save()
        response.status(201).json(savedUser)
    }catch(exception){
        next(exception)
    }
    
})

module.exports = userRouter
