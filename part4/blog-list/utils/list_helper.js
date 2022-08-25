const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce(
        (preValue, curBlog) => preValue + curBlog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    return blogs.reduce(
        (preBlog, curBlog) => curBlog.likes >= preBlog.likes ? curBlog : preBlog)
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    return _.chain(blogs)
                        .countBy('author')
                        .map((value, key) => ({author: key, blogs: value}))
                        .maxBy('blogs')
                        .value()
                        
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    return _.chain(blogs)
                        .groupBy('author')
                        .map((values, key) => {
                            const numOfLikes = values.reduce(
                                (preVal, currBlog) => preVal + currBlog.likes,
                                0
                            )
                            return ({author: key, likes: numOfLikes})
                        })
                        .maxBy('likes')
                        .value()
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}