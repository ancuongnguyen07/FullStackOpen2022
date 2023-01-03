import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'

import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // console.log(blogs.map(blog => blog.user.id))

  const handleLogin = async (event) => {
    event.preventDefault()

    try{
      const user = await loginService.login({username,password})

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)
      // setBlogs(blogs.filter(blog => blog.user.username === user.username))
      // console.log(user)
      setUsername('')
      setPassword('')
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

  const handleAddBlog = async (event) => {
    event.preventDefault()

    const data = await blogService.create({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')

    setBlogs(blogs.concat(data))
    // // const showedBlogs = updatedBlogs.filter(blog => blog.user.username === user.username)
    // setBlogs(updatedBlogs.filter(blog => blog.user.username === user.username))

    setErrorMessage('New blog added successfully')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

    
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

  const blogsToShow = user !== null ? 
                    blogs.filter(blog => blog.user.username === user.username)
                    :
                    blogs

  return (
    <div>
      <h5>Notification: {errorMessage}</h5>
      {user === null ?
        <LoginForm 
        handleLogin={handleLogin}
        username={username}
        password={password}
        handleChangePassword={({ target }) => setPassword(target.value)}
        handleChangeUsername={({ target }) => setUsername(target.value)}>

        </LoginForm>
        :
        <div>
          <h2>blogs</h2>
          <h5>{user.username} logged in</h5>

          <form onSubmit={handleLogout}>
            <button type='submit'>logout</button>
          </form>

          {blogsToShow.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}

          <BlogForm
            handleAddBlog={handleAddBlog}
            title={title}
            author={author}
            url={url}
            handleChangeTitle={({ target }) => setTitle(target.value)}
            handleChangeAuthor={({ target }) => setAuthor(target.value)}
            handleChangeUrl={({ target }) => setUrl(target.value)}>

          </BlogForm>
        </div>
        
        }
    </div>
  )
}

export default App
