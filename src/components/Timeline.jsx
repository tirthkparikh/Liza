import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Timeline.css'

const Timeline = () => {
  const chapters = [
    {
      id: 1,
      title: 'Chapter 1: How We Met',
      date: 'The Beginning',
      content: 'The moment I first saw you, I knew something special was about to happen. Your smile, your energy, everything about you drew me in. It was like the universe conspired to bring us together.',
      emoji: '💕'
    },
    {
      id: 2,
      title: 'Chapter 2: Falling for You',
      date: 'The Realization',
      content: 'Every conversation, every laugh, every moment together made me realize I was falling in love. Not slowly, but all at once. You became my favorite person, my best friend, my everything.',
      emoji: '💖'
    },
    {
      id: 3,
      title: 'Chapter 3: Our First Adventure',
      date: 'Dubai',
      content: 'Our trip to Dubai was magical. Exploring new places together, creating memories that would last forever. Every moment with you feels like an adventure, and I never want it to end.',
      emoji: '🌴'
    },
    {
      id: 4,
      title: 'Chapter 4: Paradise Found',
      date: 'Mauritius',
      content: 'Mauritius showed me what paradise really looks like - and it\'s anywhere you are. The beaches were beautiful, but nothing compared to watching you smile in the sunset. You are my paradise.',
      emoji: '🏝️'
    },
    {
      id: 5,
      title: 'Chapter 5: Forever Yours',
      date: 'Always',
      content: 'Now and forever, I choose you. Every day, every moment, every breath. You are my past, my present, and my future. I love you more than words can express, Liza.',
      emoji: '💞'
    },
  ]

  return (
    <div className="timeline-container">
      <div className="hearts-background">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 40 + 25}px`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, Math.random() * 30 - 15, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.9, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            📖
          </motion.div>
        ))}
      </div>

      <motion.div
        className="timeline-content"
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
          Our Love Story 📖
        </motion.h1>

        <div className="timeline">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              className="timeline-item"
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className={`timeline-content-box ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="chapter-emoji">{chapter.emoji}</div>
                <h2>{chapter.title}</h2>
                <p className="chapter-date">{chapter.date}</p>
                <p className="chapter-text">{chapter.content}</p>
              </div>
              <div className="timeline-dot" />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Link to="/" className="nav-button">
            ← Back to Heart Map
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Timeline

