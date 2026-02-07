import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Stories.css'

const Stories = ({ token, API_URL: propAPI_URL }) => {
  const API_URL = propAPI_URL || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api')
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStory, setEditingStory] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    date: '',
    published: false
  })

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await axios.get(`${API_URL}/stories`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStories(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching stories:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingStory) {
        await axios.put(`${API_URL}/stories/${editingStory._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post(`${API_URL}/stories`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setShowForm(false)
      setEditingStory(null)
      setFormData({ title: '', content: '', location: '', date: '', published: false })
      fetchStories()
    } catch (error) {
      alert('Error saving story')
    }
  }

  const handleEdit = (story) => {
    setEditingStory(story)
    setFormData({
      title: story.title,
      content: story.content,
      location: story.location || '',
      date: story.date ? new Date(story.date).toISOString().split('T')[0] : '',
      published: story.published
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this story?')) return
    try {
      await axios.delete(`${API_URL}/stories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchStories()
    } catch (error) {
      alert('Error deleting story')
    }
  }

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="logo"><h2>💕 Admin Panel</h2></div>
        <ul className="nav-menu">
          <li><Link to="/">📊 Dashboard</Link></li>
          <li><Link to="/images">🖼️ Images</Link></li>
          <li><Link to="/blogs">📝 Blogs</Link></li>
          <li><Link to="/stories">📖 Stories</Link></li>
        </ul>
      </nav>

      <main className="main-content">
        <div className="header-actions">
          <h1>Story Management 📖</h1>
          <button onClick={() => { setShowForm(true); setEditingStory(null); setFormData({ title: '', content: '', location: '', date: '', published: false }) }} className="add-btn">
            + New Story
          </button>
        </div>

        {showForm && (
          <div className="form-modal">
            <form onSubmit={handleSubmit} className="story-form">
              <h2>{editingStory ? 'Edit Story' : 'New Story'}</h2>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Story content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows="10"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              <label>
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                Published
              </label>
              <div className="form-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingStory(null) }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="stories-list">
          {loading ? (
            <p>Loading...</p>
          ) : stories.length === 0 ? (
            <p>No stories yet. Create one!</p>
          ) : (
            stories.map((story) => (
              <div key={story._id} className="story-card">
                <h3>{story.title}</h3>
                <p className="story-content">{story.content.substring(0, 150)}...</p>
                <div className="story-meta">
                  {story.location && <span>📍 {story.location}</span>}
                  {story.date && <span>📅 {new Date(story.date).toLocaleDateString()}</span>}
                  <span className={`status ${story.published ? 'published' : 'draft'}`}>
                    {story.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="story-actions">
                  <button onClick={() => handleEdit(story)}>Edit</button>
                  <button onClick={() => handleDelete(story._id)} className="delete">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default Stories

