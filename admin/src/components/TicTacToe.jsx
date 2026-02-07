import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { getGame, makeMove } from '../utils/api'
import './TicTacToe.css'

const TicTacToe = ({ token, API_URL: propAPI_URL }) => {
  const API_URL = propAPI_URL || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5001/api')
  const [searchParams] = useSearchParams()
  const gameId = searchParams.get('id')
  
  const [game, setGame] = useState(null)
  const [playerSymbol, setPlayerSymbol] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [socketConnected, setSocketConnected] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    if (!gameId) {
      setError('No game ID provided')
      setLoading(false)
      return
    }

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    const socket = io(BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })
    
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      setSocketConnected(true)
      socket.emit('join-game', gameId)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
      setSocketConnected(false)
    })

    socket.on('move-made', (data) => {
      console.log('Move received:', data)
      if (data && data.game) {
        setGame(data.game)
      }
    })

    socket.on('game-ended', (data) => {
      console.log('Game ended:', data)
      if (data && data.game) {
        setGame(data.game)
      }
    })

    socket.on('player-joined', () => {
      console.log('Player joined, refreshing game...')
      fetchGame()
    })

    fetchGame()

    return () => {
      socket.disconnect()
    }
  }, [gameId])

  const fetchGame = async () => {
    try {
      const gameData = await getGame(gameId)
      setGame(gameData)
      
      const player = gameData.players.find(p => p.role === 'admin')
      if (player) {
        setPlayerSymbol(player.symbol)
      } else {
        setPlayerSymbol('X')
      }
      
      setLoading(false)
    } catch (err) {
      setError('Error loading game')
      setLoading(false)
    }
  }

  const handleCellClick = async (index) => {
    if (!game || game.status !== 'playing') return
    if (game.board[index]) return
    if (game.currentTurn !== playerSymbol) return

    try {
      const updatedGame = await makeMove(gameId, index, playerSymbol)
      setGame(updatedGame)
      
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('make-move', {
          gameId,
          game: updatedGame
        })
      }
    } catch (err) {
      console.error('Error making move:', err)
    }
  }

  const getStatusMessage = () => {
    if (!game) return ''
    if (!socketConnected) return 'Connecting to game...'
    if (game.status === 'waiting') return 'Waiting for Liza to join...'
    if (game.status === 'finished') {
      if (game.winner === 'draw') return "It's a draw! 🤝"
      if (game.winner === playerSymbol) return 'You won Tirth! 🎉'
      return 'Liza won! Great game! 💕'
    }
    if (game.currentTurn === playerSymbol) return 'Your turn Tirth! ⭐'
    return "Liza's turn... 💭"
  }

  const renderCell = (index) => {
    const value = game?.board[index]
    const isWinningCell = game?.winner && game.winner !== 'draw' && 
      [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
        .some(combo => combo.includes(index) && combo.every(i => game.board[i] === game.winner))

    return (
      <motion.button
        key={index}
        className={`cell ${value ? 'filled' : ''} ${isWinningCell ? 'winning' : ''}`}
        onClick={() => handleCellClick(index)}
        whileHover={!value && game?.currentTurn === playerSymbol ? { scale: 1.05 } : {}}
        whileTap={!value && game?.currentTurn === playerSymbol ? { scale: 0.95 } : {}}
        disabled={!!value || game?.currentTurn !== playerSymbol || game?.status !== 'playing'}
      >
        {value && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={value === 'X' ? 'x-mark' : 'o-mark'}
          >
            {value}
          </motion.span>
        )}
      </motion.button>
    )
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <main className="main-content">
          <div className="loading">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              ⭕
            </motion.div>
            <p>Loading game...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <main className="main-content">
          <div className="error">
            <p>{error}</p>
            <Link to="/games" className="back-btn">← Back to Games</Link>
          </div>
        </main>
      </div>
    )
  }

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
        <div className="tictactoe-content">
          <h1>Tic Tac Toe with Liza ⭕</h1>

          {!socketConnected && (
            <div className="connection-status">
              <span className="connecting-dot"></span>
              Connecting to server...
            </div>
          )}

          <div className="players-info">
            <div className={`player-box ${playerSymbol === 'X' ? 'active' : ''}`}>
              <span className="player-symbol">❌</span>
              <span className="player-name">Tirth (You)</span>
            </div>
            <div className="vs">VS</div>
            <div className={`player-box ${playerSymbol === 'O' ? 'active' : ''}`}>
              <span className="player-symbol">⭕</span>
              <span className="player-name">Liza</span>
            </div>
          </div>

          <motion.div 
            className="game-status"
            key={getStatusMessage()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>{getStatusMessage()}</p>
          </motion.div>

          <div className="game-board">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => renderCell(index))}
          </div>

          <div className="your-symbol">
            <p>You are playing as: <strong>{playerSymbol === 'X' ? '❌' : '⭕'}</strong></p>
          </div>

          <div className="navigation-buttons">
            <Link to="/games" className="nav-button">← Back to Games</Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TicTacToe
