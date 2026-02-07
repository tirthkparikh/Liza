import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Dates.css'

const Dates = ({ token, API_URL: propAPI_URL }) => {
  const API_URL = propAPI_URL || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5001/api')
  const [dates, setDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDate, setEditingDate] = useState(null)
  const [filter, setFilter] = useState('upcoming')
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
      const response = await axios.get(`${API_URL}/reminders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDates(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dates:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingDate) {
        await axios.put(`${API_URL}/reminders/${editingDate._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post(`${API_URL}/reminders`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setShowForm(false)
      setEditingDate(null)
      setFormData({ type: 'date', title: '', description: '', datetime: '' })
      fetchDates()
    } catch (error) {
      alert('Error saving date')
    }
  }

  const handleEdit = (date) => {
    setEditingDate(date)
    setFormData({
      type: date.type,
      title: date.title,
      description: date.description || '',
      datetime: new Date(date.datetime).toISOString().slice(0, 16)
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this date?')) return
    try {
      await axios.delete(`${API_URL}/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchDates()
    } catch (error) {
      alert('Error deleting date')
    }
  }

  const handleComplete = async (date) => {
    try {
      await axios.put(`${API_URL}/reminders/${date._id}`, {
        ...date,
        completed: !date.completed
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchDates()
    } catch (error) {
      alert('Error updating date')
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

  const filteredDates = dates.filter(date => {
    const dateTime = new Date(date.datetime)
    const now = new Date()
    if (filter === 'upcoming') return dateTime > now
    if (filter === 'past') return dateTime <= now
    return true
  }).sort((a, b) => {
    if (filter === 'upcoming') {
      return new Date(a.datetime) - new Date(b.datetime)
    }
    return new Date(b.datetime) - new Date(a.datetime)
  })

  const stats = {
    total: dates.length,
    upcoming: dates.filter(d => new Date(d.datetime) > new Date()).length,
    completed: dates.filter(d => d.completed).length
  }

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="logo"><h2>💕 Admin Panel</h2></div>
        <ul className="nav-menu">
          <li><Link to="/">📊 Dashboard</Link></li>
          <li><Link to="/images">🖼️ Images</Link></li>
          <li><Link to="/blogs">📝 Love Letters</Link></li>
          <li><Link to="/stories">📖 Stories</Link></li>
          <li className="active"><Link to="/dates">📅 Dates</Link></li>
          <li><Link to="/lovejar">💝 Love Jar</Link></li>
          <li><Link to="/letters">💌 Quick Message</Link></li>
          <li><Link to="/games">🎮 Games</Link></li>
          <li><Link to="/videocall">📹 Video Call</Link></li>
        </ul>
      </nav>

      <main className="main-content">
        <div className="header-actions">
          <h1>Date Planner 📅</h1>
          <button onClick={() => { 
            setShowForm(true); 
            setEditingDate(null); 
            setFormData({ type: 'date', title: '', description: '', datetime: '' }) 
          }} className="add-btn">
            + Plan New Date
          </button>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Dates</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.upcoming}</span>
            <span className="stat-label">Upcoming</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="filter-tabs">
          <button 
            className={filter === 'upcoming' ? 'active' : ''} 
            onClick={() => setFilter('upcoming')}
          >
            ✨ Upcoming
          </button>
          <button 
            className={filter === 'past' ? 'active' : ''} 
            onClick={() => setFilter('past')}
          >
            📸 Past
          </button>
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            📋 All
          </button>
        </div>

        {showForm && (
          <div className="form-modal">
            <form onSubmit={handleSubmit} className="date-form">
              <h2>{editingDate ? 'Edit Date' : 'Plan New Date'}</h2>
              
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
                  placeholder="What are we doing?"
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
                <label>Description</label>
                <textarea
                  placeholder="Add some details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingDate(null) }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="dates-list">
          {loading ? (
            <p>Loading dates...</p>
          ) : filteredDates.length === 0 ? (
            <p className="no-items">No dates found. Plan something special!</p>
          ) : (
            filteredDates.map((date) => (
              <div 
                key={date._id} 
                className={`date-card ${date.completed ? 'completed' : ''}`}
                style={{ borderLeftColor: getTypeColor(date.type) }}
              >
                <div className="date-header">
                  <div className="date-type">
                    <span className="type-icon">{getTypeEmoji(date.type)}</span>
                    <span className="type-label">{date.type}</span>
                  </div>
                  <div className="date-actions">
                    <button 
                      onClick={() => handleComplete(date)}
                      className={`complete-btn ${date.completed ? 'completed' : ''}`}
                      title={date.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {date.completed ? '✓' : '○'}
                    </button>
                    <button onClick={() => handleEdit(date)}>Edit</button>
                    <button onClick={() => handleDelete(date._id)} className="delete">Delete</button>
                  </div>
                </div>

                <h3>{date.title}</h3>
                
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
                    {new Date(date.datetime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {date.description && (
                  <p className="date-description">{date.description}</p>
                )}

                {new Date(date.datetime) > new Date() && !date.completed && (
                  <div className="countdown">
                    {getDaysUntil(date.datetime)} days to go
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
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

export default Dates
