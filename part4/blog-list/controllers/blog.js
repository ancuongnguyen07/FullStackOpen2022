const blogRouter = require('express').Router()
const { response } = require('../app')
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

    if (typeof blog.title === 'undefined'
        || typeof blog.url === 'undefined'){
            response.status(400).end()
        }
    else{
        const result = await blog.save()
        response.status(201).json(result)
    }
})

// list a specific blog with given ID
blogRouter.get('/:id', async (request, response) => {
    const id = request.params.id
    const blog = await Blog.findOne({id: id})
    if (blog){
        response.status(200).json(blog)
    }
    else{
        response.status(400).end()
    }
})

blogRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findByIdAndDelete(request.params.id)
    if (blog){
        response.status(204).end()
    }
    else{
        response.status(400).end()
    }
})

module.exports = blogRouter