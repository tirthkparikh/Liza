import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './LoveNotifications.css'

const LoveNotifications = () => {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Check for new content periodically
    checkForNewContent()
    const interval = setInterval(checkForNewContent, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const checkForNewContent = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
      
      // Get last visit time from localStorage
      const lastVisit = localStorage.getItem('lastVisitTime')
      const currentTime = new Date().toISOString()
      
      // Fetch new stories
      const storiesResponse = await fetch(`${API_URL}/api/stories`)
      const stories = storiesResponse.ok ? await storiesResponse.json() : []
      
      // Fetch new blogs
      const blogsResponse = await fetch(`${API_URL}/api/blogs`)
      const blogs = blogsResponse.ok ? await blogsResponse.json() : []
      
      const newNotifications = []
      
      // Check for new stories
      stories.forEach(story => {
        if (lastVisit && new Date(story.createdAt) > new Date(lastVisit)) {
          newNotifications.push({
            id: story._id,
            type: 'story',
            title: story.title,
            message: `A new chapter has been added to our love story!`,
            time: story.createdAt
          })
        }
      })
      
      // Check for new blogs
      blogs.forEach(blog => {
        if (lastVisit && new Date(blog.createdAt) > new Date(lastVisit)) {
          newNotifications.push({
            id: blog._id,
            type: 'blog',
            title: blog.title,
            message: `A new love message is waiting for you!`,
            category: blog.category,
            time: blog.createdAt
          })
        }
      })
      
      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev].slice(0, 5))
      }
      
      // Update last visit time
      localStorage.setItem('lastVisitTime', currentTime)
    } catch (error) {
      console.error('Error checking for new content:', error)
    }
  }

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="love-notifications-container">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className={`love-notification ${notification.type}`}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="notification-icon">
              {notification.type === 'story' ? '📖' : 
               notification.category === 'love' ? '💕' :
               notification.category === 'memories' ? '📸' :
               notification.category === 'promises' ? '💍' : '💌'}
            </div>
            <div className="notification-content">
              <h4>{notification.type === 'story' ? 'New Story Added!' : 'New Love Message!'}</h4>
              <p className="notification-title">{notification.title}</p>
              <p className="notification-message">{notification.message}</p>
            </div>
            <button 
              className="notification-close"
              onClick={() => dismissNotification(notification.id)}
            >
              ✕
            </button>
            <div className="notification-hearts">
              <span>💕</span>
              <span>💖</span>
              <span>💕</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default LoveNotifications
