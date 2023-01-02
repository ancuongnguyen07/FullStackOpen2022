const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./helper')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')

const api = supertest(app)

describe('There is initially a user in DB', () => {
    beforeEach(async () => {
        // delete all users in DB
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('first_secret', 10)
        const user = new User({
            username: 'root',
            name: 'BeRoot',
            passwordHash
        })

        await user.save()
    })

    test('Add a new valid user', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'Hieuthuhai',
            name: 'Hieu',
            password: 'ngumotminh'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const names = usersAtEnd.map(user => user.name)
        expect(names).toContain(newUser.name)
    })

    test('Add a new invalid user, missing username or password', async () => {
        const usersAtStart = await helper.usersInDb()
        
        // missing password
        const newUser = {
            // username: 'baolam',
            name: 'rade',
            password: 'xyxyx'
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(response.body.error).toEqual('NULL password and username')
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).not.toContain(newUser.username)
    })

    test('Add an invalid user, username or password are shorter than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()
        
        // username is shorter than 3 characters
        const newUser = {
            username: 'ba',
            name: 'rade',
            password: 'xyxyx'
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(response.body.error).toEqual('invalid length of username or password (min 3 characters')
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).not.toContain(newUser.username)
    })

    test('The username should be unique', async () => {
        const usersAtStart = await helper.usersInDb()
        
        // username is shorter than 3 characters
        const newUser = {
            username: 'root',
            name: 'rade',
            password: 'dongnai'
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        // expect(response.body.error).toEqual('invalid length of username or password (min 3 characters')
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        const names = usersAtEnd.map(u => u.name)
        expect(names).not.toContain(newUser.name)
    })
})

afterAll(() => {
    mongoose.connection.close()
})