import { useState } from "react"

const Blog = ({blog}) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // if visible is True, { display: 'none'}, else {display: ''}
  const hideWhenVisible = { display: visible ? 'none' : ''}
  // if visible is False, { display: 'none'}, else {display: ''}
  const showWhenVisible = { display: visible ? '' : 'none'}

  const toggleVisibility = () => {
      setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
          {blog.title}
          <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
          <p>{blog.title}</p>
          <p>{blog.url}</p>
          <p>{blog.like}</p>
          <p>{blog.author}</p>
          <button onClick={toggleVisibility}>cancle</button>
      </div>
      
    </div>  
  )
  
}

export default Blog