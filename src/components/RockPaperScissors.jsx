import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import './RockPaperScissors.css'

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(null)
  const [opponentChoice, setOpponentChoice] = useState(null)
  const [result, setResult] = useState(null)
  const [score, setScore] = useState({ player: 0, opponent: 0 })
  const [socketConnected, setSocketConnected] = useState(false)
  const socketRef = useRef(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

  useEffect(() => {
    const socket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    })
    
    socketRef.current = socket

    socket.on('connect', () => {
      setSocketConnected(true)
      socket.emit('join-rps', 'rps-room')
    })

    socket.on('disconnect', () => {
      setSocketConnected(false)
    })

    socket.on('rps-opponent-move', (data) => {
      setOpponentChoice(data.choice)
      if (playerChoice) {
        determineWinner(playerChoice, data.choice)
      }
    })

    socket.on('rps-reset', () => {
      resetRound()
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (playerChoice && opponentChoice) {
      determineWinner(playerChoice, opponentChoice)
    }
  }, [playerChoice, opponentChoice])

  const makeChoice = (choice) => {
    if (playerChoice) return
    
    setPlayerChoice(choice)
    
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('rps-move', {
        room: 'rps-room',
        choice
      })
    }
  }

  const determineWinner = (p1, p2) => {
    if (p1 === p2) {
      setResult('draw')
    } else if (
      (p1 === 'rock' && p2 === 'scissors') ||
      (p1 === 'paper' && p2 === 'rock') ||
      (p1 === 'scissors' && p2 === 'paper')
    ) {
      setResult('win')
      setScore(prev => ({ ...prev, player: prev.player + 1 }))
    } else {
      setResult('lose')
      setScore(prev => ({ ...prev, opponent: prev.opponent + 1 }))
    }
  }

  const resetRound = () => {
    setPlayerChoice(null)
    setOpponentChoice(null)
    setResult(null)
  }

  const resetGame = () => {
    resetRound()
    setScore({ player: 0, opponent: 0 })
    if (socketRef.current) {
      socketRef.current.emit('rps-reset', { room: 'rps-room' })
    }
  }

  const getEmoji = (choice) => {
    switch (choice) {
      case 'rock': return '✊'
      case 'paper': return '✋'
      case 'scissors': return '✌️'
      default: return '❓'
    }
  }

  const getResultMessage = () => {
    switch (result) {
      case 'win': return '🎉 You won this round!'
      case 'lose': return '💕 Tirth won this round!'
      case 'draw': return '🤝 It\'s a draw!'
      default: return ''
    }
  }

  return (
    <div className="rps-container">
      <motion.div
        className="rps-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="page-title">Rock Paper Scissors ✊</h1>

        {!socketConnected && (
          <div className="connection-status">
            <span className="connecting-dot"></span>
            Connecting...
          </div>
        )}

        {/* Score */}
        <div className="score-board">
          <div className="score-box">
            <span className="score-label">Liza</span>
            <span className="score-value">{score.player}</span>
          </div>
          <div className="vs-small">VS</div>
          <div className="score-box">
            <span className="score-label">Tirth</span>
            <span className="score-value">{score.opponent}</span>
          </div>
        </div>

        {/* Game Area */}
        <div className="game-area">
          <div className="player-side">
            <h3>You (Liza)</h3>
            <AnimatePresence mode="wait">
              {playerChoice ? (
                <motion.div
                  key="chosen"
                  className="choice-display"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <span className="choice-emoji">{getEmoji(playerChoice)}</span>
                  <span className="choice-text">{playerChoice}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  className="waiting-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Choose your move!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="vs-divider">⚡</div>

          <div className="player-side">
            <h3>Tirth</h3>
            <AnimatePresence mode="wait">
              {opponentChoice ? (
                <motion.div
                  key="chosen"
                  className="choice-display"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -180 }}
                >
                  <span className="choice-emoji">{getEmoji(opponentChoice)}</span>
                  <span className="choice-text">{opponentChoice}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  className="waiting-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {playerChoice ? 'Waiting for Tirth...' : 'Waiting...'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              className={`result-display ${result}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p>{getResultMessage()}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        {!playerChoice ? (
          <div className="choice-buttons">
            <motion.button
              className="choice-btn rock"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => makeChoice('rock')}
            >
              <span className="btn-emoji">✊</span>
              <span className="btn-text">Rock</span>
            </motion.button>
            <motion.button
              className="choice-btn paper"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => makeChoice('paper')}
            >
              <span className="btn-emoji">✋</span>
              <span className="btn-text">Paper</span>
            </motion.button>
            <motion.button
              className="choice-btn scissors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => makeChoice('scissors')}
            >
              <span className="btn-emoji">✌️</span>
              <span className="btn-text">Scissors</span>
            </motion.button>
          </div>
        ) : (
          <motion.button
            className="next-round-btn"
            onClick={resetRound}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next Round 🔄
          </motion.button>
        )}

        <motion.button
          className="reset-game-btn"
          onClick={resetGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset Game 🔄
        </motion.button>

        <div className="navigation-buttons">
          <Link to="/games" className="nav-button">← Back to Games</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default RockPaperScissors
