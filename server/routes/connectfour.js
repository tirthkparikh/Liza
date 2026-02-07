import express from 'express'
import ConnectFour from '../models/ConnectFour.js'
import { authenticate, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get all Connect Four games
router.get('/', async (req, res) => {
  try {
    const games = await ConnectFour.find({ 
      status: { $in: ['waiting', 'playing'] }
    }).sort({ createdAt: -1 })
    res.json(games)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get specific game
router.get('/:id', async (req, res) => {
  try {
    const game = await ConnectFour.findById(req.params.id)
    if (!game) {
      return res.status(404).json({ error: 'Game not found' })
    }
    res.json(game)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create new game
router.post('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const isFromAdmin = !!(authHeader && authHeader.startsWith('Bearer '))
    
    const existingGame = await ConnectFour.findOne({
      status: { $in: ['waiting', 'playing'] }
    })
    
    if (existingGame) {
      return res.json(existingGame)
    }
    
    const game = new ConnectFour({
      players: [{
        role: isFromAdmin ? 'admin' : 'lover',
        symbol: 'red'
      }],
      currentTurn: 'red'
    })
    
    await game.save()
    res.json(game)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Join game
router.post('/:id/join', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const isFromAdmin = !!(authHeader && authHeader.startsWith('Bearer '))
    
    const game = await ConnectFour.findById(req.params.id)
    if (!game) {
      return res.status(404).json({ error: 'Game not found' })
    }
    
    const playerRole = isFromAdmin ? 'admin' : 'lover'
    
    if (game.players.some(p => p.role === playerRole)) {
      return res.json(game)
    }
    
    if (game.players.length < 2) {
      game.players.push({
        role: playerRole,
        symbol: 'yellow'
      })
      game.status = 'playing'
      await game.save()
    }
    
    res.json(game)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Make move
router.post('/:id/move', async (req, res) => {
  try {
    const { column, color } = req.body
    const game = await ConnectFour.findById(req.params.id)
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' })
    }
    
    if (game.status !== 'playing') {
      return res.status(400).json({ error: 'Game is not active' })
    }
    
    if (game.currentTurn !== color) {
      return res.status(400).json({ error: 'Not your turn' })
    }
    
    // Find lowest empty row in column
    let row = -1
    for (let r = 5; r >= 0; r--) {
      if (!game.board[r][column]) {
        row = r
        break
      }
    }
    
    if (row === -1) {
      return res.status(400).json({ error: 'Column is full' })
    }
    
    // Make move
    game.board[row][column] = color
    
    // Check winner
    const winner = checkWinner(game.board, row, column, color)
    
    if (winner) {
      game.winner = color
      game.status = 'finished'
    } else if (isBoardFull(game.board)) {
      game.winner = 'draw'
      game.status = 'finished'
    } else {
      game.currentTurn = color === 'red' ? 'yellow' : 'red'
    }
    
    game.updatedAt = new Date()
    await game.save()
    
    res.json(game)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Reset/Delete game
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await ConnectFour.findByIdAndDelete(req.params.id)
    res.json({ message: 'Game deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Check for winner
function checkWinner(board, row, col, color) {
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal down-right
    [1, -1]   // diagonal down-left
  ]
  
  for (const [dr, dc] of directions) {
    let count = 1
    
    // Check positive direction
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i
      const c = col + dc * i
      if (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === color) {
        count++
      } else {
        break
      }
    }
    
    // Check negative direction
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i
      const c = col - dc * i
      if (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === color) {
        count++
      } else {
        break
      }
    }
    
    if (count >= 4) return true
  }
  
  return false
}

function isBoardFull(board) {
  return board.every(row => row.every(cell => cell !== null))
}

export default router
