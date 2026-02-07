import express from 'express'
import Story from '../models/Story.js'
import { authenticate, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get all stories
router.get('/', async (req, res) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { published: true }
    const stories = await Story.find(query).sort({ date: -1 })
    res.json(stories)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single story
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
    if (!story) {
      return res.status(404).json({ error: 'Story not found' })
    }
    res.json(story)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create story (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const story = new Story({
      ...req.body,
      createdBy: req.user.id
    })
    await story.save()
    res.json(story)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update story (Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    )
    if (!story) {
      return res.status(404).json({ error: 'Story not found' })
    }
    res.json(story)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete story (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id)
    if (!story) {
      return res.status(404).json({ error: 'Story not found' })
    }
    res.json({ message: 'Story deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

