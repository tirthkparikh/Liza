import mongoose from 'mongoose'

const connectFourSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'connectfour'
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
      enum: ['red', 'yellow']
    }
  }],
  board: {
    type: [[String]],
    default: () => Array(6).fill(null).map(() => Array(7).fill(null))
  },
  currentTurn: {
    type: String,
    enum: ['red', 'yellow']
  },
  winner: {
    type: String,
    enum: ['red', 'yellow', 'draw', null],
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

export default mongoose.model('ConnectFour', connectFourSchema)
