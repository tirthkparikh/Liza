import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Page.css'

const Page1 = () => {
  return (
    <div className="page-container">
      <div className="hearts-background">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 35 + 25}px`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 25 - 12.5, 0],
              rotate: [0, 360],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            💕
          </motion.div>
        ))}
      </div>

      <motion.div
        className="page-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="page-title"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          Our First Meeting 💕
        </motion.h1>

        <motion.div
          className="photo-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <div className="photo-frame pulse">
            <div className="photo-placeholder photo-1">
              <motion.div
                className="photo-overlay"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="photo-heart">💕</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <p className="love-paragraph">
            The moment I first saw you, time seemed to stand still. Your smile lit up the entire room,
            and I knew in that instant that something magical was about to happen. Your eyes sparkled
            like stars, and your laughter was the most beautiful melody I had ever heard.
          </p>
          <p className="love-paragraph">
            That first meeting changed everything. I felt a connection so deep, so profound, that it
            took my breath away. You weren't just beautiful—you were everything I never knew I was
            searching for. Every word you spoke, every gesture you made, captured my heart completely.
          </p>
          <p className="love-paragraph">
            From that day forward, I knew my life would never be the same. You became my sunshine,
            my inspiration, my reason to smile every single day. Thank you for that first meeting,
            Liza. It was the beginning of the most beautiful love story.
          </p>
        </motion.div>

        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link to="/" className="nav-button">
            ← Home
          </Link>
          <Link to="/page2" className="nav-button">
            Next Page →
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Page1

