import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../App.css'
import './LoveJar.css'

const LoveJar = ({ token, API_URL: propAPI_URL }) => {
  const API_URL = propAPI_URL || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5001/api')
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    text: '',
    color: '#ff6b9d'
  })

  const colors = [
    { value: '#ff6b9d', label: 'Pink' },
    { value: '#ffd93d', label: 'Yellow' },
    { value: '#6bcf7f', label: 'Green' },
    { value: '#a855f7', label: 'Purple' },
    { value: '#3b82f6', label: 'Blue' },
    { value: '#f97316', label: 'Orange' },
  ]

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/lovejar`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotes(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching notes:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/lovejar`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowForm(false)
      setFormData({ text: '', color: '#ff6b9d' })
      fetchNotes()
    } catch (error) {
      alert('Error saving note')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this love note?')) return
    try {
      await axios.delete(`${API_URL}/lovejar/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchNotes()
    } catch (error) {
      alert('Error deleting note')
    }
  }

  const getAuthorName = (author) => {
    return author === 'admin' ? 'Tirth' : 'Liza'
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
          <li><Link to="/dates">📅 Dates</Link></li>
          <li className="active"><Link to="/lovejar">💝 Love Jar</Link></li>
          <li><Link to="/letters">💌 Quick Message</Link></li>
          <li><Link to="/games">🎮 Games</Link></li>
          <li><Link to="/videocall">📹 Video Call</Link></li>
        </ul>
      </nav>

      <main className="main-content">
        <div className="header-actions">
          <h1>Love Jar for Liza 💝</h1>
          <button onClick={() => { setShowForm(true); setFormData({ text: '', color: '#ff6b9d' }) }} className="add-btn">
            + Add Note for Liza
          </button>
        </div>

        {showForm && (
          <div className="form-modal">
            <form onSubmit={handleSubmit} className="lovejar-form">
              <h2>Add Love Note</h2>
              <textarea
                placeholder="Write a sweet love note..."
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows="4"
                maxLength="200"
                required
              />
              <div className="char-count">{formData.text.length}/200</div>
              <div className="color-select">
                <label>Note Color:</label>
                <div className="color-options">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`color-btn ${formData.color === color.value ? 'selected' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button type="submit">Save Note</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="lovejar-stats">
          <div className="stat-card">
            <h3>Total Notes</h3>
            <p className="stat-number">{notes.length}</p>
          </div>
          <div className="stat-card">
            <h3>From You</h3>
            <p className="stat-number">{notes.filter(n => n.author === 'admin').length}</p>
          </div>
          <div className="stat-card">
            <h3>From Liza</h3>
            <p className="stat-number">{notes.filter(n => n.author === 'lover').length}</p>
          </div>
        </div>

        <div className="lovejar-grid">
          {loading ? (
            <p>Loading...</p>
          ) : notes.length === 0 ? (
            <p>No love notes yet. Create one!</p>
          ) : (
            notes.map((note) => (
              <div 
                key={note._id} 
                className={`lovejar-note-card ${note.author === 'lover' ? 'from-lover' : ''}`}
                style={{ backgroundColor: note.color }}
              >
                <div className="note-header">
                  <span className={`author-badge ${note.author}`}>
                    {note.author === 'lover' ? '💕 From Liza' : 'From You'}
                  </span>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(note._id)}
                  >
                    🗑️
                  </button>
                </div>
                <p className="note-text">{note.text}</p>
                <span className="note-date">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default LoveJar
