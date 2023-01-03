import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteFrom'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // console.log(blogs.map(blog => blog.user.id))

  const handleLogin = async (event) => {
    event.preventDefault()

    try{
      const user = await loginService.login({username,password})
      setUser(user)
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

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  return (
    <div>
      <h5>Notification: {errorMessage}</h5>
      {user === null ?
        <LoginForm 
        handleLogin={handleLogin}
        username={username}
        password={password}
        handleChangePassword={({ target }) => setPassword(target.value)}
        handleChangeUsername={({ target }) => setUsername(target.value)}></LoginForm>
        :
        <div>
          <h2>blogs</h2>
          {blogs.filter(blog => blog.user.username === user.username).map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>}
    </div>
  )
}

export default App
