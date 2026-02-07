import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Blogs.css'

const Blogs = ({ token, API_URL: propAPI_URL }) => {
  const API_URL = propAPI_URL || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5001/api')
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'love',
    published: false
  })

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBlogs(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingBlog) {
        await axios.put(`${API_URL}/blogs/${editingBlog._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post(`${API_URL}/blogs`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setShowForm(false)
      setEditingBlog(null)
      setFormData({ title: '', content: '', category: 'love', published: false })
      fetchBlogs()
    } catch (error) {
      alert('Error saving blog')
    }
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      content: blog.content,
      category: blog.category,
      published: blog.published
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog?')) return
    try {
      await axios.delete(`${API_URL}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchBlogs()
    } catch (error) {
      alert('Error deleting blog')
    }
  }

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="logo"><h2>💕 Admin Panel</h2></div>
        <ul className="nav-menu">
          <li><Link to="/">📊 Dashboard</Link></li>
          <li><Link to="/images">🖼️ Images</Link></li>
          <li className="active"><Link to="/blogs">📝 Love Letters</Link></li>
          <li><Link to="/stories">📖 Stories</Link></li>
          <li><Link to="/dates">📅 Dates</Link></li>
          <li><Link to="/lovejar">💝 Love Jar</Link></li>
          <li><Link to="/letters">💌 Write to Liza</Link></li>
          <li><Link to="/games">🎮 Games</Link></li>
          <li><Link to="/videocall">📹 Video Call</Link></li>
        </ul>
      </nav>

      <main className="main-content">
        <div className="header-actions">
          <h1>Love Letters to Liza 💌</h1>
          <button onClick={() => { setShowForm(true); setEditingBlog(null); setFormData({ title: '', content: '', category: 'love', published: true }) }} className="add-btn">
            + Write Love Letter
          </button>
        </div>

        {showForm && (
          <div className="form-modal">
            <form onSubmit={handleSubmit} className="blog-form">
              <h2>{editingBlog ? 'Edit Love Letter' : 'Write a Love Letter to Liza'}</h2>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows="10"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="love">Love</option>
                <option value="memories">Memories</option>
                <option value="promises">Promises</option>
                <option value="future">Future</option>
              </select>
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
                <button type="button" onClick={() => { setShowForm(false); setEditingBlog(null) }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="blogs-list">
          {loading ? (
            <p>Loading...</p>
          ) : blogs.length === 0 ? (
            <p>No blogs yet. Create one!</p>
          ) : (
            blogs.map((blog) => (
              <div key={blog._id} className={`blog-card ${blog.createdBy === 'lover' ? 'from-lover' : ''}`}>
                <div className="blog-header">
                  <h3>{blog.title}</h3>
                  {blog.createdBy === 'lover' && (
                    <span className="author-badge from-liza">💕 From Liza</span>
                  )}
                  {blog.createdBy === 'admin' && (
                    <span className="author-badge from-you">From You</span>
                  )}
                </div>
                <p className="blog-content">{blog.content.substring(0, 150)}...</p>
                <div className="blog-meta">
                  <span className="category">{blog.category}</span>
                  <span className={`status ${blog.published ? 'published' : 'draft'}`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="date">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="blog-actions">
                  <button onClick={() => handleEdit(blog)}>Edit</button>
                  <button onClick={() => handleDelete(blog._id)} className="delete">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default Blogs

