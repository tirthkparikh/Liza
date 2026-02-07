import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './MovieScene.css'

const MovieScene = ({ onClose }) => {
  const [currentScene, setCurrentScene] = useState(0)

  const scenes = [
    {
      text: "In a world where love stories are written in the stars...",
      image: "https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif",
      duration: 3000
    },
    {
      text: "Two hearts found each other...",
      image: "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
      duration: 3000
    },
    {
      text: "And created a love story that will last forever...",
      image: "https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif",
      duration: 3000
    },
    {
      text: "This is our story, Liza ❤️",
      image: null,
      duration: 4000
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
        <div className="movie-content">
          {scenes[currentScene] && (
            <>
              {scenes[currentScene].image && (
                <motion.img
                  src={scenes[currentScene].image}
                  alt="scene"
                  className="scene-gif"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                />
              )}
              <motion.h2
                className="scene-text"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
              >
                {scenes[currentScene].text}
              </motion.h2>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MovieScene

