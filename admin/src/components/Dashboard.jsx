import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { io } from 'socket.io-client'
import './Dashboard.css'

const Dashboard = ({ onLogout, token, API_URL: propAPI_URL }) => {
  const API_URL = propAPI_URL || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5001/api')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLizaOnline, setIsLizaOnline] = useState(false)
  const [activeGames, setActiveGames] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [recentActivity, setRecentActivity] = useState([])
  const [stats, setStats] = useState({
    totalImages: 0,
    totalBlogs: 0,
    totalStories: 0,
    totalDates: 0
  })

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

  useEffect(() => {
    // Update time
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Socket connection
    const socket = io(BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true
    })

    socket.on('connect', () => {
      console.log('Admin Dashboard connected')
      // Emit that admin (Tirth) is online
      socket.emit('admin-join')
      // Request current status
      socket.emit('get-status')
    })

    socket.on('liza-status', (status) => {
      setIsLizaOnline(status.online)
    })

    socket.on('active-games-update', (games) => {
      setActiveGames(games.length)
    })

    socket.on('new-message', (message) => {
      setUnreadMessages(prev => prev + 1)
      addActivity('message', 'New message from Liza', message.time)
    })

    // Fetch initial stats
    fetchStats()

    return () => {
      clearInterval(timer)
      socket.disconnect()
    }
  }, [])

  const fetchStats = async () => {
    // This would fetch real stats from API
    // For now using placeholder data
    setStats({
      totalImages: 24,
      totalBlogs: 12,
      totalStories: 8,
      totalDates: 5
    })
  }

  const addActivity = (type, text, time) => {
    const newActivity = {
      id: Date.now(),
      type,
      text,
      time: time || new Date().toLocaleTimeString()
    }
    setRecentActivity(prev => [newActivity, ...prev].slice(0, 10))
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const quickActions = [
    { icon: '🖼️', label: 'Add Image', path: '/images', color: '#667eea' },
    { icon: '📝', label: 'Write Letter', path: '/blogs', color: '#764ba2' },
    { icon: '📖', label: 'Add Story', path: '/stories', color: '#f093fb' },
    { icon: '📅', label: 'Plan Date', path: '/dates', color: '#ff6b9d' },
    { icon: '🎮', label: 'Start Game', path: '/games', color: '#4caf50' },
    { icon: '💌', label: 'Quick Message', path: '/letters', color: '#ff9800' },
  ]

  const navItems = [
    { icon: '📊', label: 'Dashboard', path: '/', active: true },
    { icon: '🖼️', label: 'Images', path: '/images' },
    { icon: '📝', label: 'Love Letters', path: '/blogs' },
    { icon: '📖', label: 'Stories', path: '/stories' },
    { icon: '📅', label: 'Dates', path: '/dates' },
    { icon: '💝', label: 'Love Jar', path: '/lovejar' },
    { icon: '💌', label: 'Quick Message', path: '/letters' },
    { icon: '💬', label: 'Chat', path: '/messages', badge: unreadMessages > 0 ? unreadMessages : null },
    { icon: '🎮', label: 'Games', path: '/games', badge: activeGames > 0 ? activeGames : null },
    { icon: '📹', label: 'Video Call', path: '/videocall' },
  ]

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <nav className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">💕</span>
            <div className="logo-text">
              <h2>Admin Panel</h2>
              <span className="logo-subtitle">Tirth's Control Center</span>
            </div>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Main Menu</span>
            <ul className="nav-menu">
              {navItems.map((item) => (
                <li key={item.path} className={item.active ? 'active' : ''}>
                  <Link to={item.path}>
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="liza-status-card">
            <div className={`status-indicator ${isLizaOnline ? 'online' : 'offline'}`}>
              <div className="status-pulse"></div>
            </div>
            <div className="status-info">
              <span className="status-name">Liza</span>
              <span className="status-text">{isLizaOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="admin-main-content">
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            <h1>Welcome back, Tirth! 👋</h1>
            <p className="header-time">{formatTime(currentTime)}</p>
          </div>
          <div className="header-right">
            <div className="notification-bell">
              <span className="bell-icon">🔔</span>
              {unreadMessages > 0 && (
                <span className="bell-badge">{unreadMessages}</span>
              )}
            </div>
            <div className="user-avatar">
              <span>T</span>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <section className="stats-section">
          <h2 className="section-title">Overview</h2>
          <div className="stats-grid">
            <motion.div 
              className="stat-card"
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)' }}
            >
              <div className="stat-icon-wrapper" style={{ background: 'rgba(102, 126, 234, 0.2)' }}>
                <span className="stat-emoji">🖼️</span>
              </div>
              <div className="stat-info">
                <h3>{stats.totalImages}</h3>
                <p>Total Images</p>
              </div>
              <Link to="/images" className="stat-arrow">→</Link>
            </motion.div>

            <motion.div 
              className="stat-card"
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(118, 75, 162, 0.3)' }}
            >
              <div className="stat-icon-wrapper" style={{ background: 'rgba(118, 75, 162, 0.2)' }}>
                <span className="stat-emoji">📝</span>
              </div>
              <div className="stat-info">
                <h3>{stats.totalBlogs}</h3>
                <p>Love Letters</p>
              </div>
              <Link to="/blogs" className="stat-arrow">→</Link>
            </motion.div>

            <motion.div 
              className="stat-card"
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)' }}
            >
              <div className="stat-icon-wrapper" style={{ background: 'rgba(240, 147, 251, 0.2)' }}>
                <span className="stat-emoji">📖</span>
              </div>
              <div className="stat-info">
                <h3>{stats.totalStories}</h3>
                <p>Stories</p>
              </div>
              <Link to="/stories" className="stat-arrow">→</Link>
            </motion.div>

            <motion.div 
              className="stat-card"
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(255, 107, 157, 0.3)' }}
            >
              <div className="stat-icon-wrapper" style={{ background: 'rgba(255, 107, 157, 0.2)' }}>
                <span className="stat-emoji">📅</span>
              </div>
              <div className="stat-info">
                <h3>{stats.totalDates}</h3>
                <p>Planned Dates</p>
              </div>
              <Link to="/dates" className="stat-arrow">→</Link>
            </motion.div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.path}
                className="quick-action-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: `0 10px 30px ${action.color}40`,
                  borderColor: action.color 
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={action.path}>
                  <div 
                    className="action-icon" 
                    style={{ background: `${action.color}20`, color: action.color }}
                  >
                    {action.icon}
                  </div>
                  <span className="action-label">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="dashboard-columns">
          {/* Recent Activity */}
          <section className="activity-section">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.length === 0 ? (
                <div className="no-activity">
                  <span className="no-activity-icon">📋</span>
                  <p>No recent activity</p>
                  <span className="no-activity-hint">Your actions will appear here</span>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <motion.div 
                    key={activity.id}
                    className="activity-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className={`activity-icon ${activity.type}`}>
                      {activity.type === 'message' && '💌'}
                      {activity.type === 'game' && '🎮'}
                      {activity.type === 'image' && '🖼️'}
                      {activity.type === 'call' && '📹'}
                    </div>
                    <div className="activity-content">
                      <p>{activity.text}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Connection Status */}
          <section className="connection-section">
            <h2 className="section-title">Connection Status</h2>
            <div className="connection-cards">
              <div className={`connection-card ${isLizaOnline ? 'online' : 'offline'}`}>
                <div className="connection-icon">
                  {isLizaOnline ? '💚' : '🖤'}
                </div>
                <div className="connection-info">
                  <h3>Liza is {isLizaOnline ? 'Online' : 'Offline'}</h3>
                  <p>{isLizaOnline ? 'You can chat, call, and play games together!' : 'She will be notified when you send messages or start games'}</p>
                </div>
              </div>

              <div className="connection-card">
                <div className="connection-icon">🎮</div>
                <div className="connection-info">
                  <h3>Active Games</h3>
                  <p>{activeGames > 0 ? `${activeGames} game${activeGames > 1 ? 's' : ''} in progress` : 'No active games'}</p>
                  {activeGames > 0 && (
                    <Link to="/games" className="connection-link">Continue playing →</Link>
                  )}
                </div>
              </div>

              <div className="connection-card">
                <div className="connection-icon">💌</div>
                <div className="connection-info">
                  <h3>Messages</h3>
                  <p>{unreadMessages > 0 ? `${unreadMessages} unread message${unreadMessages > 1 ? 's' : ''}` : 'No new messages'}</p>
                  {unreadMessages > 0 && (
                    <Link to="/letters" className="connection-link">Read messages →</Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Dashboard