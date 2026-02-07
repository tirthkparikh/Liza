import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Import routes
import authRoutes from './routes/auth.js'
import imageRoutes from './routes/images.js'
import blogRoutes from './routes/blogs.js'
import storyRoutes from './routes/stories.js'
import calendarRoutes from './routes/calendar.js'
import emailRoutes from './routes/email.js'
import smsRoutes from './routes/sms.js'
import reminderRoutes from './routes/reminders.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  'http://localhost:5173',
  'http://localhost:3001',
  'http://localhost:5174'
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liza-love'
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)
    // Don't exit - allow server to start even if DB fails (for initial setup)
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Server starting without database. Add MONGODB_URI to connect.')
    }
  }
}

connectDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/images', imageRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/email', emailRoutes)
app.use('/api/sms', smsRoutes)
app.use('/api/reminders', reminderRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Liza Love Server is running!' })
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI ? '✅ Configured' : '⚠️  Not configured - add MONGODB_URI'}`)
  console.log(`📧 Email: ${process.env.EMAIL_USER ? '✅ Configured' : '⚪ Not configured (optional)'}`)
  console.log(`📅 Calendar: ${process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '⚪ Not configured (optional)'}`)
  console.log(`📱 SMS: ${process.env.TWILIO_ACCOUNT_SID ? '✅ Configured' : '⚪ Not configured (optional)'}`)
  console.log(`\n✅ Server is ready!`)
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`)
})

