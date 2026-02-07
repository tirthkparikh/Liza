import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import MovieScene from './MovieScene'
import './Home.css'

const Home = () => {
  const navigate = useNavigate()
  const [showMovie, setShowMovie] = useState(true)

  const heartSections = [
    { id: 'dashboard', label: 'Daily Dashboard', emoji: '💕', position: { top: '15%', left: '20%' }, color: '#ff6b9d' },
    { id: 'memories', label: 'Our Memories', emoji: '📸', position: { top: '15%', right: '20%' }, color: '#ff1744' },
    { id: 'games', label: 'Love Games', emoji: '🎮', position: { top: '40%', left: '10%' }, color: '#f093fb' },
    { id: 'letters', label: 'Love Letters', emoji: '💌', position: { top: '40%', right: '10%' }, color: '#764ba2' },
    { id: 'timeline', label: 'Our Story', emoji: '📖', position: { bottom: '25%', left: '50%' }, color: '#667eea' },
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
      <div className="gif-background">
        <img src="https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif" alt="romantic" className="bg-gif" />
        <img src="https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif" alt="hearts" className="bg-gif" />
        <img src="https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif" alt="love" className="bg-gif" />
      </div>

      <div className="hearts-background">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 25}px`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
              opacity: [0.3, 0.8, 0.3],
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
        className="home-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="main-title"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Welcome to My Heart, Liza ❤️
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Your daily love companion - Click on the hearts to explore
        </motion.p>

        <div className="heart-map">
          {heartSections.map((section, index) => (
            <motion.div
              key={section.id}
              className="heart-section"
              style={section.position}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.2, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleHeartClick(section.id)}
            >
              <motion.div
                className="heart-button"
                style={{ borderColor: section.color }}
                animate={{
                  boxShadow: [
                    `0 0 20px ${section.color}40`,
                    `0 0 40px ${section.color}80`,
                    `0 0 20px ${section.color}40`,
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="heart-emoji">{section.emoji}</div>
                <div className="heart-label">{section.label}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>

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
      </motion.div>
      </div>
    </>
  )
}

export default Home
