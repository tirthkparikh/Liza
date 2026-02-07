import express from 'express'
import Reminder from '../models/Reminder.js'
import Notification from '../models/Notification.js'
import nodemailer from 'nodemailer'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Create email transporter for Admin -> Lover
const createAdminTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL_USER,
      pass: process.env.ADMIN_EMAIL_PASS
    }
  })
}

// Create email transporter for Lover -> Admin
const createLoverTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.LOVER_EMAIL_USER,
      pass: process.env.LOVER_EMAIL_PASS
    }
  })
}

// Send date/reminder notification email and create notification record
// isFromAdmin: true if admin created it (send to lover), false if lover created it (send to admin)
const sendNotification = async (reminder, isFromAdmin = true) => {
  let emailSent = false
  let emailError = null
  
  const typeEmojis = {
    date: '💕',
    reminder: '⏰',
    anniversary: '💍',
    birthday: '🎂'
  }
  
  const typeColors = {
    date: '#ff6b9d',
    reminder: '#667eea',
    anniversary: '#d63384',
    birthday: '#f093fb'
  }
  
  const formattedDate = new Date(reminder.datetime).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
  
  const formattedTime = new Date(reminder.datetime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
  
  // Determine sender and recipient based on who created the date
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
        subject: `${typeEmojis[reminder.type]} ${reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)} Planned: ${reminder.title}`,
        html: `
          <div style="font-family: 'Georgia', serif; background: linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%); padding: 40px; border-radius: 20px; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 60px; margin-bottom: 10px;">${typeEmojis[reminder.type]}</div>
              <h1 style="color: ${typeColors[reminder.type]}; font-size: 32px; margin: 0;">
                ${reminder.type === 'date' ? 'A Special Date Planned!' : 
                  reminder.type === 'anniversary' ? 'Our Anniversary!' :
                  reminder.type === 'birthday' ? 'Happy Birthday My Love!' : 
                  'A Gentle Reminder'}
              </h1>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(214, 51, 132, 0.1);">
              <h2 style="color: #d63384; margin-top: 0; font-size: 24px; text-align: center;">
                ${reminder.title}
              </h2>
              
              <div style="background: linear-gradient(135deg, #fff5f8, #ffeef5); padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">When</p>
                <p style="margin: 10px 0; color: #d63384; font-size: 20px; font-weight: bold;">
                  ${formattedDate}
                </p>
                <p style="margin: 0; color: #888; font-size: 18px;">
                  ⏰ ${formattedTime}
                </p>
              </div>
              
              ${reminder.description ? `
                <div style="margin-top: 20px; padding: 20px; background: #fafafa; border-radius: 10px; border-left: 4px solid ${typeColors[reminder.type]};">
                  <p style="margin: 0; color: #555; font-size: 16px; line-height: 1.6; font-style: italic;">
                    "${reminder.description}"
                  </p>
                </div>
              ` : ''}
              
              <div style="margin-top: 30px; text-align: center;">
                <a href="${process.env.WEBSITE_URL || 'http://localhost:5173'}/dashboard" 
                   style="background: linear-gradient(135deg, ${typeColors[reminder.type]}, #ff6b9d); color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);">
                  💕 View on Website
                </a>
              </div>
            </div>
            
            <p style="text-align: center; color: #999; margin-top: 30px; font-size: 14px;">
              ${reminder.type === 'date' ? 'I can\'t wait to see you! 💕' : 
                reminder.type === 'anniversary' ? 'Another year of loving you! 💍' :
                reminder.type === 'birthday' ? 'You deserve the world! 🎂' : 
                'Thinking of you always 💕'}
              <br><br>
              <strong style="color: #d63384;">${senderName}</strong> ❤️
            </p>
          </div>
        `
      }

      await transporter.sendMail(mailOptions)
      emailSent = true
      console.log('Date/reminder notification email sent successfully')
    }
  } catch (error) {
    emailError = error.message
    console.error('Error sending date notification email:', error)
  }
  
  // Create notification record
  try {
    const notification = new Notification({
      type: reminder.type,
      title: reminder.title,
      message: `${typeEmojis[reminder.type]} A new ${reminder.type} has been planned: "${reminder.title}" on ${formattedDate} at ${formattedTime}`,
      contentId: reminder._id,
      contentModel: 'Reminder',
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

// Get all reminders for user
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: 'liza' })
      .sort({ datetime: 1 })
    res.json(reminders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create reminder - allows both authenticated admin and public (lover site) access
router.post('/', async (req, res) => {
  try {
    // Check if request has auth token (admin) or not (lover)
    const authHeader = req.headers.authorization
    const isFromAdmin = !!(authHeader && authHeader.startsWith('Bearer '))
    
    console.log(`Creating reminder from ${isFromAdmin ? 'ADMIN' : 'LOVER'}`)
    
    const reminder = new Reminder({
      ...req.body,
      userId: 'liza',
      createdBy: isFromAdmin ? 'admin' : 'lover'
    })
    await reminder.save()
    
    // Send notification for the new date/reminder (bidirectional)
    await sendNotification(reminder, isFromAdmin)
    
    res.json(reminder)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update reminder
router.put('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' })
    }
    res.json(reminder)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete reminder
router.delete('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id)
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' })
    }
    res.json({ message: 'Reminder deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

