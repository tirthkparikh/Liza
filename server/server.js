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
import messageRoutes from './routes/messages.js'

// Import email functions
import { sendMessageNotificationEmail } from './utils/email.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
// const io = new Server(httpServer, {
//   cors: {
//     origin: ['http://localhost:5173', 'http://localhost:5174'],
//     methods: ['GET', 'POST']
//   }
// })
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

const PORT = process.env.PORT || 5001

// Middleware
// const allowedOrigins = [
//   process.env.FRONTEND_URL,
//   process.env.ADMIN_URL,
//   'http://localhost:5173',
//   'http://localhost:3001',
//   'http://localhost:5174'
// ].filter(Boolean)

// app.use(cors({
//   origin: (origin, callback) => {
//     // Allow requests with no origin (mobile apps, Postman, etc.)
//     if (!origin) return callback(null, true)
//     if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   credentials: true
// }))
app.use(cors())
app.options('*', cors())

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
app.use('/api/messages', messageRoutes)

// Socket.io for real-time features
const connectedUsers = new Map()
const activeGames = new Map()
let adminOnline = false
let loverOnline = false

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  // Status Tracking
  socket.on('admin-join', () => {
    adminOnline = true
    socket.userType = 'admin'
    connectedUsers.set('admin', socket.id)
    console.log('Admin (Tirth) is now online')
    // Notify all clients that admin is online
    io.emit('tirth-status', { online: true })
    io.emit('liza-status', { online: loverOnline })
  })
  
  socket.on('lover-join', () => {
    loverOnline = true
    socket.userType = 'lover'
    connectedUsers.set('lover', socket.id)
    console.log('Lover (Liza) is now online')
    // Notify all clients that lover is online
    io.emit('liza-status', { online: true })
    io.emit('tirth-status', { online: adminOnline })
  })
  
  // Handle status requests
  socket.on('get-status', () => {
    socket.emit('tirth-status', { online: adminOnline })
    socket.emit('liza-status', { online: loverOnline })
  })
  
  // Messaging
  socket.on('join-messages', (userType) => {
    socket.join('messages-room')
    socket.userType = userType
    console.log(`${userType} joined messaging room`)
  })
  
  socket.on('send-message', async (data) => {
    console.log('Message received:', data)
    // Broadcast to all clients in messages room
    io.to('messages-room').emit('new-message', data)
    
    // Check if recipient is offline and send email
    const recipientType = data.sender === 'admin' ? 'lover' : 'admin'
    const isRecipientOnline = recipientType === 'admin' ? adminOnline : loverOnline
    
    if (!isRecipientOnline) {
      console.log(`${recipientType} is offline, sending email notification...`)
      try {
        const recipientEmail = process.env.LOVER_EMAIL || process.env.EMAIL_USER
        if (recipientEmail) {
          await sendMessageNotificationEmail(
            recipientEmail,
            data.senderName || (data.sender === 'admin' ? 'Tirth' : 'Liza'),
            data.content,
            false
          )
          console.log('✅ Email notification sent successfully')
        } else {
          console.log('⚠️ No recipient email configured, skipping email')
        }
      } catch (error) {
        console.error('❌ Error sending email notification:', error)
      }
    }
  })
  
  socket.on('message-read', (data) => {
    io.to('messages-room').emit('message-read', data)
  })
  
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
  
  // NEW GAME SYSTEM - Real-time multiplayer games
  const activeGames = new Map()
  
  // Get games status
  socket.on('get-games-status', () => {
    const status = {}
    activeGames.forEach((game, gameType) => {
      status[gameType] = {
        status: game.status,
        players: game.players.length
      }
    })
    socket.emit('games-status', status)
  })
  
  // Create or join game
  socket.on('create-or-join-game', (data) => {
    const { gameType, role } = data
    
    if (!activeGames.has(gameType)) {
      // Create new game
      activeGames.set(gameType, {
        gameId: `${gameType}-${Date.now()}`,
        gameType,
        players: [{ socketId: socket.id, role }],
        status: 'waiting',
        board: gameType === 'tictactoe' ? Array(9).fill(null) : 
               gameType === 'connectfour' ? Array(6).fill(null).map(() => Array(7).fill(null)) : null,
        isXNext: true,
        isRedNext: true,
        rpsChoices: {}
      })
      socket.emit('game-joined', { 
        gameId: activeGames.get(gameType).gameId, 
        role: 'player1',
        opponentOnline: false 
      })
    } else {
      // Join existing game
      const game = activeGames.get(gameType)
      if (game.players.length < 2) {
        game.players.push({ socketId: socket.id, role })
        game.status = 'playing'
        socket.emit('game-joined', { 
          gameId: game.gameId, 
          role: 'player2',
          opponentOnline: true 
        })
        // Notify first player
        const firstPlayer = game.players[0]
        socket.to(firstPlayer.socketId).emit('opponent-joined')
      }
    }
    
    socket.join(`${gameType}-room`)
  })
  
  // Join game room
  socket.on('join-game', (data) => {
    const { gameType, role } = data
    socket.join(`${gameType}-room`)
    
    if (activeGames.has(gameType)) {
      const game = activeGames.get(gameType)
      const opponent = game.players.find(p => p.socketId !== socket.id)
      socket.emit('game-joined', {
        gameId: game.gameId,
        role: game.players[0].socketId === socket.id ? 'player1' : 'player2',
        opponentOnline: !!opponent
      })
    }
  })
  
  // Make move
  socket.on('make-move', (data) => {
    const { gameType, board, isXNext, isRedNext } = data
    if (activeGames.has(gameType)) {
      const game = activeGames.get(gameType)
      game.board = board
      game.isXNext = isXNext
      game.isRedNext = isRedNext
      
      // Broadcast to other player
      socket.to(`${gameType}-room`).emit('move-made', data)
    }
  })
  
  // RPS Choice
  socket.on('rps-choice', (data) => {
    const { gameId, choice } = data
    const game = Array.from(activeGames.values()).find(g => g.gameId === gameId)
    
    if (game) {
      game.rpsChoices[socket.id] = choice
      
      // If both players made choices
      if (Object.keys(game.rpsChoices).length === 2) {
        const choices = Object.entries(game.rpsChoices)
        const player1Choice = choices[0][1]
        const player2Choice = choices[1][1]
        
        let result, score = { me: 0, opponent: 0 }
        
        if (player1Choice === player2Choice) {
          result = 'draw'
        } else if (
          (player1Choice === 'rock' && player2Choice === 'scissors') ||
          (player1Choice === 'paper' && player2Choice === 'rock') ||
          (player1Choice === 'scissors' && player2Choice === 'paper')
        ) {
          result = 'win'
          score = { me: 1, opponent: 0 }
        } else {
          result = 'lose'
          score = { me: 0, opponent: 1 }
        }
        
        // Send results to both players
        game.players.forEach((player, index) => {
          const opponentIndex = index === 0 ? 1 : 0
          io.to(player.socketId).emit('choices-revealed', {
            myChoice: choices[index][1],
            opponentChoice: choices[opponentIndex][1],
            result: index === 0 ? result : (result === 'win' ? 'lose' : result === 'lose' ? 'win' : 'draw'),
            score: index === 0 ? score : { me: score.opponent, opponent: score.me }
          })
        })
        
        // Reset choices for next round
        game.rpsChoices = {}
      }
    }
  })
  
  // Reset game
  socket.on('reset-game', (data) => {
    const { gameId, gameType } = data
    if (activeGames.has(gameType)) {
      const game = activeGames.get(gameType)
      if (game.gameId === gameId) {
        game.board = gameType === 'tictactoe' ? Array(9).fill(null) : 
                    gameType === 'connectfour' ? Array(6).fill(null).map(() => Array(7).fill(null)) : null
        game.isXNext = true
        game.isRedNext = true
        game.rpsChoices = {}
        
        io.to(`${gameType}-room`).emit('game-reset')
      }
    }
  })
  
  // Round reset for RPS
  socket.on('round-reset', (data) => {
    const { gameId } = data
    const game = Array.from(activeGames.values()).find(g => g.gameId === gameId)
    if (game) {
      game.rpsChoices = {}
      socket.to(`rps-room`).emit('round-reset')
    }
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    
    // Check if admin disconnected
    if (socket.userType === 'admin' || connectedUsers.get('admin') === socket.id) {
      adminOnline = false
      connectedUsers.delete('admin')
      console.log('Admin (Tirth) is now offline')
      io.emit('tirth-status', { online: false })
    }
    
    // Check if lover disconnected
    if (socket.userType === 'lover' || connectedUsers.get('lover') === socket.id) {
      loverOnline = false
      connectedUsers.delete('lover')
      console.log('Lover (Liza) is now offline')
      io.emit('liza-status', { online: false })
    }
    
    // Legacy support for other user types
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

