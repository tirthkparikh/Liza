import express from 'express'
import Blog from '../models/Blog.js'
import Notification from '../models/Notification.js'
import { authenticate, isAdmin } from '../middleware/auth.js'
import nodemailer from 'nodemailer'

const router = express.Router()

// Create email transporter for admin (sends to lover)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL_USER,
      pass: process.env.ADMIN_EMAIL_PASS
    }
  })
}

// Send notification email and create notification record
const sendNotification = async (blog, isFromAdmin = true) => {
  let emailSent = false
  let emailError = null
  
  const categoryEmojis = {
    love: '💕',
    memories: '📸',
    promises: '💍',
    future: '✨'
  }
  
  // Determine sender and recipient
  const senderEmail = isFromAdmin ? process.env.ADMIN_EMAIL_USER : process.env.LOVER_EMAIL_USER
  const senderPass = isFromAdmin ? process.env.ADMIN_EMAIL_PASS : process.env.LOVER_EMAIL_PASS
  const recipientEmail = isFromAdmin ? process.env.LOVER_EMAIL_RECIPIENT : process.env.ADMIN_EMAIL_RECIPIENT
  const senderName = isFromAdmin ? 'Your Love' : 'Liza'
  
  // Send Email
  try {
    if (!senderEmail || !senderPass || !recipientEmail) {
      console.log(`${isFromAdmin ? 'Admin' : 'Lover'} email not configured, skipping email notification`)
    } else {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: senderEmail,
          pass: senderPass
        }
      })
      
      const mailOptions = {
        from: `${process.env.EMAIL_FROM || 'Love App'} <${senderEmail}>`,
        to: recipientEmail,
        subject: `${categoryEmojis[blog.category] || '💕'} New Love Message: ${blog.title}`,
        html: `
          <div style="font-family: 'Georgia', serif; background: linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%); padding: 40px; border-radius: 20px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #d63384; text-align: center; font-size: 28px; margin-bottom: 10px;">${categoryEmojis[blog.category] || '💕'} A Love Note For You</h1>
            <p style="text-align: center; color: #666; font-style: italic; margin-bottom: 30px;">My dearest, I've written something special...</p>
            
            <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(214, 51, 132, 0.1);">
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="background: linear-gradient(135deg, #d63384, #ff6b9d); color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                  ${blog.category}
                </span>
              </div>
              
              <h2 style="color: #d63384; margin-top: 0; font-size: 24px; text-align: center;">${blog.title}</h2>
              
              <div style="margin-top: 20px; line-height: 1.8; color: #555; font-size: 16px;">
                ${blog.content.substring(0, 300)}${blog.content.length > 300 ? '...' : ''}
              </div>
              
              <div style="margin-top: 30px; text-align: center;">
                <a href="${process.env.WEBSITE_URL || 'http://localhost:5173'}/letters" 
                   style="background: linear-gradient(135deg, #d63384, #ff6b9d); color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);">
                  💌 Read The Full Message
                </a>
              </div>
            </div>
            
            <p style="text-align: center; color: #999; margin-top: 30px; font-size: 14px;">
              Forever yours,<br>
              <strong style="color: #d63384;">${senderName}</strong> 💕
            </p>
          </div>
        `
      }

      await transporter.sendMail(mailOptions)
      emailSent = true
      console.log('Blog notification email sent successfully')
    }
  } catch (error) {
    emailError = error.message
    console.error('Error sending notification email:', error)
  }
  
  // Create notification record
  try {
    const notification = new Notification({
      type: 'blog',
      title: blog.title,
      message: `A new love message has been written: "${blog.title}"`,
      contentId: blog._id,
      contentModel: 'Blog',
      recipient: isFromAdmin ? 'liza' : 'admin',
      emailSent: emailSent,
      emailSentAt: emailSent ? new Date() : null,
      smsSent: false,
      smsSentAt: null
    })
    await notification.save()
    console.log('Notification record created')
  } catch (error) {
    console.error('Error creating notification record:', error)
  }
  
  return { emailSent, emailError }
}

// Get all blogs (published only for public, all for admin)
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    let query = { published: true }
    let isAdmin = false
    
    // If admin token provided, show ALL blogs (including lover's)
    if (token) {
      try {
        const jwt = await import('jsonwebtoken')
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
        if (decoded.role === 'admin') {
          query = {}  // Admin sees ALL blogs
          isAdmin = true
        }
      } catch (e) {
        // Invalid token, use default query
      }
    }
    
    const blogs = await Blog.find(query).sort({ createdAt: -1 })
    console.log(`Fetching blogs for ${isAdmin ? 'ADMIN' : 'PUBLIC'}: Found ${blogs.length} blogs`)
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

// Create blog - Bidirectional (Admin or Lover)
router.post('/', async (req, res) => {
  try {
    // Check if request has auth token (admin) or not (lover)
    const authHeader = req.headers.authorization
    const isFromAdmin = !!(authHeader && authHeader.startsWith('Bearer '))
    
    console.log(`Creating blog from ${isFromAdmin ? 'ADMIN' : 'LOVER'}`)
    
    const blog = new Blog({
      ...req.body,
      createdBy: isFromAdmin ? 'admin' : 'lover'
    })
    await blog.save()
    
    // Send notification if blog is published
    if (blog.published) {
      await sendNotification(blog, isFromAdmin)
    }
    
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

