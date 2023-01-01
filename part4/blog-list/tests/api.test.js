const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'First title',
        author: 'A author',
        url: 'foo.bar',
        likes: 3
    },
    {
        title: 'Second title',
        author: 'B author',
        url: 'another.foo.bar',
        likes: 4
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared')

    // for each blog in the iniialBlogs creating a new Blog object
    // according to the Blog schema in model/blog.js
    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    // for each blog object saving it into the MongoDB, returning
    // a list of promises
    const promiseArray = blogObjects.map(blog => blog.save())
    // Create a single promise containing all created promises from
    // the array, making the beforeEach waits for this promise be resolved
    await Promise.all(promiseArray)
})

test('get all blogs on the DB', async () => {
    // await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    // const retrievedBlogList = response.body
    
    expect(response.header['content-type']).toMatch(/application\/json/)
    expect(response.body).toHaveLength(initialBlogs.length)
})

afterAll(() => {
    mongoose.connection.close()
})