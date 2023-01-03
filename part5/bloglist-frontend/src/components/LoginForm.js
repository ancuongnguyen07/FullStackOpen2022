import { useState} from 'react'
// import loginService from '../services/login'

const LoginForm = ({login}) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleChangeUsername = (event) => {
        setUsername(event.target.value)
    }

    const handleChangePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleLogin = (event) => {
        event.preventDefault()
        
        login({username, password})

        setUsername('')
        setPassword('')
    }

    return (
        <div>
        <h3>Login to application</h3>
        <form onSubmit={handleLogin}>
            <div>
                Username
                    <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={handleChangeUsername}
                    />
            </div>
            <div>
                Password
                    <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={handleChangePassword}
                    />
            </div>
            <button type='submit'>login</button>
        </form>
        </div>
    )
}

export default LoginForm