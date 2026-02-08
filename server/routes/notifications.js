import express from 'express'
import Notification from '../models/Notification.js'
import { authenticate } from '../middleware/auth.js'
import { sendGameNotificationEmail, sendCallNotificationEmail, sendMessageNotificationEmail } from '../utils/email.js'

const router = express.Router()

// Store online status
let adminOnline = false
let loverOnline = false

// Update status
router.post('/status', (req, res) => {
  const { userType, online } = req.body
  if (userType === 'admin') {
    adminOnline = online
  } else if (userType === 'lover') {
    loverOnline = online
  }
  res.json({ adminOnline, loverOnline })
})

// Get status
router.get('/status', (req, res) => {
  res.json({ adminOnline, loverOnline })
})

// Send email notification
router.post('/send-email', async (req, res) => {
  try {
    const { type, gameType, message, callerName } = req.body
    
    const recipientEmail = process.env.LOVER_EMAIL || process.env.EMAIL_USER
    if (!recipientEmail) {
      return res.status(500).json({ error: 'No recipient email configured' })
    }

    let result
    
    switch (type) {
      case 'game':
        result = await sendGameNotificationEmail(recipientEmail, 'Liza', gameType, false)
        break
      case 'call':
        result = await sendCallNotificationEmail(recipientEmail, callerName || 'Liza', 'video', false)
        break
      case 'message':
        result = await sendMessageNotificationEmail(recipientEmail, 'Liza', message, false)
        break
      default:
        return res.status(400).json({ error: 'Unknown notification type' })
    }

    if (result.success) {
      res.json({ success: true, message: 'Email notification sent' })
    } else {
      res.status(500).json({ success: false, error: result.error })
    }
  } catch (error) {
    console.error('Error sending email notification:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get all notifications
router.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: 'liza' })
      .sort({ createdAt: -1 })
      .limit(50)
    res.json(notifications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get unread notifications count
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      recipient: 'liza',
      read: false 
    })
    res.json({ count })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Mark notification as read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true, readAt: new Date() },
      { new: true }
    )
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' })
    }
    res.json(notification)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Mark all as read
router.put('/mark-all-read', authenticate, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: 'liza', read: false },
      { read: true, readAt: new Date() }
    )
    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete notification
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id)
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' })
    }
    res.json({ message: 'Notification deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
