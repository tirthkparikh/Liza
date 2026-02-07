import express from 'express'
import LoveJar from '../models/LoveJar.js'
import Notification from '../models/Notification.js'
import { authenticate, isAdmin } from '../middleware/auth.js'
import nodemailer from 'nodemailer'

const router = express.Router()

// Get all love jar notes
router.get('/', async (req, res) => {
  try {
    const notes = await LoveJar.find().sort({ createdAt: -1 })
    res.json(notes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create love jar note - Bidirectional (Admin or Lover)
router.post('/', async (req, res) => {
  try {
    // Check if request has auth token (admin) or not (lover)
    const authHeader = req.headers.authorization
    const isFromAdmin = !!(authHeader && authHeader.startsWith('Bearer '))
    
    console.log(`Creating love jar note from ${isFromAdmin ? 'ADMIN' : 'LOVER'}`)
    
    const note = new LoveJar({
      ...req.body,
      author: isFromAdmin ? 'admin' : 'lover'
    })
    await note.save()
    
    // Send notification
    await sendNotification(note, isFromAdmin)
    
    res.json(note)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete love jar note (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const note = await LoveJar.findByIdAndDelete(req.params.id)
    if (!note) {
      return res.status(404).json({ error: 'Note not found' })
    }
    res.json({ message: 'Note deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Send notification email
const sendNotification = async (note, isFromAdmin = true) => {
  let emailSent = false
  
  const senderEmail = isFromAdmin ? process.env.ADMIN_EMAIL_USER : process.env.LOVER_EMAIL_USER
  const senderPass = isFromAdmin ? process.env.ADMIN_EMAIL_PASS : process.env.LOVER_EMAIL_PASS
  const recipientEmail = isFromAdmin ? process.env.LOVER_EMAIL_RECIPIENT : process.env.ADMIN_EMAIL_RECIPIENT
  const senderName = isFromAdmin ? 'Your Love' : 'Liza'
  
  try {
    if (!senderEmail || !senderPass || !recipientEmail) {
      console.log(`${isFromAdmin ? 'Admin' : 'Lover'} email not configured, skipping notification`)
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
        subject: `💝 New Love Note in Our Jar!`,
        html: `
          <div style="font-family: 'Georgia', serif; background: linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%); padding: 40px; border-radius: 20px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #d63384; text-align: center; font-size: 28px; margin-bottom: 10px;">💝 A New Love Note!</h1>
            <p style="text-align: center; color: #666; font-style: italic; margin-bottom: 30px;">Someone added a sweet note to your Love Jar...</p>
            
            <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(214, 51, 132, 0.1); text-align: center;">
              <div style="font-size: 60px; margin-bottom: 20px;">🫙</div>
              
              <div style="background: ${note.color}; padding: 25px; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 0; color: #333; font-size: 18px; font-style: italic; line-height: 1.6;">
                  "${note.text}"
                </p>
              </div>
              
              <div style="margin-top: 30px;">
                <a href="${process.env.WEBSITE_URL || 'http://localhost:5173'}/lovejar" 
                   style="background: linear-gradient(135deg, #d63384, #ff6b9d); color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);">
                  💝 Open Love Jar
                </a>
              </div>
            </div>
            
            <p style="text-align: center; color: #999; margin-top: 30px; font-size: 14px;">
              With love,<br>
              <strong style="color: #d63384;">${senderName}</strong> 💕
            </p>
          </div>
        `
      }

      await transporter.sendMail(mailOptions)
      emailSent = true
      console.log('Love jar notification email sent successfully')
    }
  } catch (error) {
    console.error('Error sending notification email:', error)
  }
  
  // Create notification record
  try {
    const notification = new Notification({
      type: 'lovejar',
      title: 'New Love Note',
      message: `A new love note was added: "${note.text.substring(0, 50)}..."`,
      contentId: note._id,
      contentModel: 'LoveJar',
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
  
  return { emailSent }
}

export default router
