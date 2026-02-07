import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Page.css'

const Page2 = () => {
  return (
    <div className="page-container">
      <div className="hearts-background">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 40 + 20}px`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              rotate: [0, 360],
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            💖
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
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          Why I Love You 💖
        </motion.h1>

        <motion.div
          className="photo-container"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
        >
          <div className="photo-frame glow">
            <div className="photo-placeholder photo-2">
              <motion.div
                className="photo-overlay"
                animate={{ 
                  opacity: [0.4, 0.9, 0.4],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="photo-heart">💖</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <p className="love-paragraph">
            I love you because of the way you make me feel—alive, complete, and utterly happy. Your
            kindness touches everyone around you, and your compassion knows no bounds. You see the
            beauty in everything, even when I can't, and you help me see it too.
          </p>
          <p className="love-paragraph">
            I love your smile that can light up the darkest days. I love your laugh that makes my
            heart skip a beat. I love the way you care, the way you love, the way you simply exist
            in this world. You are my anchor, my safe harbor, my home.
          </p>
          <p className="love-paragraph">
            I love you for your strength and your vulnerability. I love you for your dreams and your
            fears. I love every part of you—the perfect and the imperfect, because together they
            make you uniquely, beautifully, wonderfully you. And that's why I love you, Liza.
          </p>
        </motion.div>

        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link to="/page1" className="nav-button">
            ← Previous
          </Link>
          <Link to="/page3" className="nav-button">
            Next Page →
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Page2

