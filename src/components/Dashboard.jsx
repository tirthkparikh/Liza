import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
  const [dateTime, setDateTime] = useState('')
  const [reminder, setReminder] = useState('')
  const [reminders, setReminders] = useState([])
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)

  useEffect(() => {
    const loadReminders = () => {
      const saved = localStorage.getItem('liza-reminders')
      if (saved) setReminders(JSON.parse(saved))
    }
    loadReminders()
  }, [])

  const handleSetDate = (e) => {
    e.preventDefault()
    if (dateTime) {
      const newReminder = {
        id: Date.now(),
        type: 'date',
        datetime: dateTime,
        title: 'Date with My Love',
        createdAt: new Date().toISOString()
      }
      const updated = [...reminders, newReminder]
      setReminders(updated)
      localStorage.setItem('liza-reminders', JSON.stringify(updated))
      alert('Date set successfully! 💕')
      setDateTime('')
    }
  }

  const handleSetReminder = (e) => {
    e.preventDefault()
    if (reminder) {
      const newReminder = {
        id: Date.now(),
        type: 'reminder',
        text: reminder,
        createdAt: new Date().toISOString()
      }
      const updated = [...reminders, newReminder]
      setReminders(updated)
      localStorage.setItem('liza-reminders', JSON.stringify(updated))
      alert('Reminder set! 💖')
      setReminder('')
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

  const [phoneNumber, setPhoneNumber] = useState(() => {
    const saved = localStorage.getItem('liza-phone-number')
    return saved || ''
  })

  const handleSetPhone = () => {
    const phone = prompt('Enter your phone number (with country code, e.g., +1234567890):')
    if (phone) {
      localStorage.setItem('liza-phone-number', phone)
      setPhoneNumber(phone)
      alert('Phone number saved! 💕')
    }
  }

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`
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
            {!phoneNumber && (
              <p className="setup-note">⚠️ Set your phone number first!</p>
            )}
            <div className="action-buttons">
              <motion.button
                className="action-btn call-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={phoneNumber ? handleCall : handleSetPhone}
                title={phoneNumber ? `Call ${phoneNumber}` : 'Set phone number first'}
              >
                📞 {phoneNumber ? 'Call Me' : 'Set Phone Number'}
              </motion.button>
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

          {/* Reminders List */}
          <motion.div
            className="dashboard-card reminders-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2>📋 Your Reminders</h2>
            <div className="reminders-list">
              {reminders.length === 0 ? (
                <p className="empty-state">No reminders yet. Set one above! 💕</p>
              ) : (
                reminders.map((rem) => (
                  <motion.div
                    key={rem.id}
                    className="reminder-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="reminder-content">
                      {rem.type === 'date' ? (
                        <>
                          <span className="reminder-icon">💕</span>
                          <div>
                            <strong>Date: {new Date(rem.datetime).toLocaleString()}</strong>
                            <p>{rem.title}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="reminder-icon">⏰</span>
                          <div>
                            <p>{rem.text}</p>
                            <small>{new Date(rem.createdAt).toLocaleDateString()}</small>
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => deleteReminder(rem.id)}
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

export default Dashboard

