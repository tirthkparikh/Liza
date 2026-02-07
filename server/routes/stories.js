import express from 'express'
import Story from '../models/Story.js'
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
const sendNotification = async (story, isFromAdmin = true) => {
  let emailSent = false
  let emailError = null
  
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
        subject: `💕 New Love Story: ${story.title}`,
        html: `
          <div style="font-family: 'Georgia', serif; background: linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%); padding: 40px; border-radius: 20px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #d63384; text-align: center; font-size: 28px; margin-bottom: 10px;">💕 A New Chapter in Our Story</h1>
            <p style="text-align: center; color: #666; font-style: italic; margin-bottom: 30px;">My love, I've added something special for you...</p>
            
            <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(214, 51, 132, 0.1);">
              <h2 style="color: #d63384; margin-top: 0; font-size: 24px;">${story.title}</h2>
              ${story.location ? `<p style="color: #888; font-size: 14px;">📍 ${story.location}</p>` : ''}
              ${story.date ? `<p style="color: #888; font-size: 14px;">📅 ${new Date(story.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>` : ''}
              
              <div style="margin-top: 20px; line-height: 1.8; color: #555; font-size: 16px;">
                ${story.content.substring(0, 300)}${story.content.length > 300 ? '...' : ''}
              </div>
              
              <div style="margin-top: 30px; text-align: center;">
                <a href="${process.env.WEBSITE_URL || 'http://localhost:5173'}/timeline" 
                   style="background: linear-gradient(135deg, #d63384, #ff6b9d); color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);">
                  💕 Read Our Full Story
                </a>
              </div>
            </div>
            
            <p style="text-align: center; color: #999; margin-top: 30px; font-size: 14px;">
              With all my love,<br>
              <strong style="color: #d63384;">${senderName}</strong> 💕
            </p>
          </div>
        `
      }

      await transporter.sendMail(mailOptions)
      emailSent = true
      console.log('Story notification email sent successfully')
    }
  } catch (error) {
    emailError = error.message
    console.error('Error sending notification email:', error)
  }
  
  // Create notification record
  try {
    const notification = new Notification({
      type: 'story',
      title: story.title,
      message: `A new chapter has been added to your love story: "${story.title}"`,
      contentId: story._id,
      contentModel: 'Story',
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

// Create story - Bidirectional (Admin or Lover)
router.post('/', async (req, res) => {
  try {
    // Check if request has auth token (admin) or not (lover)
    const authHeader = req.headers.authorization
    const isFromAdmin = !!(authHeader && authHeader.startsWith('Bearer '))
    
    console.log(`Creating story from ${isFromAdmin ? 'ADMIN' : 'LOVER'}`)
    
    const story = new Story({
      ...req.body,
      createdBy: isFromAdmin ? 'admin' : 'lover'
    })
    await story.save()
    
    // Send notification if story is published
    if (story.published) {
      await sendNotification(story, isFromAdmin)
    }
    
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

