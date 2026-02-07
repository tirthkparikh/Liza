import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Surprises.css'

const Surprises = () => {
  const [surprise, setSurprise] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const surprises = [
    {
      type: 'message',
      content: 'I love you more than all the stars in the sky ✨',
      emoji: '💕'
    },
    {
      type: 'compliment',
      content: 'You are the most beautiful person I know, inside and out 🌹',
      emoji: '💖'
    },
    {
      type: 'promise',
      content: 'I promise to love you every single day, forever and always 💍',
      emoji: '💝'
    },
    {
      type: 'memory',
      content: 'Remember when we laughed until we cried? Those are my favorite moments with you 😊',
      emoji: '💗'
    },
    {
      type: 'future',
      content: 'I can\'t wait to create a million more memories with you. Our future together is going to be amazing! 🌟',
      emoji: '💞'
    },
  ]

  const generateSurprise = () => {
    const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)]
    setSurprise(randomSurprise)
    setRevealed(false)
    
    setTimeout(() => {
      setRevealed(true)
    }, 500)
  }

  return (
    <div className="surprises-container">
      <div className="hearts-background">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 45 + 30}px`,
            }}
            animate={{
              y: [0, -70, 0],
              x: [0, Math.random() * 35 - 17.5, 0],
              rotate: [0, 720],
              opacity: [0.1, 1, 0.1],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            🎁
          </motion.div>
        ))}
      </div>

      <motion.div
        className="surprises-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="page-title"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          Surprise Box 🎁
        </motion.h1>

        <motion.p
          className="page-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Click the button to reveal a surprise!
        </motion.p>

        <motion.button
          className="surprise-button"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={generateSurprise}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          🎁 Open Surprise 🎁
        </motion.button>

        <AnimatePresence>
          {surprise && (
            <motion.div
              className="surprise-box"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {!revealed ? (
                <motion.div
                  className="surprise-wrapping"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🎁
                </motion.div>
              ) : (
                <motion.div
                  className="surprise-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="surprise-emoji">{surprise.emoji}</div>
                  <p className="surprise-text">{surprise.content}</p>
                  <motion.button
                    className="another-surprise"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateSurprise}
                  >
                    Another Surprise? 🎁
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link to="/" className="nav-button">
            ← Back to Heart Map
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Surprises

