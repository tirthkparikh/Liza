import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './Login.css'

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [showError, setShowError] = useState(false)
  const [inputFocused, setInputFocused] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (username === 'liza' && password === 'iLoveLiza') {
      setIsAuthenticated(true)
      navigate('/')
    } else {
      setError(true)
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
        setError(false)
      }, 5000)
    }
  }

  return (
    <div className="login-container">
      {/* Simple gradient background with subtle hearts */}
      <div className="hearts-background">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`heart-${i}`}
            className="floating-heart"
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 25 + 20}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 15 - 7.5, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <motion.div
        className="login-box"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="heart-title"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <h1>💕 For My Love Liza 💕</h1>
          <p className="cute-subtitle">Enter with love in your heart ✨</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="login-form">
          <motion.div
            className="input-group"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label>💖 Username 💖</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name..."
                className={error ? 'error-input shake' : ''}
                onFocus={() => setInputFocused('username')}
                onBlur={() => setInputFocused(null)}
              />
              {username && !error && <span className="input-check">✅</span>}
            </div>
          </motion.div>

          <motion.div
            className="input-group"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label>🔒 Password 🔒</label>
            <div className="input-wrapper">
              <span className="input-icon">🔐</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the secret..."
                className={error ? 'error-input shake' : ''}
                onFocus={() => setInputFocused('password')}
                onBlur={() => setInputFocused(null)}
              />
              {password && !error && <span className="input-check">✅</span>}
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="login-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            💝 Enter My Heart 💝
          </motion.button>
        </form>

        <AnimatePresence>
          {showError && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h2>💔 You are NOT my love 💔</h2>
              <p>You are NOT welcome here! 🚫</p>
              <div className="broken-hearts">
                {[...Array(10)].map((_, i) => (
                  <motion.span
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      fontSize: '25px',
                    }}
                    animate={{
                      y: [0, -100],
                      x: [0, (Math.random() - 0.5) * 200],
                      rotate: [0, 360],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                    }}
                  >
                    💔
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Login
