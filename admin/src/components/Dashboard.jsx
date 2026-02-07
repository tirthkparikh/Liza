import { Link } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = ({ onLogout, token, API_URL: propAPI_URL }) => {
  const API_URL = propAPI_URL || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5001/api')
  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="logo">
          <h2>💕 Admin Panel</h2>
        </div>
        <ul className="nav-menu">
          <li className="active"><Link to="/">📊 Dashboard</Link></li>
          <li><Link to="/images">🖼️ Images</Link></li>
          <li><Link to="/blogs">📝 Love Letters</Link></li>
          <li><Link to="/stories">📖 Stories</Link></li>
          <li><Link to="/dates">📅 Dates</Link></li>
          <li><Link to="/lovejar">💝 Love Jar</Link></li>
          <li><Link to="/letters">💌 Quick Message</Link></li>
          <li><Link to="/games">🎮 Games</Link></li>
          <li><Link to="/videocall">📹 Video Call</Link></li>
        </ul>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </nav>

      <main className="main-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Images</h3>
            <p className="stat-number">Manage photos</p>
            <Link to="/images" className="stat-link">View Images →</Link>
          </div>
          <div className="stat-card">
            <h3>Blogs</h3>
            <p className="stat-number">Love letters & posts</p>
            <Link to="/blogs" className="stat-link">View Blogs →</Link>
          </div>
          <div className="stat-card">
            <h3>Stories</h3>
            <p className="stat-number">Our memories</p>
            <Link to="/stories" className="stat-link">View Stories →</Link>
          </div>
          <div className="stat-card">
            <h3>Dates</h3>
            <p className="stat-number">Plan special moments</p>
            <Link to="/dates" className="stat-link">View Dates →</Link>
          </div>
        </div>

        <div className="welcome-box">
          <h2>Welcome to Admin Panel! 💕</h2>
          <p>Manage images, blogs, and stories for the Liza Love website.</p>
          <p>Use the sidebar to navigate to different sections.</p>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

