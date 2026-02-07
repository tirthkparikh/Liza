import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Mauritius.css'

const Mauritius = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  
  // Mauritius images from the folder
  const mauritiusImages = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    src: `/assets/images/Maur/${['IMG_8045', 'IMG_8046', 'IMG_8047', 'IMG_8048', 'IMG_8058', 'IMG_8059', 'IMG_8060', 'IMG_8064', 'IMG_8118', 'IMG_8119', 'IMG_8120', 'IMG_8132', 'IMG_8143', 'IMG_8364', 'IMG_8365'][i]}.JPG`
  }))

  const openImage = (image) => {
    setSelectedImage(image)
  }

  return (
    <div className="mauritius-container">
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
            🏝️
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mauritius-content"
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
          Mauritius Paradise 🏝️
        </motion.h1>

        <motion.p
          className="page-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Our beautiful moments in paradise
        </motion.p>

        <div className="photo-gallery">
          {mauritiusImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="photo-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              onClick={() => openImage(image)}
            >
              <img
                src={image.src}
                alt={`Mauritius memory ${image.id}`}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div className="photo-overlay">
                <span className="photo-emoji">🏝️</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link to="/" className="nav-button">
            ← Home
          </Link>
        </motion.div>
      </motion.div>

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
              src={selectedImage.src}
              alt="Full size"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button className="close-button" onClick={() => setSelectedImage(null)}>
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Mauritius

