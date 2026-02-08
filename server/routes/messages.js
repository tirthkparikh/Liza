import express from 'express'
import Message from '../models/Message.js'
import { sendEmail } from '../utils/email.js'

const router = express.Router()

// Get all messages between users
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(100)
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get unread messages count
router.get('/unread/:user', async (req, res) => {
  try {
    const { user } = req.params
    const unreadCount = await Message.countDocuments({
      sender: { $ne: user },
      read: false
    })
    res.json({ count: unreadCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get recent messages
router.get('/recent', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(20)
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Send a new message
router.post('/', async (req, res) => {
  try {
    const { sender, senderName, content, type = 'text' } = req.body
    
    const message = new Message({
      sender,
      senderName,
      content,
      type,
      timestamp: new Date()
    })
    
    await message.save()
    
    // Send email notification if recipient is offline
    // This will be handled by socket events, but we prepare the message here
    
    res.status(201).json(message)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Mark message as read
router.put('/:id/read', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { 
        read: true, 
        readAt: new Date() 
      },
      { new: true }
    )
    res.json(message)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Mark all messages as read for a user
router.put('/read-all/:user', async (req, res) => {
  try {
    await Message.updateMany(
      { 
        sender: { $ne: req.params.user },
        read: false 
      },
      { 
        read: true, 
        readAt: new Date() 
      }
    )
    res.json({ message: 'All messages marked as read' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete a message
router.delete('/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id)
    res.json({ message: 'Message deleted' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router