import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['admin', 'lover'],
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  type: {
    type: String,
    enum: ['text', 'call-request', 'game-invite', 'voice'],
    default: 'text'
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

// Index for efficient querying
messageSchema.index({ timestamp: -1 })
messageSchema.index({ sender: 1, read: 1 })

export default mongoose.model('Message', messageSchema)