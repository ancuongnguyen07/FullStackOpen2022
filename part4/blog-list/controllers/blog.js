const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// list all blogs
blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
                    .populate('user', {username: 1, name: 1})
    response.json(blogs)
})

// post a new blog
blogRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findById(body.userId)

    const blog = new Blog({
        title: body.title,
        url: body.url,
        user: user._id,
        likes: body.likes | 0
    })

    if (typeof blog.title === 'undefined'
        || typeof blog.url === 'undefined'){
            response.status(400).send({error: 'NULL title or url'})
        }
    else{
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)
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

// delete a specific blog with given id
blogRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findByIdAndDelete(request.params.id)
    if (blog){
        response.status(204).end()
    }
    else{
        response.status(400).end()
    }
})

// update a specific blog with given id
blogRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const body = request.body

    const blog = {
        likes: body.likes
    }

    const result = await Blog.findByIdAndUpdate(id, blog, {new: true})
    if (result){
        response.status(200).json(result)
    }
    else{
        response.status(400).end()
    }

})

module.exports = blogRouter