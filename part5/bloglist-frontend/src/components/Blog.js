import { useState } from 'react'

const Blog = ({ blog, updateLike, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)
  // const [likes, setLikes] = useState(blog.likes)

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
    // setLikes(likes + 1)
  }

  const handleRemove = (event) => {
    event.preventDefault()

    const message = `Do you really want to remove 
              ${blog.title} | ${blog.author}?`

    if (window.confirm(message)){
      removeBlog(blog.id)
    }
  }

  const own = blog.user && blog.user.id === user.username.id

  return (
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author}
      <div style={hideWhenVisible} className="alwaysShowed">
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className="hiden">
        <p>{blog.url}</p>
        <div>
          <p>Likes: {blog.likes}</p>
          <button className='like-button' onClick={handleLike}>like</button>
        </div>
        <button onClick={toggleVisibility}>hide</button>
        <h5>Added by: {blog.user.name}</h5>
        {own && <button className='remove-button' onClick={handleRemove}>remove</button>}
      </div>

    </div>
  )

}

export default Blog