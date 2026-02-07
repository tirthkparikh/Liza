import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: `liza-love/${req.body.folder || 'mixed'}`,
    resource_type: 'image',
    public_id: Date.now().toString(), // ⚠️ SAFE
    format: file.mimetype.split('/')[1], // jpg/png/webp
  }),
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

export default upload
