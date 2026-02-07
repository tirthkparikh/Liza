import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { getActiveGame, createGame, joinGame, getActiveConnectFour, createConnectFour, joinConnectFour } from '../utils/api'
import './Games.css'

const Games = () => {
  const navigate = useNavigate()
  const [activeTicTacToe, setActiveTicTacToe] = useState(null)
  const [activeConnectFour, setActiveConnectFour] = useState(null)
  const [loading, setLoading] = useState(true)
  const socketRef = useState(null)

  useEffect(() => {
    checkActiveGames()
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    const socket = io(API_URL)
    socketRef.current = socket
    
    return () => {
      socket.disconnect()
    }
  }, [])

  const checkActiveGames = async () => {
    try {
      setLoading(true)
      const [tttGames, cfGames] = await Promise.all([
        getActiveGame(),
        getActiveConnectFour()
      ])
      
      if (tttGames && tttGames.length > 0) {
        setActiveTicTacToe(tttGames[0])
      }
      
      if (cfGames && cfGames.length > 0) {
        setActiveConnectFour(cfGames[0])
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
        game = await joinGame(activeTicTacToe._id)
      } else {
        game = await createGame()
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
        game = await joinConnectFour(activeConnectFour._id)
      } else {
        game = await createConnectFour()
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
      description: 'Classic X and O game. First to get 3 in a row wins! Play together in real-time.',
      color: '#ff6b9d',
      players: '2 players',
      active: activeTicTacToe && activeTicTacToe.status === 'playing',
      onClick: startTicTacToe
    },
    {
      id: 'connectfour',
      name: 'Connect Four',
      emoji: '🔴',
      description: 'Drop discs and be the first to connect 4 in a row! Strategic and fun.',
      color: '#2196f3',
      players: '2 players',
      active: activeConnectFour && activeConnectFour.status === 'playing',
      onClick: startConnectFour
    },
    {
      id: 'rps',
      name: 'Rock Paper Scissors',
      emoji: '✊',
      description: 'Quick game of Rock Paper Scissors! Best of 3 or play unlimited rounds.',
      color: '#9c27b0',
      players: '2 players',
      active: false,
      onClick: () => navigate('/games/rps')
    }
  ]

  const hasActiveGame = activeTicTacToe || activeConnectFour

  return (
    <div className="games-container">
      <div className="floating-hearts">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 15}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            🎮
          </motion.div>
        ))}
      </div>

      <motion.div
        className="games-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="page-title"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          Games 🎮
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Play together with Tirth! 💕
        </motion.p>

        {/* Active Game Alert */}
        {hasActiveGame && !loading && (
          <motion.div
            className="active-game-alert"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="pulse-dot"></span>
            <p>🎮 Active game in progress! Click to continue playing</p>
          </motion.div>
        )}

        <div className="games-grid">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              className={`game-card ${game.active ? 'active' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={game.onClick}
            >
              {game.active && (
                <div className="active-badge">
                  <span className="pulse"></span>
                  Playing now!
                </div>
              )}
              
              <div 
                className="game-icon"
                style={{ backgroundColor: `${game.color}20`, borderColor: game.color }}
              >
                <span style={{ fontSize: '3em' }}>{game.emoji}</span>
              </div>
              
              <h3 className="game-name">{game.name}</h3>
              <p className="game-description">{game.description}</p>
              
              <div className="game-meta">
                <span className="multiplayer-badge">👥 {game.players}</span>
              </div>

              <motion.button
                className="play-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {game.active ? 'Continue Game 🎮' : 'Start Game ▶'}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          className="how-it-works"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3>🎮 How It Works</h3>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <p>Choose a game</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <p>Wait for Tirth to join</p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <p>Play together in real-time!</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Link to="/" className="nav-button">
            ← Back to Heart Map
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Games
