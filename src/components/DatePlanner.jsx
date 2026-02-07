import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './DatePlanner.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const DatePlanner = () => {
  const [dates, setDates] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    type: 'date',
    title: '',
    description: '',
    datetime: ''
  })

  useEffect(() => {
    fetchDates()
  }, [])

  const fetchDates = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reminders`)
      if (response.ok) {
        const data = await response.json()
        setDates(data)
      }
    } catch (error) {
      console.error('Error fetching dates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/api/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({ type: 'date', title: '', description: '', datetime: '' })
        setShowForm(false)
        fetchDates()
        alert('💕 Date planned successfully! Notification sent!')
      } else {
        alert('Error planning date')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error planning date')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this date?')) return
    try {
      const response = await fetch(`${API_URL}/api/reminders/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchDates()
      }
    } catch (error) {
      console.error('Error deleting date:', error)
    }
  }

  const getTypeEmoji = (type) => {
    const emojis = {
      date: '💕',
      reminder: '⏰',
      anniversary: '💍',
      birthday: '🎂'
    }
    return emojis[type] || '💕'
  }

  const getTypeColor = (type) => {
    const colors = {
      date: '#ff6b9d',
      reminder: '#667eea',
      anniversary: '#d63384',
      birthday: '#f093fb'
    }
    return colors[type] || '#ff6b9d'
  }

  const upcomingDates = dates
    .filter(d => new Date(d.datetime) > new Date())
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))

  const pastDates = dates
    .filter(d => new Date(d.datetime) <= new Date())
    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))

  return (
    <div className="date-planner-container">
      <div className="hearts-background">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 20}px`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.7, 0.2],
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
        className="date-planner-content"
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
          Our Date Planner 💕
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Plan special moments together - I'll be notified instantly!
        </motion.p>

        <motion.button
          className="plan-date-btn"
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="btn-icon">💕</span>
          Plan a New Date
        </motion.button>

        <AnimatePresence>
          {showForm && (
            <motion.div
              className="form-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
            >
              <motion.div
                className="date-form"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2>💕 Plan Something Special</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="date">💕 Date</option>
                      <option value="anniversary">💍 Anniversary</option>
                      <option value="birthday">🎂 Birthday</option>
                      <option value="reminder">⏰ Reminder</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Dinner at our favorite restaurant"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>When</label>
                    <input
                      type="datetime-local"
                      value={formData.datetime}
                      onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description (Optional)</label>
                    <textarea
                      placeholder="Add some sweet details..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="submit-btn">
                      💕 Plan Date
                    </button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="loading-dates">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              💕
            </motion.div>
            <p>Loading our dates...</p>
          </div>
        ) : (
          <>
            <motion.div
              className="dates-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="section-title">
                <span className="section-emoji">✨</span>
                Upcoming Dates
                <span className="count">({upcomingDates.length})</span>
              </h2>
              
              {upcomingDates.length === 0 ? (
                <p className="no-dates">No upcoming dates planned. Let's plan something special! 💕</p>
              ) : (
                <div className="dates-grid">
                  {upcomingDates.map((date, index) => (
                    <motion.div
                      key={date._id}
                      className="date-card upcoming"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      style={{ borderColor: getTypeColor(date.type) }}
                    >
                      <div className="date-header">
                        <span className="date-type-icon">{getTypeEmoji(date.type)}</span>
                        <span className="date-type-label" style={{ background: getTypeColor(date.type) }}>
                          {date.type}
                        </span>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(date._id)}
                        >
                          ✕
                        </button>
                      </div>
                      <h3 className="date-title">{date.title}</h3>
                      <div className="date-datetime">
                        <p className="date-day">
                          {new Date(date.datetime).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="date-time">
                          ⏰ {new Date(date.datetime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {date.description && (
                        <p className="date-description">💭 {date.description}</p>
                      )}
                      <div className="date-countdown">
                        {getDaysUntil(date.datetime)} days to go! 💕
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {pastDates.length > 0 && (
              <motion.div
                className="dates-section past"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h2 className="section-title">
                  <span className="section-emoji">📸</span>
                  Past Memories
                  <span className="count">({pastDates.length})</span>
                </h2>
                <div className="dates-grid">
                  {pastDates.slice(0, 5).map((date, index) => (
                    <motion.div
                      key={date._id}
                      className="date-card past"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="date-header">
                        <span className="date-type-icon">{getTypeEmoji(date.type)}</span>
                        <span className="date-completed">✓ Completed</span>
                      </div>
                      <h3 className="date-title">{date.title}</h3>
                      <p className="date-day">
                        {new Date(date.datetime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
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

const getDaysUntil = (datetime) => {
  const now = new Date()
  const date = new Date(datetime)
  const diffTime = date - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export default DatePlanner
