import express from 'express'
import Blog from '../models/Blog.js'
import { authenticate, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get all blogs (published only for non-admin)
router.get('/', authenticate, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { published: true }
    const blogs = await Blog.find(query).sort({ createdAt: -1 })
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }
    res.json(blog)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create blog (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
      createdBy: req.user.id
    })
    await blog.save()
    res.json(blog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update blog (Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    )
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }
    res.json(blog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete blog (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }
    res.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

