import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server } from 'socket.io'

// Import routes
import authRoutes from './routes/auth.js'
import imageRoutes from './routes/images.js'
import blogRoutes from './routes/blogs.js'
import storyRoutes from './routes/stories.js'
import calendarRoutes from './routes/calendar.js'
import emailRoutes from './routes/email.js'
import smsRoutes from './routes/sms.js'
import reminderRoutes from './routes/reminders.js'
import notificationRoutes from './routes/notifications.js'
import testRoutes from './routes/test.js'
import loveJarRoutes from './routes/lovejar.js'
import gameRoutes from './routes/games.js'
import connectFourRoutes from './routes/connectfour.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST']
  }
})
const PORT = process.env.PORT || 5001

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
console.log('Cloudinary ENV:', {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET,
})

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
app.use('/api/notifications', notificationRoutes)
app.use('/api/test', testRoutes)
app.use('/api/lovejar', loveJarRoutes)
app.use('/api/games', gameRoutes)
app.use('/api/connectfour', connectFourRoutes)

// Socket.io for real-time features
const connectedUsers = new Map()
const activeGames = new Map()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  // Video Call Signaling
  socket.on('join-call', (userId) => {
    connectedUsers.set(userId, socket.id)
    socket.broadcast.emit('user-joined', userId)
  })
  
  socket.on('offer', (data) => {
    socket.broadcast.emit('offer', data)
  })
  
  socket.on('answer', (data) => {
    socket.broadcast.emit('answer', data)
  })
  
  socket.on('ice-candidate', (data) => {
    socket.broadcast.emit('ice-candidate', data)
  })
  
  socket.on('end-call', () => {
    socket.broadcast.emit('call-ended')
  })
  
  // Game: Tic Tac Toe
  socket.on('join-game', (gameId) => {
    socket.join(gameId)
    socket.to(gameId).emit('player-joined')
  })
  
  socket.on('make-move', (data) => {
    socket.to(data.gameId).emit('move-made', data)
  })
  
  socket.on('game-over', (data) => {
    socket.to(data.gameId).emit('game-ended', data)
  })
  
  // Connect Four
  socket.on('join-connectfour', (gameId) => {
    socket.join(`cf-${gameId}`)
    socket.to(`cf-${gameId}`).emit('connectfour-player-joined')
  })
  
  socket.on('connectfour-move', (data) => {
    socket.to(`cf-${data.gameId}`).emit('connectfour-move-made', data)
  })
  
  socket.on('connectfour-game-over', (data) => {
    socket.to(`cf-${data.gameId}`).emit('connectfour-game-ended', data)
  })
  
  // Rock Paper Scissors
  socket.on('join-rps', (room) => {
    socket.join(room)
  })
  
  socket.on('rps-move', (data) => {
    socket.to(data.room).emit('rps-opponent-move', data)
  })
  
  socket.on('rps-reset', (data) => {
    socket.to(data.room).emit('rps-reset')
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId)
        socket.broadcast.emit('user-left', userId)
        break
      }
    }
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Liza Love Server is running!' })
})

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err)

  // Multer errors (this is what you are hitting)
  if (err.name === 'MulterError') {
    return res.status(400).json({
      error: 'Upload error',
      details: err.message,
    })
  }

  // Cloudinary errors
  if (err.http_code) {
    return res.status(err.http_code).json({
      error: 'Cloudinary error',
      details: err.message,
    })
  }

  // Default
  res.status(500).json({
    error: err.message || 'Server error',
  })
})


httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI ? '✅ Configured' : '⚠️  Not configured - add MONGODB_URI'}`)
  console.log(`📧 Email: ${process.env.EMAIL_USER ? '✅ Configured' : '⚪ Not configured (optional)'}`)
  console.log(`📅 Calendar: ${process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '⚪ Not configured (optional)'}`)
  console.log(`📱 SMS: ${process.env.TWILIO_ACCOUNT_SID ? '✅ Configured' : '⚪ Not configured (optional)'}`)
  console.log(`🎮 Socket.io: ✅ Real-time features enabled`)
  console.log(`\n✅ Server is ready!`)
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🧪 Test notifications: http://localhost:${PORT}/api/test/test-config`)
})

