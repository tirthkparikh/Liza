import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Page.css'

const Page3 = () => {
  return (
    <div className="page-container">
      <div className="hearts-background">
        {[...Array(35)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 45 + 25}px`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, Math.random() * 35 - 17.5, 0],
              rotate: [0, 720],
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.4, 0.8],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            💗
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
          animate={{ 
            textShadow: [
              '0 0 20px rgba(255, 23, 68, 0.5)',
              '0 0 40px rgba(255, 23, 68, 0.8)',
              '0 0 20px rgba(255, 23, 68, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Beautiful Memories 💗
        </motion.h1>

        <motion.div
          className="photo-container"
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 1, type: 'spring' }}
        >
          <div className="photo-frame">
            <div className="photo-placeholder photo-3">
              <motion.div
                className="photo-overlay"
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  rotate: [0, 360]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <span className="photo-heart">💗</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-content"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <p className="love-paragraph">
            Every moment with you becomes a beautiful memory I treasure forever. The way you look at
            me, the way you hold my hand, the way you whisper my name—all of these moments are
            etched into my heart like precious jewels. I replay them in my mind, and each time,
            they bring me the same joy.
          </p>
          <p className="love-paragraph">
            Remember that time we laughed until our stomachs hurt? Or that quiet moment when we just
            sat together, not needing words? These memories are the threads that weave our story
            together, creating a tapestry of love that grows more beautiful with each passing day.
          </p>
          <p className="love-paragraph">
            I want to create a million more memories with you, Liza. Every sunrise, every sunset,
            every ordinary moment made extraordinary because I'm sharing it with you. These memories
            are my most precious treasures, and I can't wait to make more with you.
          </p>
        </motion.div>

        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link to="/page2" className="nav-button">
            ← Previous
          </Link>
          <Link to="/page4" className="nav-button">
            Next Page →
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Page3

