import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { getGame, makeMove } from '../utils/api'
import './TicTacToe.css'

const TicTacToe = () => {
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

    // Setup socket
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    const socket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })
    
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      setSocketConnected(true)
      // Join game room after connection
      socket.emit('join-game', gameId)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
      setSocketConnected(false)
    })

    // Listen for moves
    socket.on('move-made', (data) => {
      console.log('Move received:', data)
      if (data && data.game) {
        setGame(data.game)
      }
    })

    // Listen for game end
    socket.on('game-ended', (data) => {
      console.log('Game ended:', data)
      if (data && data.game) {
        setGame(data.game)
      }
    })

    // Listen for player joining
    socket.on('player-joined', () => {
      console.log('Player joined, refreshing game...')
      // Refresh game data when another player joins
      fetchGame()
    })

    // Initial fetch
    fetchGame()

    return () => {
      socket.disconnect()
    }
  }, [gameId])

  const fetchGame = async () => {
    try {
      const gameData = await getGame(gameId)
      setGame(gameData)
      
      // In core website, user is always Liza (lover role)
      const player = gameData.players.find(p => p.role === 'lover')
      if (player) {
        setPlayerSymbol(player.symbol)
      } else {
        setPlayerSymbol('O')
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
      
      // Emit move to other player
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
    if (game.status === 'waiting') return 'Waiting for Tirth to join...'
    if (game.status === 'finished') {
      if (game.winner === 'draw') return "It's a draw! 🤝"
      if (game.winner === playerSymbol) return 'You won! 🎉'
      return 'Tirth won! Great game! 💕'
    }
    if (game.currentTurn === playerSymbol) return 'Your turn Liza! ⭐'
    return "Tirth's turn... 💭"
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
      <div className="tictactoe-container">
        <div className="loading">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            ⭕
          </motion.div>
          <p>Loading game...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="tictactoe-container">
        <div className="error">
          <p>{error}</p>
          <Link to="/games" className="back-btn">
            ← Back to Games
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="tictactoe-container">
      <div className="floating-hearts">
        {[...Array(15)].map((_, i) => (
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
            ⭕
          </motion.div>
        ))}
      </div>

      <motion.div
        className="tictactoe-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="page-title"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          Tic Tac Toe ⭕
        </motion.h1>

        {/* Connection Status */}
        {!socketConnected && (
          <div className="connection-status">
            <span className="connecting-dot"></span>
            Connecting to server...
          </div>
        )}

        {/* Players Info */}
        <div className="players-info">
          <div className={`player-box ${playerSymbol === 'X' ? 'active' : ''}`}>
            <span className="player-symbol">❌</span>
            <span className="player-name">
              {game?.players?.find(p => p.symbol === 'X') 
                ? (game.players.find(p => p.symbol === 'X').role === 'admin' ? 'Tirth' : 'Liza')
                : 'Tirth'}
            </span>
          </div>
          <div className="vs">VS</div>
          <div className={`player-box ${playerSymbol === 'O' ? 'active' : ''}`}>
            <span className="player-symbol">⭕</span>
            <span className="player-name">
              {game?.players?.find(p => p.symbol === 'O')
                ? (game.players.find(p => p.symbol === 'O').role === 'admin' ? 'Tirth' : 'Liza')
                : 'Liza'}
            </span>
          </div>
        </div>

        {/* Status */}
        <motion.div 
          className="game-status"
          key={getStatusMessage()}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p>{getStatusMessage()}</p>
        </motion.div>

        {/* Game Board */}
        <div className="game-board">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => renderCell(index))}
        </div>

        {/* Your Symbol */}
        <div className="your-symbol">
          <p>Liza, you are playing as: <strong>{playerSymbol === 'X' ? '❌' : '⭕'}</strong></p>
        </div>

        {/* Back Button */}
        <motion.div
          className="navigation-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/games" className="nav-button">
            ← Back to Games
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TicTacToe
