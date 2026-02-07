import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import axios from 'axios'
import './Games.css'

const Games = ({ token, API_URL: propAPI_URL }) => {
  const API_URL = propAPI_URL || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5001/api')
  const navigate = useNavigate()
  const [activeTicTacToe, setActiveTicTacToe] = useState(null)
  const [activeConnectFour, setActiveConnectFour] = useState(null)
  const [loading, setLoading] = useState(true)
  const socketRef = useState(null)

  useEffect(() => {
    checkActiveGames()
    
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    const socket = io(BASE_URL)
    socketRef.current = socket
    
    return () => {
      socket.disconnect()
    }
  }, [])

  const checkActiveGames = async () => {
    try {
      setLoading(true)
      
      // Get Tic Tac Toe games
      const tttResponse = await axios.get(`${API_URL}/games`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Get Connect Four games
      const cfResponse = await axios.get(`${API_URL}/connectfour`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (tttResponse.data && tttResponse.data.length > 0) {
        setActiveTicTacToe(tttResponse.data[0])
      }
      
      if (cfResponse.data && cfResponse.data.length > 0) {
        setActiveConnectFour(cfResponse.data[0])
      }
    } catch (error) {
      console.error('Error checking games:', error)
    } finally {
      setLoading(false)
    }
  }

  const startTicTacToe = async () => {
    try {
      let game
      
      if (activeTicTacToe && activeTicTacToe.status === 'waiting') {
        game = await axios.post(`${API_URL}/games/${activeTicTacToe._id}/join`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        game = game.data
      } else {
        game = await axios.post(`${API_URL}/games`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        game = game.data
      }
      
      navigate(`/games/tictactoe?id=${game._id}`)
    } catch (error) {
      console.error('Error starting game:', error)
      alert('Error starting game. Please try again.')
    }
  }

  const startConnectFour = async () => {
    try {
      let game
      
      if (activeConnectFour && activeConnectFour.status === 'waiting') {
        game = await axios.post(`${API_URL}/connectfour/${activeConnectFour._id}/join`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        game = game.data
      } else {
        game = await axios.post(`${API_URL}/connectfour`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        game = game.data
      }
      
      navigate(`/games/connectfour?id=${game._id}`)
    } catch (error) {
      console.error('Error starting game:', error)
      alert('Error starting game. Please try again.')
    }
  }

  const games = [
    {
      id: 'tictactoe',
      name: 'Tic Tac Toe',
      emoji: '⭕',
      description: 'Classic X and O game. First to get 3 in a row wins!',
      color: '#ff6b9d',
      active: activeTicTacToe && activeTicTacToe.status === 'playing',
      onClick: startTicTacToe
    },
    {
      id: 'connectfour',
      name: 'Connect Four',
      emoji: '🔴',
      description: 'Drop discs and be the first to connect 4 in a row!',
      color: '#2196f3',
      active: activeConnectFour && activeConnectFour.status === 'playing',
      onClick: startConnectFour
    },
    {
      id: 'rps',
      name: 'Rock Paper Scissors',
      emoji: '✊',
      description: 'Quick game of Rock Paper Scissors!',
      color: '#9c27b0',
      active: false,
      onClick: () => navigate('/games/rps')
    }
  ]

  const hasActiveGame = activeTicTacToe || activeConnectFour

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
          <li><Link to="/letters">💌 Quick Message</Link></li>
          <li className="active"><Link to="/games">🎮 Games</Link></li>
          <li><Link to="/videocall">📹 Video Call</Link></li>
        </ul>
      </nav>

      <main className="main-content">
        <div className="header-actions">
          <h1>Play Games with Liza 🎮</h1>
        </div>

        {hasActiveGame && !loading && (
          <motion.div
            className="active-game-alert"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="pulse-dot"></span>
            <p>🎮 Active game with Liza! Click to continue playing</p>
          </motion.div>
        )}

        <div className="games-grid-admin">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              className={`game-card-admin ${game.active ? 'active' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={game.onClick}
            >
              {game.active && (
                <div className="active-badge">
                  <span className="pulse"></span>
                  Playing with Liza!
                </div>
              )}
              
              <div 
                className="game-icon-admin"
                style={{ backgroundColor: `${game.color}20`, borderColor: game.color }}
              >
                <span style={{ fontSize: '3em' }}>{game.emoji}</span>
              </div>
              
              <h3 className="game-name-admin">{game.name}</h3>
              <p className="game-description-admin">{game.description}</p>

              <motion.button
                className="play-btn-admin"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {game.active ? 'Continue Game 🎮' : 'Play with Liza ▶'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Games
