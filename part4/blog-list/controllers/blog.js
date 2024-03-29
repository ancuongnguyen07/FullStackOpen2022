const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

// list all blogs
blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
                    .populate('user', {username: 1, name: 1})
    response.json(blogs)
})

// add a new blog
blogRouter.post('/', middleware.tokenExtractor,
                middleware.userExtractor ,async (request, response, next) => {
    const body = request.body
    // const token = getTokenFrom(request)
    const token = request.token
    
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken.id){
            return response.status(401).json({ error: 'token missing or invalid'})
        }
    
        // const user = await User.findById(decodedToken.id)
        const user = request.user
    
        const blog = new Blog({
            title: body.title,
            author: body.author,
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
    } catch(error){
        next(error)
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
blogRouter.delete('/:id', middleware.tokenExtractor,
                middleware.userExtractor ,async (request, response, next) => {
    const id = request.params.id
    const token = request.token
    const user = request.user

    try{
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken.id){
            return response.status(401).json({ error: 'token missing or invalid'})
        }

        const blog = await Blog.findById(id)

        // const blog = await Blog.findByIdAndDelete(id)
        if (blog){
            if (blog.user.toString() === user._id.toString()){
                await blog.delete()
            }
            response.status(204).end()
        }
        else{
            response.status(400).json({ error: 'undefined ID'})
        }
    }
    catch(exception){
        next(exception)
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