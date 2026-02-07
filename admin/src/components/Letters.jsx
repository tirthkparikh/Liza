import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getBlogs, createBlog } from '../utils/api'
import './Letters.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

// Romantic GIFs collection
const romanticGifs = [
  'https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif',
  'https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif',
  'https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif',
  'https://media.giphy.com/media/26FLdmIp6wJrqaJmE/giphy.gif',
  'https://media.giphy.com/media/3o6Zt3AX5ID7J4tJEA/giphy.gif',
  'https://media.giphy.com/media/l378e6l8EdzdENj8Y/giphy.gif',
  'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif',
]

const Letters = () => {
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showWriteForm, setShowWriteForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'love'
  })
  const [submitting, setSubmitting] = useState(false)
  const [randomGif, setRandomGif] = useState(romanticGifs[0])

  useEffect(() => {
    fetchBlogs()
    // Change GIF every 10 seconds
    const gifInterval = setInterval(() => {
      setRandomGif(romanticGifs[Math.floor(Math.random() * romanticGifs.length)])
    }, 10000)
    return () => clearInterval(gifInterval)
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const data = await getBlogs()
      setBlogs(data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) return
    
    try {
      setSubmitting(true)
      await createBlog({
        ...formData,
        published: true
      })
      setFormData({ title: '', content: '', category: 'love' })
      setShowWriteForm(false)
      fetchBlogs()
      alert('Your love letter has been sent! 💕')
    } catch (error) {
      alert('Error sending letter. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const defaultLoveLetters = [
    {
      _id: 'default-1',
      title: 'My Dearest Liza',
      date: 'Today',
      content: 'Every morning I wake up and think of you. Your smile, your laugh, your beautiful soul. I fall in love with you more every single day. You are my everything, my reason to smile, my heart\'s home. Forever yours, with all my love ❤️',
      category: 'love'
    },
    {
      _id: 'default-2',
      title: 'Thank You',
      date: 'Always',
      content: 'Thank you for being you. Thank you for loving me. Thank you for every moment we share together. You make my life complete in ways I never imagined possible. I\'m so grateful for you every single day 💕',
      category: 'memories'
    },
    {
      _id: 'default-3',
      title: 'I\'m Sorry',
      date: 'When needed',
      content: 'I know I\'m not perfect, and sometimes I make mistakes. But I want you to know that I\'m always sorry when I hurt you. Your happiness means everything to me, and I\'ll always try to be better for you. I love you more than words can say 💖',
      category: 'promises'
    },
    {
      _id: 'default-4',
      title: 'You Complete Me',
      date: 'Forever',
      content: 'Before you, I didn\'t know what I was missing. Now I can\'t imagine life without you. You complete me in every way. Your love fills all the empty spaces in my heart. Together, we are whole. Together, we are everything ❤️',
      category: 'love'
    },
  ]

  const loveLetters = blogs.length > 0 
    ? [...defaultLoveLetters, ...blogs]
    : defaultLoveLetters

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
      {/* Romantic Background GIF */}
      <div className="romantic-bg-gif">
        <img src={randomGif} alt="romantic" />
        <div className="gif-overlay"></div>
      </div>

      {/* Floating Hearts */}
      <div className="hearts-background">
        {[...Array(30)].map((_, i) => (
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
            {['💌', '💕', '💖', '💗', '💓', '💝'][i % 6]}
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

        {/* Write Letter Button */}
        <motion.div
          className="write-letter-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            className="write-letter-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowWriteForm(true)}
          >
            ✨ Write a Love Letter ✨
          </motion.button>
          <p className="write-hint">Express your feelings and send love back!</p>
        </motion.div>

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
          <AnimatePresence>
            {randomCompliment && (
              <motion.div
                className="compliment-display"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <p>{randomCompliment} ❤️</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Write Letter Form */}
        <AnimatePresence>
          {showWriteForm && (
            <motion.div
              className="letter-form-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWriteForm(false)}
            >
              <motion.div
                className="letter-form-container"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="form-header">
                  <h2>💌 Write Your Love Letter</h2>
                  <button className="close-form" onClick={() => setShowWriteForm(false)}>✕</button>
                </div>
                
                <form onSubmit={handleSubmit} className="letter-form">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="Give your letter a title..."
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="love">💕 Love</option>
                      <option value="memories">📸 Memories</option>
                      <option value="promises">💍 Promises</option>
                      <option value="future">✨ Future</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Your Message</label>
                    <textarea
                      placeholder="Write from your heart..."
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows="8"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="send-letter-btn"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {submitting ? 'Sending... 💌' : 'Send Love Letter 💕'}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Love Letters */}
        {loading ? (
          <div className="loading-letters" style={{ textAlign: 'center', padding: '50px', color: '#d63384' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ fontSize: '40px' }}
            >
              💌
            </motion.div>
            <p>Loading love letters...</p>
          </div>
        ) : (
          <div className="letters-grid">
            {loveLetters.map((letter, index) => (
              <motion.div
                key={letter._id || letter.id}
                className="letter-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                onClick={() => setSelectedLetter(letter)}
              >
                <div className="letter-envelope">
                  <div className="letter-type">
                    {letter.category === 'love' ? '💕' : 
                     letter.category === 'memories' ? '📸' : 
                     letter.category === 'promises' ? '💍' : 
                     letter.category === 'future' ? '✨' : '💌'}
                  </div>
                  <h3>{letter.title}</h3>
                  <p className="letter-date">
                    {letter.createdAt 
                      ? new Date(letter.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : letter.date
                    }
                  </p>
                  {letter.category && (
                    <span className="letter-category" style={{
                      display: 'inline-block',
                      background: 'rgba(214, 51, 132, 0.1)',
                      color: '#d63384',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginTop: '8px'
                    }}>
                      {letter.category}
                    </span>
                  )}
                  {letter.createdBy && (
                    <span className="letter-author" style={{
                      display: 'block',
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#888',
                      fontStyle: 'italic'
                    }}>
                      From: {letter.createdBy === 'lover' ? 'Liza 💕' : 'Tirth 💕'}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Letter Modal */}
        <AnimatePresence>
          {selectedLetter && (
            <motion.div
              className="letter-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLetter(null)}
            >
              <motion.div
                className="letter-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-button" onClick={() => setSelectedLetter(null)}>
                  ✕
                </button>
                <div style={{ textAlign: 'center', marginBottom: '15px', fontSize: '40px' }}>
                  {selectedLetter.category === 'love' ? '💕' : 
                   selectedLetter.category === 'memories' ? '📸' : 
                   selectedLetter.category === 'promises' ? '💍' : 
                   selectedLetter.category === 'future' ? '✨' : '💌'}
                </div>
                {selectedLetter.category && (
                  <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #d63384, #ff6b9d)',
                      color: 'white',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {selectedLetter.category}
                    </span>
                  </div>
                )}
                <h2>{selectedLetter.title}</h2>
                <p className="letter-date-modal">
                  {selectedLetter.createdAt 
                    ? new Date(selectedLetter.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })
                    : selectedLetter.date
                  }
                </p>
                {selectedLetter.createdBy && (
                  <p className="letter-author-modal" style={{
                    textAlign: 'center',
                    color: '#d63384',
                    fontStyle: 'italic',
                    marginBottom: '20px'
                  }}>
                    From: {selectedLetter.createdBy === 'lover' ? 'Liza 💕' : 'Tirth 💕'}
                  </p>
                )}
                <div className="letter-text" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedLetter.content}
                </div>
                <div style={{ textAlign: 'center', marginTop: '30px', color: '#d63384', fontStyle: 'italic' }}>
                  💕 Forever Yours 💕
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
