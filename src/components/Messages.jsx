import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import './Messages.css'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isTirthOnline, setIsTirthOnline] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

  useEffect(() => {
    // Load messages from API
    fetchMessages()

    // Setup socket connection
    const socket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true
    })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Messages connected')
      socket.emit('join-messages', 'lover')
    })

    socket.on('new-message', (message) => {
      setMessages(prev => [...prev, message])
      if (message.sender === 'admin') {
        setUnreadCount(prev => prev + 1)
      }
      scrollToBottom()
    })

    socket.on('tirth-status', (status) => {
      setIsTirthOnline(status.online)
    })

    socket.on('message-read', ({ messageId }) => {
      setMessages(prev => 
        prev.map(msg => 
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      )
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/messages`)
      const data = await response.json()
      setMessages(data.reverse())
      scrollToBottom()
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const messageData = {
      sender: 'lover',
      senderName: 'Liza',
      content: newMessage,
      type: 'text',
      timestamp: new Date().toISOString()
    }

    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      })

      if (response.ok) {
        const savedMessage = await response.json()
        setNewMessage('')
        // Emit via socket for real-time update
        if (socketRef.current) {
          socketRef.current.emit('send-message', savedMessage)
        }
        // Add to local state immediately
        setMessages(prev => [...prev, savedMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  return (
    <div className="messages-container">
      {/* Background */}
      <div className="messages-bg">
        <div className="bg-gradient"></div>
      </div>

      {/* Header */}
      <motion.header 
        className="messages-header"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        <Link to="/" className="back-btn">
          <span>←</span>
          <span>Back</span>
        </Link>
        
        <div className="chat-partner">
          <div className="partner-avatar">T</div>
          <div className="partner-info">
            <h2>Tirth</h2>
            <div className="partner-status">
              <span className={`status-dot ${isTirthOnline ? 'online' : 'offline'}`}></span>
              <span>{isTirthOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <Link to="/videocall" className="video-call-btn" title="Video Call">
            📹
          </Link>
        </div>
      </motion.header>

      {/* Messages Area */}
      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="empty-state">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="empty-icon"
            >
              💌
            </motion.div>
            <h3>No messages yet</h3>
            <p>Start a conversation with Tirth!</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="message-group">
              <div className="date-divider">
                <span>{date}</span>
              </div>
              
              {dateMessages.map((message, index) => (
                <motion.div
                  key={message._id || index}
                  className={`message ${message.sender === 'lover' ? 'sent' : 'received'}`}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-bubble">
                    <p className="message-content">{message.content}</p>
                    <span className="message-time">
                      {formatTime(message.timestamp)}
                      {message.sender === 'lover' && (
                        <span className="read-status">
                          {message.read ? ' ✓✓' : ' ✓'}
                        </span>
                      )}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.form 
        className="message-input-area"
        onSubmit={sendMessage}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        {!isTirthOnline && (
          <div className="offline-notice">
            <span>⚠️ Tirth is offline. He will receive an email notification.</span>
          </div>
        )}
        
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
          />
          <motion.button
            type="submit"
            className="send-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!newMessage.trim()}
          >
            <span>Send</span>
            <span>➤</span>
          </motion.button>
        </div>
      </motion.form>
    </div>
  )
}

export default Messages