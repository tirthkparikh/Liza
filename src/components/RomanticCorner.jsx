import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './RomanticCorner.css'

const RomanticCorner = () => {
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  
  const [currentQuote, setCurrentQuote] = useState(0)
  const [giftAnimation, setGiftAnimation] = useState(null)
  const [selectedMood, setSelectedMood] = useState(null)
  const [showDateIdea, setShowDateIdea] = useState(false)
  const [currentDateIdea, setCurrentDateIdea] = useState('')

  // Set your relationship start date here!
  const relationshipStartDate = new Date('2025-02-23') // Change this to your actual date

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const diff = now - relationshipStartDate
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeTogether({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const loveQuotes = [
    { text: "I saw that you were perfect, and so I loved you. Then I saw that you were not perfect and I loved you even more.", author: "Angelita Lim" },
    { text: "You are my sun, my moon, and all my stars.", author: "E.E. Cummings" },
    { text: "I love you not because of who you are, but because of who I am when I am with you.", author: "Roy Croft" },
    { text: "If I know what love is, it is because of you.", author: "Hermann Hesse" },
    { text: "You are the finest, loveliest, tenderest, and most beautiful person I have ever known—and even that is an understatement.", author: "F. Scott Fitzgerald" },
    { text: "I would rather spend one lifetime with you, than face all the ages of this world alone.", author: "J.R.R. Tolkien" },
    { text: "To the world you may be one person, but to one person you are the world.", author: "Bill Wilson" },
    { text: "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.", author: "Maya Angelou" },
    { text: "I love you more than yesterday, less than tomorrow.", author: "Edmond Rostand" },
    { text: "You are my today and all of my tomorrows.", author: "Leo Christopher" }
  ]

  const dateIdeas = [
    "🌅 Watch the sunrise together with hot chocolate",
    "🎨 Have a paint night at home with wine",
    "🌟 Stargaze in the backyard with blankets",
    "🍳 Cook breakfast together in pajamas",
    "🎬 Have a movie marathon with all your favorites",
    "🎵 Create a playlist of songs that remind you of each other",
    "🌸 Visit a botanical garden or flower market",
    "📸 Take silly photos together at a photo booth",
    "🎪 Go to a carnival or amusement park",
    "🍕 Have a pizza making competition at home",
    "🎭 Watch a sunset at the beach with your favorite snacks",
    "🎤 Have a karaoke night just for two",
    "🌳 Go on a nature hike and pack a picnic",
    "🎨 Visit an art gallery or museum together",
    "🎳 Go bowling and make silly bets",
    "🍿 Build a blanket fort and watch movies",
    "🎸 Write a song or poem for each other",
    "🌮 Have a taco Tuesday date night",
    "🎡 Go on a Ferris wheel at sunset",
    "💌 Write love letters and read them to each other"
  ]

  const moods = [
    { emoji: '😍', label: 'Loved', color: '#ff6b9d' },
    { emoji: '🥰', label: 'Happy', color: '#ffd93d' },
    { emoji: '😊', label: 'Good', color: '#6bcf7f' },
    { emoji: '🥺', label: 'Missing You', color: '#a8e6cf' },
    { emoji: '❤️', label: 'Romantic', color: '#ff1744' },
    { emoji: '🤗', label: 'Grateful', color: '#ff8b94' }
  ]

  const sendVirtualGift = (gift) => {
    setGiftAnimation(gift)
    setTimeout(() => setGiftAnimation(null), 3000)
  }

  const generateDateIdea = () => {
    const randomIdea = dateIdeas[Math.floor(Math.random() * dateIdeas.length)]
    setCurrentDateIdea(randomIdea)
    setShowDateIdea(true)
  }

  return (
    <div className="romantic-corner-container">
      <div className="hearts-background">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart-bg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 20}px`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            💕
          </motion.div>
        ))}
      </div>

      <motion.div
        className="romantic-content"
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
          Our Romantic Corner 💕
        </motion.h1>

        {/* Love Timer */}
        <motion.div
          className="romantic-card love-timer"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>⏰ Time Together</h2>
          <div className="timer-display">
            <div className="time-unit">
              <span className="time-number">{timeTogether.days}</span>
              <span className="time-label">Days</span>
            </div>
            <div className="time-unit">
              <span className="time-number">{timeTogether.hours}</span>
              <span className="time-label">Hours</span>
            </div>
            <div className="time-unit">
              <span className="time-number">{timeTogether.minutes}</span>
              <span className="time-label">Minutes</span>
            </div>
            <div className="time-unit">
              <span className="time-number">{timeTogether.seconds}</span>
              <span className="time-label">Seconds</span>
            </div>
          </div>
          <p className="since-date">Since {relationshipStartDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </motion.div>

        {/* Daily Love Quote */}
        <motion.div
          className="romantic-card quote-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2>💌 Daily Love Quote</h2>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentQuote}
              className="quote-content"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <p className="quote-text">"{loveQuotes[currentQuote].text}"</p>
              <p className="quote-author">— {loveQuotes[currentQuote].author}</p>
            </motion.div>
          </AnimatePresence>
          <div className="quote-navigation">
            <button 
              onClick={() => setCurrentQuote((prev) => (prev - 1 + loveQuotes.length) % loveQuotes.length)}
              className="quote-btn"
            >
              ← Previous
            </button>
            <span className="quote-counter">{currentQuote + 1} / {loveQuotes.length}</span>
            <button 
              onClick={() => setCurrentQuote((prev) => (prev + 1) % loveQuotes.length)}
              className="quote-btn"
            >
              Next →
            </button>
          </div>
        </motion.div>

        {/* Virtual Gifts */}
        <motion.div
          className="romantic-card gifts-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2>🎁 Send a Virtual Gift</h2>
          <div className="gifts-grid">
            {[
              { emoji: '🌹', name: 'Roses', message: 'Sending you a dozen virtual roses! 🌹' },
              { emoji: '🍫', name: 'Chocolates', message: 'Sweet chocolates for my sweet love! 🍫' },
              { emoji: '💝', name: 'Heart', message: 'My heart belongs to you! 💝' },
              { emoji: '🧸', name: 'Teddy', message: 'A cuddly teddy bear hug! 🧸' },
              { emoji: '💋', name: 'Kiss', message: 'Sending you a million kisses! 💋' },
              { emoji: '🌟', name: 'Stars', message: 'You\'re my shining star! 🌟' }
            ].map((gift, index) => (
              <motion.button
                key={index}
                className="gift-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => sendVirtualGift(gift)}
              >
                <span className="gift-emoji">{gift.emoji}</span>
                <span className="gift-name">{gift.name}</span>
              </motion.button>
            ))}
          </div>
          
          <AnimatePresence>
            {giftAnimation && (
              <motion.div
                className="gift-animation"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="gift-emoji-large">{giftAnimation.emoji}</div>
                <p className="gift-message">{giftAnimation.message}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mood Tracker */}
        <motion.div
          className="romantic-card mood-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2>💭 How Are You Feeling?</h2>
          <div className="mood-grid">
            {moods.map((mood, index) => (
              <motion.button
                key={index}
                className={`mood-btn ${selectedMood === index ? 'selected' : ''}`}
                style={{ 
                  background: selectedMood === index ? mood.color : 'white',
                  borderColor: mood.color 
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMood(index)}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </motion.button>
            ))}
          </div>
          {selectedMood !== null && (
            <motion.p
              className="mood-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              You are feeling {moods[selectedMood].label.toLowerCase()}! 💕
            </motion.p>
          )}
        </motion.div>

        {/* Date Ideas Generator */}
        <motion.div
          className="romantic-card date-ideas-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2>💡 Date Ideas Generator</h2>
          <p className="date-ideas-subtitle">Never run out of things to do together!</p>
          
          <motion.button
            className="generate-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateDateIdea}
          >
            ✨ Generate Date Idea
          </motion.button>

          <AnimatePresence>
            {showDateIdea && (
              <motion.div
                className="date-idea-display"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <p className="date-idea-text">{currentDateIdea}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link to="/" className="nav-button">
            ← Back to Heart Map
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default RomanticCorner
