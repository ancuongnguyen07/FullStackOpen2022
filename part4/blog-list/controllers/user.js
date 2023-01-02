const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
// const { response } = require('../app')

// list all users
userRouter.get('/', async (request, response) => {
    const userList = await User.find({})
    response.json(userList)
})

// add a new user
userRouter.post('/', async (request, response) => {
    const { username, name, password} = request.body

    const saltRound = 10
    const passwordHash = await bcrypt.hash(password, saltRound)

    const newUser = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
})

module.exports = userRouter
