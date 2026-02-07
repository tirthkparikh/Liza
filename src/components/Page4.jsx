import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Page.css'

const Page4 = () => {
  return (
    <div className="page-container">
      <div className="hearts-background">
        {[...Array(40)].map((_, i) => (
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
              y: [0, -70, 0],
              x: [0, Math.random() * 40 - 20, 0],
              rotate: [0, 1080],
              opacity: [0.1, 1, 0.1],
              scale: [0.7, 1.5, 0.7],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            💝
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
            scale: [1, 1.1, 1],
            color: ['#fff', '#ff1744', '#fff']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          My Promise to You 💝
        </motion.h1>

        <motion.div
          className="photo-container"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 50 }}
        >
          <div className="photo-frame pulse">
            <div className="photo-placeholder photo-4">
              <motion.div
                className="photo-overlay"
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <span className="photo-heart">💝</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-content"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <p className="love-paragraph">
            I promise to love you with all my heart, every single day. I promise to be your partner,
            your friend, your biggest supporter. I promise to stand by you through every storm and
            celebrate with you in every moment of joy. You will never have to face anything alone
            because I will always be here.
          </p>
          <p className="love-paragraph">
            I promise to make you smile, to make you laugh, to make you feel loved beyond measure.
            I promise to listen, to understand, to care. I promise to grow with you, to learn with
            you, to build beautiful dreams together. Your happiness will always be my priority.
          </p>
          <p className="love-paragraph">
            Most of all, Liza, I promise to be true to you and to our love. I promise to cherish
            every moment we share and to never take you for granted. This is my promise to you,
            sealed with all my love, forever and always.
          </p>
        </motion.div>

        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link to="/page3" className="nav-button">
            ← Previous
          </Link>
          <Link to="/page5" className="nav-button">
            Next Page →
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Page4

