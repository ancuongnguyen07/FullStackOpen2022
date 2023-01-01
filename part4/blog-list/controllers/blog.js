const blogRouter = require('express').Router()
const Blog = require('../models/blog')

// list all blogs
blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

// post a new blog
blogRouter.post('/', async (request, response) => {
    const body = request.body
    const blog = new Blog({
        ...body,
        likes: body.likes | 0
    })


    const result = await blog.save()
    response.status(201).json(result)
    
    // blog
    //     .save()
    //     .then(result => {
    //         response.status(201).json(result)
    //     })
})

module.exports = blogRouter