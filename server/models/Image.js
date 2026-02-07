import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  originalName: String,
  url: String,        // Cloudinary URL
  publicId: String,  // For delete
  folder: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Image', imageSchema)

