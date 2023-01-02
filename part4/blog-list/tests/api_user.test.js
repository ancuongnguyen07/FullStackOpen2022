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

    test('Add a new user', async () => {
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
})

afterAll(() => {
    mongoose.connection.close()
})