import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { authenticate, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// Register admin (first time setup)
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    // Check if admin exists
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' })
    }

    const user = new User({
      username,
      password,
      role: 'admin'
    })

    await user.save()

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

