import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import MovieScene from './MovieScene'
import './Home.css'

const Home = () => {
  const navigate = useNavigate()
  const [showMovie, setShowMovie] = useState(false)

  const heartSections = [
    // Top curve - left side
    {
      id: 'memories',
      label: 'Memories',
      emoji: '📸',
      position: { top: '5%', left: '15%' },
      color: '#ff6b9d',
    },
    // Top curve - center left
    {
      id: 'letters',
      label: 'Letters',
      emoji: '💌',
      position: { top: '0%', left: '35%' },
      color: '#764ba2',
    },
    // Top curve - center
    {
      id: 'timeline',
      label: 'Our Story',
      emoji: '📖',
      position: { top: '5%', left: '55%' },
      color: '#667eea',
    },
    // Top curve - right
    {
      id: 'dates',
      label: 'Dates',
      emoji: '💕',
      position: { top: '15%', left: '75%' },
      color: '#f093fb',
    },
    // Right side - Video Call
    {
      id: 'videocall',
      label: 'Video Call',
      emoji: '📹',
      position: { top: '35%', left: '82%' },
      color: '#4caf50',
    },
    // Right side curve - Games
    {
      id: 'games',
      label: 'Games',
      emoji: '🎮',
      position: { top: '55%', left: '75%' },
      color: '#9c27b0',
    },
    // Bottom right
    {
      id: 'surprises',
      label: 'Surprises',
      emoji: '🎁',
      position: { top: '70%', left: '60%' },
      color: '#ff9800',
    },
    // Bottom left
    {
      id: 'romantic',
      label: 'Romantic',
      emoji: '🌹',
      position: { top: '70%', left: '30%' },
      color: '#ff4081',
    },
    // Bottom tip
    {
      id: 'lovejar',
      label: 'Love Jar',
      emoji: '🫙',
      position: { bottom: '8%', left: '50%', transform: 'translateX(-50%)' },
      color: '#ffca28',
    },
  ]

  const handleHeartClick = (sectionId) => {
    navigate(`/${sectionId}`)
  }

  return (
    <>
      <AnimatePresence>
        {showMovie && <MovieScene onClose={() => setShowMovie(false)} />}
      </AnimatePresence>
      <div className="home-container">
        {/* Animated Background Orbs */}
        <div className="bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>

        {/* Floating Hearts */}
        <div className="floating-hearts">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-heart"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 30 + 20}px`,
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, Math.random() * 30 - 15, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              {['❤️', '💕', '💖', '💗', '💓', '💝'][i % 6]}
            </motion.div>
          ))}
        </div>

        {/* Sparkles */}
        <div className="sparkles">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>

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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎬 Watch Our Love Story
            </motion.button>
          </motion.div>

          {/* Title */}
          <motion.div
            className="title-section"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <motion.h1
              className="main-title"
              animate={{
                textShadow: [
                  '0 0 20px rgba(255, 20, 147, 0.5)',
                  '0 0 40px rgba(255, 20, 147, 0.8)',
                  '0 0 20px rgba(255, 20, 147, 0.5)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Welcome to My Heart, Liza
            </motion.h1>
            <motion.span 
              className="heart-emoji"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ❤️
            </motion.span>
          </motion.div>

          <motion.p
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Your daily love companion - Click on the hearts to explore
          </motion.p>

          {/* Heart Map Navigation */}
          <div className="heart-map">
            {heartSections.map((section, index) => (
              <motion.div
                key={section.id}
                className="heart-section"
                style={section.position}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.15, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleHeartClick(section.id)}
              >
                <motion.div
                  className="heart-button"
                  style={{ 
                    borderColor: section.color,
                    background: `linear-gradient(135deg, white 0%, ${section.color}20 100%)`
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 20px ${section.color}40`,
                      `0 0 40px ${section.color}80`,
                      `0 0 20px ${section.color}40`,
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="heart-emoji-icon">{section.emoji}</div>
                  <div className="heart-label">{section.label}</div>
                </motion.div>
              </motion.div>
            ))}

            {/* Center Heart */}
            <motion.div
              className="central-heart"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              💖
            </motion.div>
          </div>

          {/* Daily Quote */}
          <motion.div
            className="daily-quote"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <p>"In your eyes, I found my home. In your heart, I found my love." 💕</p>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="footer-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <p>Made with endless love for you 💕</p>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export default Home
