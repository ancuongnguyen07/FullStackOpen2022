import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  // const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // console.log(blogs.map(blog => blog.user.id))
  const blogFromRef = useRef()


  const login = async (credential) => {

    try{
      const user = await loginService.login(credential)

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)
      // setBlogs(blogs.filter(blog => blog.user.username === user.username))
      // console.log(user)

    } catch(exception){
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = (blogObject) => {
    blogFromRef.current.toggleVisibility()
    blogService.create(blogObject)
                .then(returnedBlog => {
                  setBlogs(blogs.concat(returnedBlog))
                })

    setErrorMessage('New blog added successfully')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    
  }

  const updateLike = (blogObject) => {
    blogService.update(blogObject)
                .then(returnedBlog => {
                  setBlogs(blogs.map(blog => 
                    blog.id === blogObject.id
                    ? returnedBlog
                    : blog
                  ))
                })
  }

  const removeBlog = (id) => {
    blogService.remove(id)
                .then(returnedBlog => {
                  setBlogs(blogs.filter(blog => 
                    blog.id !== id))
                })
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  let blogsToShow = user !== null ? 
                    blogs.filter(blog => blog.user.username === user.username)
                    :
                    blogs

  blogsToShow = blogsToShow.sort((a,b) => b.likes - a.likes)

  return (
    <div>
      <h5>Notification: {errorMessage}</h5>
      {user === null ?
        <LoginForm login={login}></LoginForm>
        :
        <div>
          <h2>blogs</h2>
          <h5>{user.username} logged in</h5>

          <form onSubmit={handleLogout}>
            <button type='submit'>logout</button>
          </form>

          {blogsToShow.map(blog => {
            
            return (
                <Blog blog={blog} updateLike={updateLike} removeBlog={removeBlog}/>
            )
          }
            
            
          )}

          <Togglable buttonLabel='New blog' ref={blogFromRef}>
            <BlogForm addBlog={addBlog}></BlogForm>
          </Togglable>

        </div>
        
        }
    </div>
  )
}

export default App
