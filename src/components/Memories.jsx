import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Memories.css'

const Memories = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [images, setImages] = useState([])

  useEffect(() => {
    // Get all Dubai images
    const dubaiImages = [
      'BFMJ2740', 'CGWZ3256', 'CKMV4869', 'FKND9979', 'FNLU7930', 'HNEW8061',
      'IMG_0061', 'IMG_0191', 'IMG_0196', 'IMG_0197', 'IMG_0301', 'IMG_0302',
      'IMG_0303', 'IMG_0333', 'IMG_0334', 'IMG_0361', 'IMG_0362', 'IMG_0380',
      'IMG_0381', 'IMG_0772', 'IMG_0766', 'IMG_0996', 'IMG_E1168', 'IMG_E0302',
      'IMG_1068', 'IMG_1040', 'IMG_0438', 'IMG_1054', 'IMG_0821', 'IMG_0835',
      'IMG_1221', 'SVLM1691', 'TFZL3788', 'MVAL0248', 'SELZ6056', 'RXKG2236'
    ]
    
    // Get all Mauritius images
    const mauritiusImages = [
      'IMG_8045', 'IMG_8046', 'IMG_8047', 'IMG_8048', 'IMG_8058', 'IMG_8059',
      'IMG_8060', 'IMG_8064', 'IMG_8118', 'IMG_8119', 'IMG_8120', 'IMG_8132',
      'IMG_8143', 'IMG_8364', 'IMG_8365', 'IMG_E8366', 'IMG_8689', 'IMG_8851',
      'IMG_8925', 'IMG_8919', 'IMG_E8574', 'IMG_E8575', 'IMG_8918', 'IMG_E8993',
      'IMG_8924', 'IMG_8844', 'IMG_E8367'
    ]

    // Create image objects with proper paths
    const allImages = [
      ...dubaiImages.map((name, i) => ({
        id: `dubai-${i}`,
        src: `/assets/images/Dubai/${name}.JPG`,
        folder: 'dubai',
        name: name
      })),
      ...mauritiusImages.map((name, i) => ({
        id: `maur-${i}`,
        src: `/assets/images/Maur/${name}.JPG`,
        folder: 'mauritius',
        name: name
      })),
      // Also include numbered images if they exist
      ...Array.from({ length: 30 }, (_, i) => ({
        id: `num-${i}`,
        src: `/assets/images/${i + 1}.jpg`,
        folder: 'mixed',
        name: `${i + 1}`
      }))
    ]

    // Shuffle array randomly
    const shuffled = allImages.sort(() => Math.random() - 0.5)
    setImages(shuffled)
  }, [])

  const openImage = (image) => {
    setSelectedImage(image)
  }

  return (
    <div className="memories-container">
      <div className="gif-background">
        <img src="https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif" alt="romantic" className="bg-gif" />
        <img src="https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif" alt="hearts" className="bg-gif" />
      </div>

      <div className="hearts-background">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 35 + 25}px`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 25 - 12.5, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.9, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            💕
          </motion.div>
        ))}
      </div>

      <motion.div
        className="memories-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="page-title"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          Our Beautiful Memories 💕
        </motion.h1>

        <motion.p
          className="page-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          All our moments together - Click any photo to view full size
        </motion.p>

        <div className="photo-gallery">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              className="photo-item"
              initial={{ opacity: 0, scale: 0.8, rotate: Math.random() * 10 - 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ scale: 1.15, zIndex: 10, rotate: Math.random() * 5 - 2.5 }}
              onClick={() => openImage(image)}
            >
              <img
                src={image.src}
                alt={`Memory ${index + 1}`}
                onError={(e) => {
                  // Try alternative extension
                  const altSrc = image.src.replace('.JPG', '.jpg').replace('.jpg', '.JPG')
                  if (e.target.src !== altSrc) {
                    e.target.src = altSrc
                  } else {
                    e.target.style.display = 'none'
                  }
                }}
              />
              <div className="photo-overlay">
                <span className="photo-heart">❤️</span>
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
            ← Back to Heart Map
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
              onError={(e) => {
                const altSrc = selectedImage.src.replace('.JPG', '.jpg').replace('.jpg', '.JPG')
                if (e.target.src !== altSrc) {
                  e.target.src = altSrc
                }
              }}
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

export default Memories
