import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['tictactoe'],
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'playing', 'finished'],
    default: 'waiting'
  },
  players: [{
    role: {
      type: String,
      enum: ['admin', 'lover']
    },
    symbol: {
      type: String,
      enum: ['X', 'O']
    }
  }],
  board: {
    type: [String],
    default: Array(9).fill(null)
  },
  currentTurn: {
    type: String,
    enum: ['X', 'O']
  },
  winner: {
    type: String,
    enum: ['X', 'O', 'draw', null],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Game', gameSchema)
