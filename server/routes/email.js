import express from 'express'
import nodemailer from 'nodemailer'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

// Send email
router.post('/send', authenticate, async (req, res) => {
  try {
    const { to, subject, text, html } = req.body

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: 'Email service not configured' })
    }

    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: to || process.env.EMAIL_USER,
      subject: subject || 'Message from Liza Love Website',
      text: text,
      html: html || text
    }

    const info = await transporter.sendMail(mailOptions)
    res.json({ message: 'Email sent successfully', messageId: info.messageId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

