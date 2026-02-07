import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import './ConnectFour.css'

const ConnectFour = () => {
  const [searchParams] = useSearchParams()
  const gameId = searchParams.get('id')
  
  const [game, setGame] = useState(null)
  const [playerColor, setPlayerColor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [socketConnected, setSocketConnected] = useState(false)
  const socketRef = useRef(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

  useEffect(() => {
    if (!gameId) {
      setError('No game ID provided')
      setLoading(false)
      return
    }

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
      socket.emit('join-connectfour', gameId)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
      setSocketConnected(false)
    })

    socket.on('connectfour-move-made', (data) => {
      console.log('Move received:', data)
      if (data && data.game) {
        setGame(data.game)
      }
    })

    socket.on('connectfour-game-ended', (data) => {
      console.log('Game ended:', data)
      if (data && data.game) {
        setGame(data.game)
      }
    })

    socket.on('connectfour-player-joined', () => {
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
      const response = await fetch(`${API_URL}/api/connectfour/${gameId}`)
      const gameData = await response.json()
      setGame(gameData)
      
      const player = gameData.players.find(p => p.role === 'lover')
      if (player) {
        setPlayerColor(player.symbol)
      } else {
        setPlayerColor('yellow')
      }
      
      setLoading(false)
    } catch (err) {
      setError('Error loading game')
      setLoading(false)
    }
  }

  const handleColumnClick = async (colIndex) => {
    if (!game || game.status !== 'playing') return
    if (game.currentTurn !== playerColor) return

    try {
      const response = await fetch(`${API_URL}/api/connectfour/${gameId}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ column: colIndex, color: playerColor }),
      })
      
      const updatedGame = await response.json()
      setGame(updatedGame)
      
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('connectfour-move', {
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
      if (game.winner === playerColor) return 'You won! 🎉'
      return 'Tirth won! Great game! 💕'
    }
    if (game.currentTurn === playerColor) return 'Your turn Liza! Drop a piece ⭐'
    return "Tirth's turn... 💭"
  }

  const getPlayerName = (color) => {
    if (!game?.players) return color === 'red' ? 'Tirth' : 'Liza'
    const player = game.players.find(p => p.symbol === color)
    return player ? (player.role === 'admin' ? 'Tirth' : 'Liza') : (color === 'red' ? 'Tirth' : 'Liza')
  }

  if (loading) {
    return (
      <div className="connectfour-container">
        <div className="loading">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            🔴
          </motion.div>
          <p>Loading game...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="connectfour-container">
        <div className="error">
          <p>{error}</p>
          <Link to="/games" className="back-btn">← Back to Games</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="connectfour-container">
      <motion.div
        className="connectfour-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="page-title">Connect Four 🔴</h1>

        {!socketConnected && (
          <div className="connection-status">
            <span className="connecting-dot"></span>
            Connecting to server...
          </div>
        )}

        <div className="players-info">
          <div className={`player-box ${playerColor === 'red' ? 'active' : ''}`}>
            <span className="player-disc red"></span>
            <span className="player-name">{getPlayerName('red')}</span>
          </div>
          <div className="vs">VS</div>
          <div className={`player-box ${playerColor === 'yellow' ? 'active' : ''}`}>
            <span className="player-disc yellow"></span>
            <span className="player-name">{getPlayerName('yellow')}</span>
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

        <div className="game-board-container">
          <div className="column-buttons">
            {[0, 1, 2, 3, 4, 5, 6].map((col) => (
              <button
                key={col}
                className="column-btn"
                onClick={() => handleColumnClick(col)}
                disabled={game?.status !== 'playing' || game?.currentTurn !== playerColor}
              >
                ⬇️
              </button>
            ))}
          </div>
          
          <div className="connectfour-board">
            {game?.board?.map((row, rowIndex) => (
              <div key={rowIndex} className="board-row">
                {row.map((cell, colIndex) => (
                  <div key={colIndex} className="board-cell">
                    {cell && (
                      <motion.div
                        className={`disc ${cell}`}
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ 
                          type: 'spring',
                          stiffness: 200,
                          damping: 15,
                          delay: rowIndex * 0.05
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="your-color">
          <p>Liza, you are playing as: <span className={`disc-inline ${playerColor}`}></span> {playerColor === 'red' ? 'Red' : 'Yellow'}</p>
        </div>

        <div className="navigation-buttons">
          <Link to="/games" className="nav-button">← Back to Games</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default ConnectFour
