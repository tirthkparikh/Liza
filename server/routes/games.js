import express from 'express'
import Game from '../models/Game.js'
import { authenticate, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get active games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find({ 
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
    const game = await Game.findById(req.params.id)
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
    
    // Check if there's already an active game
    const existingGame = await Game.findOne({
      status: { $in: ['waiting', 'playing'] }
    })
    
    if (existingGame) {
      return res.json(existingGame)
    }
    
    const game = new Game({
      type: 'tictactoe',
      players: [{
        role: isFromAdmin ? 'admin' : 'lover',
        symbol: 'X'
      }],
      currentTurn: 'X'
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
    
    const game = await Game.findById(req.params.id)
    if (!game) {
      return res.status(404).json({ error: 'Game not found' })
    }
    
    const playerRole = isFromAdmin ? 'admin' : 'lover'
    
    // Check if already in game
    if (game.players.some(p => p.role === playerRole)) {
      return res.json(game)
    }
    
    // Add second player
    if (game.players.length < 2) {
      game.players.push({
        role: playerRole,
        symbol: 'O'
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
    const { position, symbol } = req.body
    const game = await Game.findById(req.params.id)
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' })
    }
    
    if (game.status !== 'playing') {
      return res.status(400).json({ error: 'Game is not active' })
    }
    
    if (game.currentTurn !== symbol) {
      return res.status(400).json({ error: 'Not your turn' })
    }
    
    if (game.board[position]) {
      return res.status(400).json({ error: 'Position already taken' })
    }
    
    // Make move
    game.board[position] = symbol
    
    // Check winner
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]
    
    let winner = null
    for (const combo of winningCombos) {
      if (game.board[combo[0]] && 
          game.board[combo[0]] === game.board[combo[1]] && 
          game.board[combo[0]] === game.board[combo[2]]) {
        winner = game.board[combo[0]]
        break
      }
    }
    
    if (winner) {
      game.winner = winner
      game.status = 'finished'
    } else if (!game.board.includes(null)) {
      game.winner = 'draw'
      game.status = 'finished'
    } else {
      game.currentTurn = symbol === 'X' ? 'O' : 'X'
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
    await Game.findByIdAndDelete(req.params.id)
    res.json({ message: 'Game deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
