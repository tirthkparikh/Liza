import mongoose from 'mongoose'

const loveJarSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 200
  },
  author: {
    type: String,
    enum: ['admin', 'lover'],
    required: true
  },
  color: {
    type: String,
    default: '#ff6b9d'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('LoveJar', loveJarSchema)
