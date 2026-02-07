import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Page.css'

const Page5 = () => {
  return (
    <div className="page-container">
      <div className="hearts-background">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 60 + 40}px`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              rotate: [0, 1440],
              opacity: [0.1, 1, 0.1],
              scale: [0.5, 1.8, 0.5],
            }}
            transition={{
              duration: 8 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            💞
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
          className="page-title final-title"
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Forever Yours 💞
        </motion.h1>

        <motion.div
          className="photo-container"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100, damping: 10 }}
        >
          <div className="photo-frame glow">
            <div className="photo-placeholder photo-5">
              <motion.div
                className="photo-overlay"
                animate={{ 
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.3, 1],
                  rotate: [0, 360],
                  borderRadius: ['50%', '30%', '50%']
                }}
                transition={{ duration: 8, repeat: Infinity }}
              >
                <span className="photo-heart">💞</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 2 }}
        >
          <p className="love-paragraph final-paragraph">
            Forever is a long time, but with you, it doesn't feel long enough. I want to spend
            every moment of forever loving you, cherishing you, and making you happy. You are not
            just my today or my tomorrow—you are my always, my forever, my everything.
          </p>
          <p className="love-paragraph final-paragraph">
            In your eyes, I found my home. In your heart, I found my peace. In your love, I found
            my purpose. There is no one else I would rather spend forever with. You complete me in
            ways I never knew I was incomplete.
          </p>
          <p className="love-paragraph final-paragraph">
            So here's to forever, Liza. Here's to all the days ahead, all the memories we'll create,
            all the love we'll share. I am yours, completely and forever. And I wouldn't have it
            any other way. I love you more than words can express, more than time can measure,
            more than forever can hold.
          </p>
        </motion.div>

        <motion.div
          className="final-hearts"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[...Array(10)].map((_, i) => (
            <motion.span
              key={i}
              className="final-heart"
              style={{
                fontSize: '3em',
                margin: '0 10px',
              }}
              animate={{
                scale: [1, 1.5, 1],
                rotate: [0, 360],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              ❤️
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <Link to="/page4" className="nav-button">
            ← Previous
          </Link>
          <Link to="/" className="nav-button">
            Back to Home ❤️
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Page5

