import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Games.css'

const Games = () => {
  const [activeGame, setActiveGame] = useState(null)
  const [kissCount, setKissCount] = useState(0)
  const [scratchRevealed, setScratchRevealed] = useState(false)
  const [wheelResult, setWheelResult] = useState(null)
  const [quizQuestion, setQuizQuestion] = useState(0)
  const [quizAnswer, setQuizAnswer] = useState('')
  const [memoryCards, setMemoryCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [gameImages, setGameImages] = useState([])

  // Load images for games
  useEffect(() => {
    const dubaiImages = [
      'BFMJ2740', 'CGWZ3256', 'CKMV4869', 'FKND9979', 'FNLU7930', 'HNEW8061',
      'IMG_0061', 'IMG_0191', 'IMG_0196', 'IMG_0197', 'IMG_0301', 'IMG_0302'
    ]
    
    const mauritiusImages = [
      'IMG_8045', 'IMG_8046', 'IMG_8047', 'IMG_8048', 'IMG_8058', 'IMG_8059'
    ]

    const allImages = [
      ...dubaiImages.map(name => `/assets/images/Dubai/${name}.JPG`),
      ...mauritiusImages.map(name => `/assets/images/Maur/${name}.JPG`)
    ]
    setGameImages(allImages.sort(() => Math.random() - 0.5))
  }, [])

  const games = [
    { id: 'quiz', title: 'Love Quiz', emoji: '❓', color: '#ff6b9d' },
    { id: 'memory', title: 'Memory Cards', emoji: '🃏', color: '#ff1744' },
    { id: 'wheel', title: 'Spin the Wheel', emoji: '🎡', color: '#f093fb' },
    { id: 'scratch', title: 'Scratch Card', emoji: '🎫', color: '#764ba2' },
    { id: 'heartbeat', title: 'Heartbeat Tap', emoji: '💓', color: '#667eea' },
  ]

  const quizQuestions = [
    { q: "Who said 'I love you' first?", a: "you", options: ["You", "Me", "Both at same time", "Still waiting"] },
    { q: "Where was our first date?", a: "restaurant", options: ["Restaurant", "Beach", "Park", "Coffee shop"] },
    { q: "What's my favorite thing about you?", a: "everything", options: ["Your smile", "Your laugh", "Everything", "Your eyes"] },
  ]

  const wheelOptions = [
    "Send me a voice note 🎧",
    "I owe you a kiss 😘",
    "Late night call today 📞",
    "Surprise date this week 💕",
    "Write me a love letter 💌",
    "Cook together tonight 🍳",
    "Dance in the living room 💃",
    "Watch sunset together 🌅",
  ]

  const scratchMessages = [
    "You're the most beautiful person I know 💖",
    "I fall in love with you more every day 🌹",
    "Your smile lights up my world ✨",
    "I'm so lucky to have you ❤️",
    "You make every day better 🌟",
  ]

  const memoryCardPairs = [
    { id: 1, emoji: '💕', message: 'Our first kiss', image: gameImages[0] },
    { id: 2, emoji: '🌴', message: 'Dubai adventure', image: gameImages[1] },
    { id: 3, emoji: '🏝️', message: 'Mauritius paradise', image: gameImages[2] },
    { id: 4, emoji: '🌹', message: 'Romantic dinner', image: gameImages[3] },
    { id: 5, emoji: '💍', message: 'Special moment', image: gameImages[4] },
    { id: 6, emoji: '🌅', message: 'Sunset together', image: gameImages[5] },
  ]

  const initMemoryGame = () => {
    const cards = [...memoryCardPairs, ...memoryCardPairs]
      .map((card, i) => ({ ...card, uniqueId: i, flipped: false }))
      .sort(() => Math.random() - 0.5)
    setMemoryCards(cards)
    setFlippedCards([])
    setMatchedPairs([])
  }

  const handleCardFlip = (card) => {
    if (flippedCards.length === 2 || matchedPairs.includes(card.id)) return

    const newFlipped = [...flippedCards, card.uniqueId]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped.map(id => memoryCards.find(c => c.uniqueId === id))
      if (first.id === second.id) {
        setMatchedPairs([...matchedPairs, first.id])
        setTimeout(() => {
          setFlippedCards([])
          if (matchedPairs.length + 1 === memoryCardPairs.length) {
            alert('Perfect match! We complete each other! ❤️')
          }
        }, 1000)
      } else {
        setTimeout(() => setFlippedCards([]), 1500)
      }
    }
  }

  const spinWheel = () => {
    const result = wheelOptions[Math.floor(Math.random() * wheelOptions.length)]
    setWheelResult(result)
  }

  const handleQuizSubmit = () => {
    const correct = quizAnswer.toLowerCase().includes(quizQuestions[quizQuestion].a.toLowerCase())
    if (correct) {
      alert('Correct! You know me so well! 💖')
      if (quizQuestion < quizQuestions.length - 1) {
        setQuizQuestion(quizQuestion + 1)
        setQuizAnswer('')
      } else {
        alert('Perfect score! You know everything about us! ❤️')
        setActiveGame(null)
      }
    } else {
      alert('Wrong answer! 😄 But I still love you! 💕')
    }
  }

  const renderGame = () => {
    switch (activeGame) {
      case 'quiz':
        return (
          <div className="game-content">
            <h2>Love Quiz ❓</h2>
            <div className="quiz-box">
              <p className="quiz-question">{quizQuestions[quizQuestion].q}</p>
              <div className="quiz-options">
                {quizQuestions[quizQuestion].options.map((opt, i) => (
                  <motion.button
                    key={i}
                    className="quiz-option"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setQuizAnswer(opt)
                      setTimeout(() => handleQuizSubmit(), 100)
                    }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </div>
            <button className="back-button" onClick={() => { setActiveGame(null); setQuizQuestion(0) }}>
              ← Back to Games
            </button>
          </div>
        )

      case 'memory':
        if (memoryCards.length === 0) initMemoryGame()
        return (
          <div className="game-content">
            <h2>Memory Card Game 🃏</h2>
            <p className="game-instruction">Match the pairs to reveal our memories!</p>
            <div className="memory-grid">
              {memoryCards.map((card) => {
                const isFlipped = flippedCards.includes(card.uniqueId) || matchedPairs.includes(card.id)
                return (
                  <motion.div
                    key={card.uniqueId}
                    className={`memory-card ${isFlipped ? 'flipped' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCardFlip(card)}
                  >
                    <div className="card-front">?</div>
                    <div className="card-back">
                      {card.image ? (
                        <img src={card.image} alt={card.message} className="card-image" />
                      ) : (
                        <div className="card-emoji">{card.emoji}</div>
                      )}
                      <div className="card-message">{card.message}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <button className="back-button" onClick={() => { setActiveGame(null); setMemoryCards([]) }}>
              ← Back to Games
            </button>
          </div>
        )

      case 'wheel':
        return (
          <div className="game-content">
            <h2>Spin the Wheel 🎡</h2>
            <div className="wheel-container">
              <motion.div
                className="wheel"
                animate={wheelResult ? { rotate: 360 * 5 + Math.random() * 360 } : {}}
                transition={{ duration: 3, ease: 'easeOut' }}
              >
                {wheelOptions.map((opt, i) => (
                  <div key={i} className="wheel-segment" style={{ transform: `rotate(${i * 45}deg)` }}>
                    {opt}
                  </div>
                ))}
              </motion.div>
              <button className="spin-button" onClick={spinWheel}>
                Spin! 🎡
              </button>
              {wheelResult && (
                <motion.div
                  className="wheel-result"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <h3>Result:</h3>
                  <p>{wheelResult}</p>
                </motion.div>
              )}
            </div>
            <button className="back-button" onClick={() => { setActiveGame(null); setWheelResult(null) }}>
              ← Back to Games
            </button>
          </div>
        )

      case 'scratch':
        return (
          <div className="game-content">
            <h2>Scratch to Reveal 🎫</h2>
            <p className="game-instruction">Click and drag to scratch!</p>
            <div className="scratch-card-container">
              <div className="scratch-card">
                <div 
                  className={`scratch-overlay ${scratchRevealed ? 'revealed' : ''}`}
                  onMouseDown={() => setScratchRevealed(true)}
                  onTouchStart={() => setScratchRevealed(true)}
                />
                <div className="scratch-message">
                  {scratchMessages[Math.floor(Math.random() * scratchMessages.length)]}
                </div>
              </div>
            </div>
            <button className="back-button" onClick={() => { setActiveGame(null); setScratchRevealed(false) }}>
              ← Back to Games
            </button>
          </div>
        )

      case 'heartbeat':
        return (
          <div className="game-content">
            <h2>Heartbeat Tap 💓</h2>
            <p className="game-instruction">Tap to match the heartbeat rhythm!</p>
            <motion.div
              className="heartbeat-display"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              💓
            </motion.div>
            <motion.button
              className="heartbeat-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setKissCount(kissCount + 1)
                if (kissCount > 0 && kissCount % 5 === 0) {
                  alert("We're in sync! Our hearts beat as one! ❤️")
                }
              }}
            >
              Tap 💓
            </motion.button>
            <p className="heartbeat-count">Taps: {kissCount}</p>
            <button className="back-button" onClick={() => { setActiveGame(null); setKissCount(0) }}>
              ← Back to Games
            </button>
          </div>
        )

      default:
        return (
          <div className="games-grid">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                className="game-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveGame(game.id)}
                style={{ borderColor: game.color }}
              >
                <div className="game-emoji">{game.emoji}</div>
                <h3>{game.title}</h3>
              </motion.div>
            ))}
          </div>
        )
    }
  }

  return (
    <div className="games-container">
      <div className="gif-background">
        <img src="https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif" alt="love" className="bg-gif" />
        <img src="https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif" alt="hearts" className="bg-gif" />
      </div>

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
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            💖
          </motion.div>
        ))}
      </div>

      <motion.div
        className="games-content"
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
          Love Games 🎮
        </motion.h1>

        {renderGame()}

        {!activeGame && (
          <div className="navigation-buttons">
            <Link to="/" className="nav-button">
              ← Back to Heart Map
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Games
