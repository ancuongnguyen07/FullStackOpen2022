// import { useState, useEffect} from 'react'
// import loginService from '../services/login'

const LoginForm = ({handleLogin, username, password,
    handleChangeUsername, handleChangePassword}) => {

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