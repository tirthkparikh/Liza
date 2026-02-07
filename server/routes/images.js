import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import Image from '../models/Image.js'
import { authenticate, isAdmin } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/images'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error('Only image files are allowed!'))
  }
})

// Get all images
router.get('/', async (req, res) => {
  try {
    const { folder } = req.query
    const query = folder ? { folder } : {}
    const images = await Image.find(query).sort({ uploadedAt: -1 })
    res.json(images)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Upload image (Admin only)
router.post('/upload', authenticate, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const image = new Image({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      url: `/uploads/images/${req.file.filename}`,
      folder: req.body.folder || 'mixed',
      uploadedBy: req.user.id
    })

    await image.save()
    res.json(image)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete image (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
    if (!image) {
      return res.status(404).json({ error: 'Image not found' })
    }

    // Delete file from filesystem (you might want to use fs.unlink)
    await Image.findByIdAndDelete(req.params.id)
    res.json({ message: 'Image deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

