import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Timeline.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const Timeline = () => {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStory, setSelectedStory] = useState(null)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stories`)
      if (response.ok) {
        const data = await response.json()
        setStories(data)
      } else {
        console.error('Failed to fetch stories')
      }
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Map stories to chapters format
  const defaultChapters = [
    {
      _id: 'default-1',
      title: 'Chapter 1: How We Met',
      date: 'The Beginning',
      content: 'The moment I first saw you, I knew something special was about to happen. Your smile, your energy, everything about you drew me in. It was like the universe conspired to bring us together.',
      emoji: '💕'
    },
    {
      _id: 'default-2',
      title: 'Chapter 2: Falling for You',
      date: 'The Realization',
      content: 'Every conversation, every laugh, every moment together made me realize I was falling in love. Not slowly, but all at once. You became my favorite person, my best friend, my everything.',
      emoji: '💖'
    },
    {
      _id: 'default-3',
      title: 'Chapter 3: Our First Adventure',
      date: 'Dubai',
      content: 'Our trip to Dubai was magical. Exploring new places together, creating memories that would last forever. Every moment with you feels like an adventure, and I never want it to end.',
      emoji: '🌴'
    },
    {
      _id: 'default-4',
      title: 'Chapter 4: Paradise Found',
      date: 'Mauritius',
      content: 'Mauritius showed me what paradise really looks like - and it\'s anywhere you are. The beaches were beautiful, but nothing compared to watching you smile in the sunset. You are my paradise.',
      emoji: '🏝️'
    },
    {
      _id: 'default-5',
      title: 'Chapter 5: Forever Yours',
      date: 'Always',
      content: 'Now and forever, I choose you. Every day, every moment, every breath. You are my past, my present, and my future. I love you more than words can express, Liza.',
      emoji: '💞'
    },
  ]

  // Combine default chapters with API stories
  const chapters = stories.length > 0 
    ? [...defaultChapters, ...stories.map((story, index) => ({
        ...story,
        emoji: ['💕', '💖', '🌴', '🏝️', '💞', '✨', '🌹', '💫', '🌺', '💗'][index % 10]
      }))]
    : defaultChapters

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

        {loading ? (
          <div className="loading-stories" style={{ textAlign: 'center', padding: '50px', color: '#d63384' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ fontSize: '40px' }}
            >
              💕
            </motion.div>
            <p>Loading our love story...</p>
          </div>
        ) : (
          <div className="timeline">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter._id || chapter.id}
                className="timeline-item"
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedStory(chapter)}
                style={{ cursor: 'pointer' }}
              >
                <div className={`timeline-content-box ${index % 2 === 0 ? 'left' : 'right'}`}>
                  <div className="chapter-emoji">{chapter.emoji}</div>
                  <h2>{chapter.title}</h2>
                  <p className="chapter-date">
                    {chapter.location && <span>📍 {chapter.location} </span>}
                    {chapter.date && new Date(chapter.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    }) !== 'Invalid Date' 
                      ? new Date(chapter.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : chapter.date
                    }
                  </p>
                  <p className="chapter-text">{chapter.content.substring(0, 150)}...</p>
                  <p style={{ color: '#d63384', fontSize: '12px', marginTop: '10px' }}>Click to read more 💕</p>
                </div>
                <div className="timeline-dot" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Story Modal */}
        {selectedStory && (
          <motion.div
            className="story-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedStory(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%)',
                padding: '40px',
                borderRadius: '20px',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflow: 'auto',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(214, 51, 132, 0.3)'
              }}
            >
              <button
                onClick={() => setSelectedStory(null)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#d63384'
                }}
              >
                ✕
              </button>
              
              <div style={{ fontSize: '50px', textAlign: 'center', marginBottom: '20px' }}>
                {selectedStory.emoji}
              </div>
              
              <h2 style={{ color: '#d63384', textAlign: 'center', marginBottom: '10px' }}>
                {selectedStory.title}
              </h2>
              
              <p style={{ textAlign: 'center', color: '#888', marginBottom: '20px' }}>
                {selectedStory.location && <span>📍 {selectedStory.location} </span>}
                {selectedStory.date && (
                  new Date(selectedStory.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  }) !== 'Invalid Date'
                    ? `📅 ${new Date(selectedStory.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                    : selectedStory.date
                )}
              </p>
              
              <div style={{ 
                lineHeight: 1.8, 
                color: '#555', 
                fontSize: '16px',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedStory.content}
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '30px', color: '#d63384' }}>
                💕 With all my love 💕
              </div>
            </motion.div>
          </motion.div>
        )}

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

