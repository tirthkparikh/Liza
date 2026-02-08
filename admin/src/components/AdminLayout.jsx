import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const AdminLayout = ({ children, onLogout, token }) => {
  const location = useLocation()
  const [isLizaOnline, setIsLizaOnline] = useState(false)
  const [activeGames, setActiveGames] = useState(0)

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

  useEffect(() => {
    const socket = io(BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true
    })

    socket.on('connect', () => {
      socket.emit('admin-join')
    })

    socket.on('liza-status', (status) => {
      setIsLizaOnline(status.online)
    })

    socket.on('active-games-update', (games) => {
      setActiveGames(games.length)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const navItems = [
    { icon: '📊', label: 'Dashboard', path: '/' },
    { icon: '🖼️', label: 'Images', path: '/images' },
    { icon: '📝', label: 'Love Letters', path: '/blogs' },
    { icon: '📖', label: 'Stories', path: '/stories' },
    { icon: '📅', label: 'Dates', path: '/dates' },
    { icon: '💝', label: 'Love Jar', path: '/lovejar' },
    { icon: '💌', label: 'Messages', path: '/messages' },
    { icon: '🎮', label: 'Games', path: '/games', badge: activeGames },
    { icon: '📹', label: 'Video Call', path: '/videocall' },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <nav className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">💕</span>
            <div className="sidebar-logo-text">
              <h2>Admin Panel</h2>
              <span>Tirth's Control Center</span>
            </div>
          </div>
        </div>

        <div className="sidebar-nav">
          <span className="nav-section-title">Main Menu</span>
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className={isActive(item.path) ? 'active' : ''}>
                <Link to={item.path}>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          <div className="status-card">
            <div className={`status-indicator ${isLizaOnline ? 'online' : 'offline'}`}></div>
            <div className="status-info">
              <span className="status-name">Liza</span>
              <span className="status-text">{isLizaOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          <button className="logout-button" onClick={onLogout}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout