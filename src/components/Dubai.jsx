import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Dubai.css'

const Dubai = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  
  // Dubai images from the folder
  const dubaiImages = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    src: `/assets/images/Dubai/${['BFMJ2740', 'CGWZ3256', 'CKMV4869', 'FKND9979', 'FNLU7930', 'HNEW8061', 'IMG_0061', 'IMG_0191', 'IMG_0196', 'IMG_0197', 'IMG_0301', 'IMG_0302', 'IMG_0303', 'IMG_0333', 'IMG_0334', 'IMG_0361', 'IMG_0362', 'IMG_0380', 'IMG_0381', 'IMG_0772'][i]}.JPG`
  }))

  const openImage = (image) => {
    setSelectedImage(image)
  }

  return (
    <div className="dubai-container">
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
            🌴
          </motion.div>
        ))}
      </div>

      <motion.div
        className="dubai-content"
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
          Our Dubai Adventure 🌴
        </motion.h1>

        <motion.p
          className="page-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Beautiful memories from our Dubai trip together
        </motion.p>

        <div className="photo-gallery">
          {dubaiImages.map((image, index) => (
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
                alt={`Dubai memory ${image.id}`}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div className="photo-overlay">
                <span className="photo-emoji">🌴</span>
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

export default Dubai

