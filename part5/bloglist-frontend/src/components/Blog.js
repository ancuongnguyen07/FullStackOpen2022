import { useState } from 'react'

const Blog = ({ blog, updateLike, removeBlog }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // if visible is True, { display: 'none'}, else {display: ''}
  const hideWhenVisible = { display: visible ? 'none' : '' }
  // if visible is False, { display: 'none'}, else {display: ''}
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = (event) => {
    event.preventDefault()

    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    updateLike(updatedBlog)

  }

  const handleRemove = (event) => {
    event.preventDefault()

    const message = `Do you really want to remove 
              ${blog.title} | ${blog.author}?`

    if (window.confirm(message)){
      removeBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className="alwaysShowed">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className="hiden">
        <p>{blog.title}</p>
        <p>{blog.url}</p>
        <div>
          <p>Likes: {likes}</p>
          <button onClick={handleLike}>like</button>
        </div>
        <p>{blog.author}</p>
        <button onClick={toggleVisibility}>hide</button>
        <button onClick={handleRemove}>remove</button>
      </div>

    </div>
  )

}

export default Blog