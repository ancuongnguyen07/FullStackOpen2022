const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
// const { json } = require('express')

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
    // console.log('cleared')

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

describe('when there are some blogs saved', () => {
    test('get all blogs on the DB', async () => {
        // await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
        const response = await api.get('/api/blogs')
        // const retrievedBlogList = response.body
        
        expect(response.header['content-type']).toMatch(/application\/json/)
        expect(response.body).toHaveLength(initialBlogs.length)
    })
    
    test('test defined unique identifier (ID) of blogs', async () => {
        const response = await api.get('/api/blogs')
    
        response.body.map(blog => expect(blog['id']).toBeDefined())
    })
})

describe('addition of a new blog', () => {
    test('add a new blog to DB successfully', async () => {
        // new blog is going to be added
        const newBlog = {
            title: 'Third title',
            author: 'C author',
            url: 'an.another.foo.bar',
            likes: 2
        }
    
        // send a HTTP POST with a new blog in the request body
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        // retrieve all blogs from DB
        const response = await api.get('/api/blogs')
        // get all the titles
        const titles = response.body.map(blog => blog['title'])
    
        expect(response.body).toHaveLength(initialBlogs.length + 1)
        expect(titles).toContain('Third title')
    })
    
    test('test missing *like* property', async () => {
        // missing *like* property blog object
        const newBlog = {
            title: 'Third title',
            author: 'C author',
            url: 'an.another.foo.bar'
        }
    
        // send a HTTP POST with a new blog in the request body
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        // retrieve all blogs from DB
        const response = await api.get('/api/blogs')
        const targetBlog = response.body
                            .find(blog => blog.title === 'Third title')
    
        expect(targetBlog.likes).toEqual(0)
    
    })
    
    test('*title* or *url* missing will cause 400 Bad Request', async () => {
        // missing *title* or *url* property blog object
        const newBlog = {
            title: 'Third title',
            author: 'C author',
            // url: 'an.another.foo.bar'
        }
    
        // send a HTTP POST with a new blog in the request body
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
})

describe('Deleting a specific blog', () => {
    test('if the id is non-existing, returning 400', async () => {
        // retrieve all blogs from DB
        const responseStart = await api.get('/api/blogs')

        const deletedBlog = responseStart.body[0]

        await api
            .delete(`/api/blogs/${deletedBlog.id}`)
            .expect(204)

        // after deleting, all blogs from DB
        const responseEnd = await api.get('/api/blogs')
        
        expect(responseEnd.body).toHaveLength(initialBlogs.length - 1)

        const authors = responseEnd.body.map(blog => blog.author)
        expect(authors).not.toContain('A author')
    })
})

describe('Updating a specific blog', () => {
    test('a valid id', async () => {
        // retrieve all blogs from DB
        const responseStart = await api.get('/api/blogs')
        const originalBlog = responseStart.body[0]
        const updatedBlog = {
            ...originalBlog,
            likes: originalBlog.likes + 10
        }

        await api
            .put(`/api/blogs/${updatedBlog.id}`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const responseEnd = await api
                                .get(`/api/blogs/${originalBlog.id}`)
                                .expect(200)
                                .expect('Content-Type', /application\/json/)

        expect(responseEnd.body.likes).toEqual(updatedBlog.likes)
    })
})

afterAll(() => {
    mongoose.connection.close()
})