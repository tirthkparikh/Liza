import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './MovieScene.css'

const MovieScene = ({ onClose }) => {
  const [currentScene, setCurrentScene] = useState(0)

  // Better romantic GIFs that actually work
  const scenes = [
    {
      text: "In a world of billions, our hearts found each other...",
      gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2o3cTRxbXJ2bmd4cHZrNG1vbThoYzF3bWR2cG10bmZqbTV2a3Y1dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7aCTPPm4OHfRLSH6/giphy.gif",
      duration: 4000,
      style: "cinematic"
    },
    {
      text: "Every moment with you feels like magic...",
      gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGtxdHRiM2FkbmZ1eWkwaWZ1eWZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYC0LajbaPoEADu/giphy.gif",
      duration: 4000,
      style: "romantic"
    },
    {
      text: "Your smile lights up my darkest days...",
      gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BRuo6sLetdllPAQ/giphy.gif",
      duration: 4000,
      style: "dreamy"
    },
    {
      text: "Your laughter is my favorite melody...",
      gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l378e6l8EdzdENj8Y/giphy.gif",
      duration: 4000,
      style: "musical"
    },
    {
      text: "In your eyes, I found my forever home...",
      gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tn33aiTi1jkl6H6/giphy.gif",
      duration: 4000,
      style: "intimate"
    },
    {
      text: "Every heartbeat whispers your name...",
      gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41lUjISjtf5ma3hC/giphy.gif",
      duration: 4000,
      style: "magical"
    },
    {
      text: "Together, we write our own fairy tale...",
      gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6Zt3AX5ID7J4tJEA/giphy.gif",
      duration: 4000,
      style: "epic"
    },
    {
      text: "This is our love story, Liza...",
      gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26FLdmIp6wJrqaJmE/giphy.gif",
      duration: 4000,
      style: "epic"
    },
    {
      text: "Forever isn't long enough with you...",
      gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eGZ5Z2Z1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKTDn976rzVgky4/giphy.gif",
      duration: 4000,
      style: "dreamy"
    },
    {
      text: "I love you more than words can say ❤️",
      gif: null,
      duration: 5000,
      style: "finale"
    }
  ]

  useEffect(() => {
    if (currentScene < scenes.length) {
      const timer = setTimeout(() => {
        if (currentScene === scenes.length - 1) {
          setTimeout(() => onClose(), scenes[currentScene].duration)
        } else {
          setCurrentScene(currentScene + 1)
        }
      }, scenes[currentScene].duration)
      return () => clearTimeout(timer)
    }
  }, [currentScene])

  return (
    <AnimatePresence>
      <motion.div
        className="movie-scene"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Cinematic Bars */}
        <div className="cinematic-bar top"></div>
        <div className="cinematic-bar bottom"></div>
        
        {/* Progress Bar */}
        <div className="scene-progress">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="movie-content">
          {scenes[currentScene] && (
            <>
              {scenes[currentScene].gif && (
                <motion.div
                  className="scene-image-container"
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 1.5 }}
                >
                  <img
                    src={scenes[currentScene].gif}
                    alt="romantic scene"
                    className="scene-gif"
                    onError={(e) => {
                      // Fallback if GIF fails to load
                      e.target.src = 'https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif';
                    }}
                  />
                  <div className="scene-overlay"></div>
                </motion.div>
              )}
              
              <motion.div
                className="text-container"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <motion.h2
                  className={`scene-text ${scenes[currentScene].style}`}
                  key={currentScene}
                >
                  {scenes[currentScene].text}
                </motion.h2>
              </motion.div>

              {/* Scene Counter */}
              <motion.div 
                className="scene-counter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {currentScene + 1} / {scenes.length}
              </motion.div>
            </>
          )}
        </div>

        {/* Skip Button */}
        <motion.button
          className="skip-button"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Skip Movie ⏭
        </motion.button>
      </motion.div>
    </AnimatePresence>
  )
}

export default MovieScene
