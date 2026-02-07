import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getReminders, createReminder } from '../utils/api'
import './Dashboard.css'

const Dashboard = () => {
  const [dateTime, setDateTime] = useState('')
  const [reminder, setReminder] = useState('')
  const [reminders, setReminders] = useState([])
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReminders = async () => {
      try {
        // Try API first
        const apiReminders = await getReminders()
        if (apiReminders && apiReminders.length > 0) {
          setReminders(apiReminders)
          setLoading(false)
          return
        }
      } catch (error) {
        console.log('API not available, using local storage')
      }
      
      // Fallback to local storage
      const saved = localStorage.getItem('liza-reminders')
      if (saved) setReminders(JSON.parse(saved))
      setLoading(false)
    }
    loadReminders()
  }, [])

  const handleSetDate = async (e) => {
    e.preventDefault()
    if (dateTime) {
      const newReminder = {
        type: 'date',
        datetime: dateTime,
        title: 'Date with My Love'
      }
      
      try {
        // Try API first
        await createReminder(newReminder)
        const updated = await getReminders()
        setReminders(updated)
        alert('Date set successfully! 💕')
        setDateTime('')
      } catch (error) {
        // Fallback to local storage
        const localReminder = {
          id: Date.now(),
          ...newReminder,
          createdAt: new Date().toISOString()
        }
        const updated = [...reminders, localReminder]
        setReminders(updated)
        localStorage.setItem('liza-reminders', JSON.stringify(updated))
        alert('Date set successfully! 💕')
        setDateTime('')
      }
    }
  }

  const handleSetReminder = async (e) => {
    e.preventDefault()
    if (reminder) {
      const newReminder = {
        type: 'reminder',
        title: reminder,
        description: reminder
      }
      
      try {
        // Try API first
        await createReminder(newReminder)
        const updated = await getReminders()
        setReminders(updated)
        alert('Reminder set! 💖')
        setReminder('')
      } catch (error) {
        // Fallback to local storage
        const localReminder = {
          id: Date.now(),
          type: 'reminder',
          text: reminder,
          createdAt: new Date().toISOString()
        }
        const updated = [...reminders, localReminder]
        setReminders(updated)
        localStorage.setItem('liza-reminders', JSON.stringify(updated))
        alert('Reminder set! 💖')
        setReminder('')
      }
    }
  }

  const handleSendEmail = (e) => {
    e.preventDefault()
    const email = localStorage.getItem('liza-email') || 'your-email@example.com'
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
    window.location.href = mailtoLink
    setShowEmailForm(false)
    setEmailSubject('')
    setEmailBody('')
  }

  const deleteReminder = (id) => {
    const updated = reminders.filter(r => r.id !== id)
    setReminders(updated)
    localStorage.setItem('liza-reminders', JSON.stringify(updated))
  }

  return (
    <div className="dashboard-container">
      <div className="gif-background">
        <img src="https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif" alt="romantic" className="bg-gif" />
        <img src="https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif" alt="hearts" className="bg-gif" />
      </div>

      <motion.div
        className="dashboard-content"
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
          Daily Dashboard 💕
        </motion.h1>

        <div className="dashboard-grid">
          {/* Quick Actions */}
          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <motion.button
                className="action-btn email-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const email = localStorage.getItem('liza-email')
                  if (!email) {
                    const newEmail = prompt('Enter your email address:')
                    if (newEmail) {
                      localStorage.setItem('liza-email', newEmail)
                      setShowEmailForm(true)
                    }
                  } else {
                    setShowEmailForm(!showEmailForm)
                  }
                }}
              >
                ✉️ Email Me
              </motion.button>
            </div>
          </motion.div>

          {/* Set Date */}
          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2>💕 Set a Date</h2>
            <form onSubmit={handleSetDate} className="date-form">
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="date-input"
                required
              />
              <motion.button
                type="submit"
                className="submit-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Set Date 💖
              </motion.button>
            </form>
          </motion.div>

          {/* Set Reminder */}
          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2>⏰ Set Reminder</h2>
            <form onSubmit={handleSetReminder} className="reminder-form">
              <textarea
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                placeholder="What do you want to remember?"
                className="reminder-input"
                rows="3"
                required
              />
              <motion.button
                type="submit"
                className="submit-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save Reminder 💝
              </motion.button>
            </form>
          </motion.div>

          {/* Email Form */}
          {showEmailForm && (
            <motion.div
              className="dashboard-card email-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h2>✉️ Email Me</h2>
              <form onSubmit={handleSendEmail} className="email-form">
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Subject"
                  className="email-input"
                  required
                />
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Your message..."
                  className="email-input"
                  rows="4"
                  required
                />
                <div className="email-buttons">
                  <motion.button
                    type="submit"
                    className="submit-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send 💌
                  </motion.button>
                  <motion.button
                    type="button"
                    className="cancel-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEmailForm(false)}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Upcoming Dates Preview */}
          <motion.div
            className="dashboard-card dates-preview-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="card-header">
              <h2>📅 Upcoming Dates</h2>
              <Link to="/dates" className="view-all-link">
                View All →
              </Link>
            </div>
            <div className="dates-preview-list">
              {reminders.filter(r => r.type === 'date' && new Date(r.datetime) > new Date()).length === 0 ? (
                <p className="empty-state">No upcoming dates. Plan something special! 💕</p>
              ) : (
                reminders
                  .filter(r => r.type === 'date' && new Date(r.datetime) > new Date())
                  .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                  .slice(0, 3)
                  .map((date, index) => (
                    <motion.div
                      key={date.id || date._id}
                      className="date-preview-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="date-preview-icon">💕</div>
                      <div className="date-preview-content">
                        <strong>{date.title || 'Date with My Love'}</strong>
                        <p className="date-preview-time">
                          {new Date(date.datetime).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <span className="days-until">
                          {getDaysUntil(date.datetime)} days to go! ✨
                        </span>
                      </div>
                    </motion.div>
                  ))
              )}
            </div>
          </motion.div>

          {/* Reminders List */}
          <motion.div
            className="dashboard-card reminders-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2>📋 Your Reminders</h2>
            <div className="reminders-list">
              {reminders.filter(r => r.type !== 'date').length === 0 ? (
                <p className="empty-state">No reminders yet. Set one above! 💕</p>
              ) : (
                reminders
                  .filter(r => r.type !== 'date')
                  .map((rem) => (
                    <motion.div
                      key={rem.id || rem._id}
                      className="reminder-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="reminder-content">
                        <span className="reminder-icon">⏰</span>
                        <div>
                          <p>{rem.title || rem.text}</p>
                          <small>{new Date(rem.createdAt || rem.datetime).toLocaleDateString()}</small>
                        </div>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => deleteReminder(rem.id || rem._id)}
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
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

export default Dashboard

