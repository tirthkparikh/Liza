import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import axios from 'axios'
import '../App.css'
import './Messages.css'

const Messages = ({ token, API_URL: propAPI_URL }) => {
  const API_URL = propAPI_URL || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5001/api')
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLizaOnline, setIsLizaOnline] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

  useEffect(() => {
    fetchMessages()

    const socket = io(BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true
    })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Admin Messages connected')
      socket.emit('join-messages', 'admin')
    })

    socket.on('new-message', (message) => {
      setMessages(prev => [...prev, message])
      if (message.sender === 'lover') {
        setUnreadCount(prev => prev + 1)
      }
      scrollToBottom()
    })

    socket.on('liza-status', (status) => {
      setIsLizaOnline(status.online)
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
      const response = await axios.get(`${API_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessages(response.data.reverse())
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
      sender: 'admin',
      senderName: 'Tirth',
      content: newMessage,
      type: 'text',
      timestamp: new Date().toISOString()
    }

    try {
      const response = await axios.post(`${API_URL}/messages`, messageData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNewMessage('')
      // Emit via socket for real-time update
      if (socketRef.current) {
        socketRef.current.emit('send-message', response.data)
      }
      // Add to local state immediately
      setMessages(prev => [...prev, response.data])
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

  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="logo"><h2>💕 Admin Panel</h2></div>
        <ul className="nav-menu">
          <li><Link to="/">📊 Dashboard</Link></li>
          <li><Link to="/images">🖼️ Images</Link></li>
          <li><Link to="/blogs">📝 Love Letters</Link></li>
          <li><Link to="/stories">📖 Stories</Link></li>
          <li><Link to="/dates">📅 Dates</Link></li>
          <li><Link to="/lovejar">💝 Love Jar</Link></li>
          <li className="active"><Link to="/messages">💬 Chat</Link></li>
          <li><Link to="/games">🎮 Games</Link></li>
          <li><Link to="/videocall">📹 Video Call</Link></li>
        </ul>
      </nav>

      <main className="main-content">
        <div className="messages-content">
          <header className="messages-header">
            <h1>Chat with Liza 💬</h1>
            <div className="chat-status">
              <span className={`status-indicator ${isLizaOnline ? 'online' : 'offline'}`}></span>
              <span>Liza is {isLizaOnline ? 'online' : 'offline'}</span>
            </div>
          </header>

          <div className="messages-list">
            {messages.length === 0 ? (
              <div className="empty-chat">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💬
                </motion.div>
                <h3>No messages yet</h3>
                <p>Start a conversation with Liza!</p>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="message-group">
                  <div className="date-separator">{date}</div>
                  {dateMessages.map((message, index) => (
                    <motion.div
                      key={message._id || index}
                      className={`message ${message.sender === 'admin' ? 'sent' : 'received'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="message-bubble">
                        <p>{message.content}</p>
                        <span className="message-time">
                          {formatTime(message.timestamp)}
                          {message.sender === 'admin' && (
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

          <form className="message-input-container" onSubmit={sendMessage}>
            {!isLizaOnline && (
              <div className="offline-warning">
                Liza is offline. She will receive an email notification.
              </div>
            )}
            <div className="input-wrapper">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="message-input"
              />
              <button type="submit" className="send-button" disabled={!newMessage.trim()}>
                Send ➤
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Messages