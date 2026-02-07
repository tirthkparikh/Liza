import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Memories.css'

const API_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:5001/api'

const Memories = () => {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_URL}/images`)
      if (!res.ok) throw new Error('Failed to fetch images')

      const data = await res.json()

      // shuffle images for random romantic feel 💕
      const shuffled = data.sort(() => Math.random() - 0.5)
      setImages(shuffled)
    } catch (err) {
      console.error('Failed to load memories:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="memories-container">
      <motion.h1
        className="page-title"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        Our Beautiful Memories 💕
      </motion.h1>

      <motion.p
        className="page-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Every photo is a heartbeat we shared
      </motion.p>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading memories…</p>
      ) : (
        <div className="photo-gallery">
          {images.map((image, index) => (
            <motion.div
              key={image._id}
              className="photo-item"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.15, zIndex: 10 }}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={image.originalName || 'memory'}
                loading="lazy"
              />
              <div className="photo-overlay">❤️</div>
            </motion.div>
          ))}
        </div>
      )}

      <Link to="/" className="nav-button">
        ← Back to Heart Map
      </Link>

      {/* FULL IMAGE MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="image-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={selectedImage.url}
              alt="Full memory"
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.6 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="close-button"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Memories
