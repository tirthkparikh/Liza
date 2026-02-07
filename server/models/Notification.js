import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['story', 'blog', 'date', 'reminder', 'anniversary', 'birthday', 'email', 'sms'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'contentModel'
  },
  contentModel: {
    type: String,
    enum: ['Story', 'Blog', 'Reminder']
  },
  recipient: {
    type: String,
    default: 'liza'
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: {
    type: Date
  },
  smsSent: {
    type: Boolean,
    default: false
  },
  smsSentAt: {
    type: Date
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Notification', notificationSchema)
