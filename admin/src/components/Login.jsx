import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css'

const Login = ({ onLogin, API_URL }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login'
      const response = await axios.post(`${API_URL}${endpoint}`, {
        username,
        password
      })

      onLogin(response.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Admin Panel 🔐</h1>
        <p className="subtitle">
          {isRegistering ? 'Register Admin Account' : 'Login to Admin Panel'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="submit-btn">
            {isRegistering ? 'Register' : 'Login'}
          </button>

          <button
            type="button"
            className="toggle-btn"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Already have an account? Login' : 'First time? Register'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

