import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Forever.css'

const Forever = () => {
  const promises = [
    "I promise to love you every single day",
    "I promise to make you smile always",
    "I promise to be your best friend",
    "I promise to support all your dreams",
    "I promise to cherish every moment",
    "I promise to grow old with you",
    "I promise my heart belongs only to you",
    "I promise forever and always"
  ]

  return (
    <div className="forever-container">
      <div className="hearts-background">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 50 + 30}px`,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.random() * 40 - 20, 0],
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
            💞
          </motion.div>
        ))}
      </div>

      <motion.div
        className="forever-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="page-title"
          animate={{ 
            scale: [1, 1.1, 1],
            textShadow: [
              '0 0 30px rgba(255, 23, 68, 0.8)',
              '0 0 60px rgba(255, 23, 68, 1)',
              '0 0 30px rgba(255, 23, 68, 0.8)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Forever Yours 💞
        </motion.h1>

        <motion.div
          className="promises-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {promises.map((promise, index) => (
            <motion.div
              key={index}
              className="promise-card"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="promise-heart">❤️</span>
              <p>{promise}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="final-message"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}
        >
          <h2>I love you more than words can express, Liza</h2>
          <p>Forever and always, you are my everything 💕</p>
        </motion.div>

        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <Link to="/" className="nav-button">
            ← Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Forever

