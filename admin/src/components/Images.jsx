import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../App.css'
import './Images.css'

const Images = ({ token, API_URL: propAPI_URL }) => {
  const API_URL =
    propAPI_URL ||
    (import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/api`
      : 'http://localhost:5001/api')

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)
  const [folder, setFolder] = useState('mixed')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/images`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setImages(response.data)
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('image', selectedFile)
    formData.append('folder', folder)

    try {
      setUploading(true)
      await axios.post(`${API_URL}/images/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      setSelectedFile(null)
      fetchImages()
      alert('Image uploaded successfully!')
    } catch (error) {
      alert(
        'Error uploading image: ' +
          (error.response?.data?.error || 'Unknown error')
      )
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return

    try {
      await axios.delete(`${API_URL}/images/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchImages()
    } catch (error) {
      alert('Error deleting image')
    }
  }

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="logo">
          <h2>💕 Admin Panel</h2>
        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/">📊 Dashboard</Link>
          </li>
          <li className="active">
            <Link to="/images">🖼️ Images</Link>
          </li>
          <li>
            <Link to="/blogs">📝 Love Letters</Link>
          </li>
          <li>
            <Link to="/stories">📖 Stories</Link>
          </li>
          <li>
            <Link to="/dates">📅 Dates</Link>
          </li>
          <li>
            <Link to="/lovejar">💝 Love Jar</Link>
          </li>
          <li>
            <Link to="/letters">💌 Quick Message</Link>
          </li>
          <li>
            <Link to="/games">🎮 Games</Link>
          </li>
          <li>
            <Link to="/videocall">📹 Video Call</Link>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <h1>Image Management 🖼️</h1>

        <div className="upload-section">
          <h2>Upload New Image</h2>

          <form onSubmit={handleUpload} className="upload-form">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              required
            />

            <select value={folder} onChange={(e) => setFolder(e.target.value)}>
              <option value="mixed">Mixed</option>
              <option value="dubai">Dubai</option>
              <option value="mauritius">Mauritius</option>
              <option value="other">Other</option>
            </select>

            <button type="submit" disabled={uploading}>
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </form>
        </div>

        <div className="images-grid">
          {loading ? (
            <p>Loading...</p>
          ) : images.length === 0 ? (
            <p>No images yet. Upload some!</p>
          ) : (
            images.map((image) => (
              <div key={image._id} className="image-card">
                {/* 🔥 CLOUDINARY URL – NO localhost */}
                <img src={image.url} alt={image.originalName} />

                <div className="image-info">
                  <p>{image.originalName}</p>
                  <p className="folder-tag">{image.folder}</p>
                </div>

                <button
                  onClick={() => handleDelete(image._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default Images
