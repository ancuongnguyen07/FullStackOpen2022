const blogRouter = require('express').Router()
const Blog = require('../models/blog')

// list all blogs
blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => response.json(blogs))
})

// post a new blog
blogRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

module.exports = blogRouter