import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Letters.css'

const Letters = () => {
  const [selectedLetter, setSelectedLetter] = useState(null)

  const loveLetters = [
    {
      id: 1,
      title: 'My Dearest Liza',
      date: 'Today',
      content: 'Every morning I wake up and think of you. Your smile, your laugh, your beautiful soul. I fall in love with you more every single day. You are my everything, my reason to smile, my heart\'s home. Forever yours, with all my love ❤️',
      type: 'love'
    },
    {
      id: 2,
      title: 'Thank You',
      date: 'Always',
      content: 'Thank you for being you. Thank you for loving me. Thank you for every moment we share together. You make my life complete in ways I never imagined possible. I\'m so grateful for you every single day 💕',
      type: 'gratitude'
    },
    {
      id: 3,
      title: 'I\'m Sorry',
      date: 'When needed',
      content: 'I know I\'m not perfect, and sometimes I make mistakes. But I want you to know that I\'m always sorry when I hurt you. Your happiness means everything to me, and I\'ll always try to be better for you. I love you more than words can say 💖',
      type: 'apology'
    },
    {
      id: 4,
      title: 'You Complete Me',
      date: 'Forever',
      content: 'Before you, I didn\'t know what I was missing. Now I can\'t imagine life without you. You complete me in every way. Your love fills all the empty spaces in my heart. Together, we are whole. Together, we are everything ❤️',
      type: 'love'
    },
  ]

  const compliments = [
    "You have the most beautiful smile in the world",
    "Your laugh is my favorite sound",
    "You make every day brighter",
    "I love how kind you are to everyone",
    "You're the most amazing person I know",
    "Your eyes sparkle like stars",
    "You have the biggest heart",
    "I'm so lucky to have you",
    "You're perfect just the way you are",
    "You make me want to be a better person",
  ]

  const [randomCompliment, setRandomCompliment] = useState('')

  const generateCompliment = () => {
    const compliment = compliments[Math.floor(Math.random() * compliments.length)]
    setRandomCompliment(compliment)
  }

  return (
    <div className="letters-container">
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
              y: [0, -50, 0],
              x: [0, Math.random() * 25 - 12.5, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.9, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            💌
          </motion.div>
        ))}
      </div>

      <motion.div
        className="letters-content"
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
          Love Letters 💌
        </motion.h1>

        {/* Compliment Generator */}
        <motion.div
          className="compliment-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2>Compliment Generator 💝</h2>
          <motion.button
            className="compliment-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateCompliment}
          >
            Get a Compliment 💕
          </motion.button>
          {randomCompliment && (
            <motion.div
              className="compliment-display"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <p>{randomCompliment} ❤️</p>
            </motion.div>
          )}
        </motion.div>

        {/* Love Letters */}
        <div className="letters-grid">
          {loveLetters.map((letter, index) => (
            <motion.div
              key={letter.id}
              className="letter-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              onClick={() => setSelectedLetter(letter)}
            >
              <div className="letter-envelope">
                <div className="letter-type">{letter.type === 'love' ? '💕' : letter.type === 'gratitude' ? '🙏' : '💖'}</div>
                <h3>{letter.title}</h3>
                <p className="letter-date">{letter.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Letter Modal */}
        {selectedLetter && (
          <motion.div
            className="letter-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedLetter(null)}
          >
            <motion.div
              className="letter-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-button" onClick={() => setSelectedLetter(null)}>
                ✕
              </button>
              <h2>{selectedLetter.title}</h2>
              <p className="letter-date-modal">{selectedLetter.date}</p>
              <div className="letter-text">
                {selectedLetter.content}
              </div>
            </motion.div>
          </motion.div>
        )}

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

export default Letters

