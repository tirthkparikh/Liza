import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import MovieScene from './MovieScene'
import './Home.css'

const Home = () => {
  const navigate = useNavigate()
  const [showMovie, setShowMovie] = useState(false)
  const [isTirthOnline, setIsTirthOnline] = useState(false)
  const [recentMessages, setRecentMessages] = useState([])
  const [unreadMessages, setUnreadMessages] = useState([])
  const [activeGames, setActiveGames] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const socket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true
    })

    socket.on('connect', () => {
      console.log('Home connected to socket')
      socket.emit('lover-join')
      socket.emit('get-status')
    })

    socket.on('tirth-status', (status) => {
      console.log('Tirth status update:', status)
      setIsTirthOnline(status.online)
    })

    socket.on('new-message', (message) => {
      setRecentMessages(prev => [message, ...prev].slice(0, 3))
    })

    return () => {
      clearInterval(timer)
      socket.disconnect()
    }
  }, [])

  const menuItems = [
    { id: 'memories', label: 'Memories', emoji: '📸', color: '#ff6b9d', description: 'Our precious moments' },
    { id: 'letters', label: 'Letters', emoji: '💌', color: '#764ba2', description: 'Love notes & messages' },
    { id: 'messages', label: 'Chat', emoji: '💬', color: '#00bcd4', description: 'Chat with Tirth', badge: unreadMessages.length },
    { id: 'timeline', label: 'Our Story', emoji: '📖', color: '#667eea', description: 'Our journey together' },
    { id: 'dates', label: 'Dates', emoji: '💕', color: '#f093fb', description: 'Special moments planned' },
    { id: 'videocall', label: 'Video Call', emoji: '📹', color: isTirthOnline ? '#4caf50' : '#9e9e9e', description: isTirthOnline ? 'Tirth is online!' : 'Call Tirth' },
    { id: 'games', label: 'Games', emoji: '🎮', color: '#9c27b0', description: 'Play together', badge: activeGames.length },
    { id: 'surprises', label: 'Surprises', emoji: '🎁', color: '#ff9800', description: 'Special surprises for you' },
    { id: 'romantic', label: 'Romantic', emoji: '🌹', color: '#ff4081', description: 'Romantic corner' },
    { id: 'lovejar', label: 'Love Jar', emoji: '🫙', color: '#ffca28', description: 'Collect love notes' },
  ]

  const handleMenuClick = (sectionId) => {
    navigate(`/${sectionId}`)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <>
      <AnimatePresence>
        {showMovie && <MovieScene onClose={() => setShowMovie(false)} />}
      </AnimatePresence>
      
      <div className="home-container">
        {/* Animated Background */}
        <div className="bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
        </div>

        {/* Top Navigation Bar */}
        <motion.div 
          className="top-nav"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="time-display">
            <span className="time">{formatTime(currentTime)}</span>
            <span className="date">{formatDate(currentTime)}</span>
          </div>
          
          <div className="tirth-status">
            <motion.div 
              className={`status-dot ${isTirthOnline ? 'online' : 'offline'}`}
              animate={isTirthOnline ? {
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>Tirth {isTirthOnline ? 'is online' : 'is offline'}</span>
          </div>

          <div className="user-avatar">
            <span>L</span>
          </div>
        </motion.div>

        <motion.div
          className="home-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Watch Movie Button */}
          <motion.div
            className="movie-button-container"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              className="watch-movie-btn"
              onClick={() => setShowMovie(true)}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 107, 157, 0.6)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-icon">🎬</span>
              <span className="btn-text">Watch Our Love Story</span>
            </motion.button>
          </motion.div>

          {/* Main Title Section */}
          <motion.div
            className="title-section"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
          >
            <motion.h1
              className="main-title"
              animate={{
                textShadow: [
                  '0 0 20px rgba(255, 107, 157, 0.5), 0 0 40px rgba(255, 107, 157, 0.3)',
                  '0 0 30px rgba(255, 107, 157, 0.8), 0 0 60px rgba(255, 107, 157, 0.5)',
                  '0 0 20px rgba(255, 107, 157, 0.5), 0 0 40px rgba(255, 107, 157, 0.3)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Welcome to My Heart
              <motion.span 
                className="heart-emoji-title"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 15, -15, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ❤️
              </motion.span>
            </motion.h1>
            <motion.h2 className="subtitle-name">
              Liza
            </motion.h2>
          </motion.div>

          <motion.p
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Your daily love companion 💕
          </motion.p>

          {/* Menu Grid - Responsive Layout */}
          <motion.div 
            className="menu-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="menu-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMenuClick(item.id)}
              >
                {item.badge > 0 && (
                  <span className="menu-badge">{item.badge}</span>
                )}
                <div 
                  className="menu-icon"
                  style={{ backgroundColor: `${item.color}20`, color: item.color }}
                >
                  {item.emoji}
                </div>
                <h3 className="menu-label">{item.label}</h3>
                <p className="menu-description">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Daily Quote */}
          <motion.div
            className="daily-quote-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="quote-icon">💭</div>
            <p className="daily-quote">
              "In your eyes, I found my home. In your heart, I found my love."
            </p>
            <span className="quote-author">— Your Tirth 💕</span>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="footer-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <p>Made with endless love for you 💕</p>
            <p className="copyright">© {currentTime.getFullYear()} Liza & Tirth</p>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export default Home