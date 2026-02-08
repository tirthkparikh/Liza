import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { motion, AnimatePresence } from 'framer-motion'
import './NotificationToast.css'

const NotificationToast = () => {
  const [notifications, setNotifications] = useState([])
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    
    const newSocket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true
    })
    
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Notification socket connected')
      newSocket.emit('lover-join')
    })

    // Listen for all notification types
    newSocket.on('new-message', (data) => {
      showNotification('💌 New Message', data.senderName || 'Tirth', 'message')
    })

    newSocket.on('call-request', (data) => {
      showNotification('📹 Incoming Call', data.callerName || 'Tirth', 'call')
    })

    newSocket.on('game-invite', (data) => {
      showNotification('🎮 Game Invitation', data.inviterName || 'Tirth', 'game')
    })

    newSocket.on('tirth-status', (status) => {
      if (status.online) {
        showNotification('💚 Tirth is Online', 'Tirth just came online!', 'status')
      }
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const showNotification = (title, message, type) => {
    const id = Date.now()
    const newNotification = { id, title, message, type }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="notification-container">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className={`notification-toast ${notification.type}`}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={() => removeNotification(notification.id)}
          >
            <div className="notification-content">
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
            </div>
            <button className="notification-close">×</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationToast