import express from 'express'
import twilio from 'twilio'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Initialize Twilio client
const getTwilioClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    return null
  }
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
}

// Send SMS
router.post('/send', authenticate, async (req, res) => {
  try {
    const { to, message } = req.body

    const client = getTwilioClient()
    if (!client) {
      return res.status(500).json({ error: 'SMS service not configured' })
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    })

    res.json({ message: 'SMS sent successfully', sid: result.sid })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Make phone call
router.post('/call', authenticate, async (req, res) => {
  try {
    const { to, message } = req.body

    const client = getTwilioClient()
    if (!client) {
      return res.status(500).json({ error: 'Phone service not configured' })
    }

    const call = await client.calls.create({
      twiml: `<Response><Say>${message || 'Hello, this is a call from Liza Love Website'}</Say></Response>`,
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER
    })

    res.json({ message: 'Call initiated successfully', sid: call.sid })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

