import mongoose from 'mongoose'

const reminderSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['date', 'reminder', 'anniversary', 'birthday'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  datetime: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    default: 'liza'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Reminder', reminderSchema)

