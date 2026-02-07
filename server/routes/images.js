import express from 'express'
import Image from '../models/Image.js'
import upload from '../middleware/upload.js'
import cloudinary from '../config/cloudinary.js'
import { authenticate, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// ===============================
// GET ALL IMAGES
// ===============================
router.get('/', async (req, res) => {
  try {
    const { folder } = req.query
    const query = folder ? { folder } : {}

    const images = await Image.find(query).sort({ uploadedAt: -1 })
    res.json(images)
  } catch (error) {
    console.error('GET IMAGES ERROR:', error)
    res.status(500).json({ error: error.message })
  }
})

// ===============================
// UPLOAD IMAGE (ADMIN ONLY)
// ===============================
router.post(
  '/upload',
  authenticate,
  isAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const image = await Image.create({
        originalName: req.file.originalname,
        url: req.file.path,            // ✅ Cloudinary URL
        publicId: req.file.public_id,  // ✅ Cloudinary public_id
        folder: req.body.folder || 'mixed',
        uploadedBy: req.user.id,
      })

      res.json(image)
    } catch (error) {
      console.error('UPLOAD IMAGE ERROR:', error)
      res.status(500).json({ error: error.message })
    }
  }
)

// ===============================
// DELETE IMAGE (ADMIN ONLY)
// ===============================
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)

    if (!image) {
      return res.status(404).json({ error: 'Image not found' })
    }

    // Delete from Cloudinary
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId)
    }

    await image.deleteOne()

    res.json({ message: 'Image deleted successfully' })
  } catch (error) {
    console.error('DELETE IMAGE ERROR:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
