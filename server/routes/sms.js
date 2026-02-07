import express from 'express'
import twilio from 'twilio'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Initialize Admin Twilio client (sends to lover)
const getAdminTwilioClient = () => {
  if (!process.env.ADMIN_TWILIO_ACCOUNT_SID || !process.env.ADMIN_TWILIO_AUTH_TOKEN) {
    return null
  }
  return twilio(process.env.ADMIN_TWILIO_ACCOUNT_SID, process.env.ADMIN_TWILIO_AUTH_TOKEN)
}

// Initialize Lover Twilio client (sends to admin)
const getLoverTwilioClient = () => {
  if (!process.env.LOVER_TWILIO_ACCOUNT_SID || !process.env.LOVER_TWILIO_AUTH_TOKEN) {
    return null
  }
  return twilio(process.env.LOVER_TWILIO_ACCOUNT_SID, process.env.LOVER_TWILIO_AUTH_TOKEN)
}

// Send WhatsApp message from Admin to Lover
export const sendAdminWhatsAppMessage = async (to, message) => {
  try {
    const client = getAdminTwilioClient()
    if (!client) {
      console.log('Admin Twilio not configured, skipping WhatsApp')
      return { success: false, error: 'Admin Twilio not configured' }
    }

    // Format phone number for WhatsApp
    const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`
    const whatsappFrom = process.env.ADMIN_TWILIO_WHATSAPP_NUMBER 
      ? (process.env.ADMIN_TWILIO_WHATSAPP_NUMBER.startsWith('whatsapp:') 
          ? process.env.ADMIN_TWILIO_WHATSAPP_NUMBER 
          : `whatsapp:${process.env.ADMIN_TWILIO_WHATSAPP_NUMBER}`)
      : 'whatsapp:+14155238886' // Twilio Sandbox number

    const result = await client.messages.create({
      body: message,
      from: whatsappFrom,
      to: whatsappTo
    })

    console.log('Admin WhatsApp message sent:', result.sid)
    return { success: true, sid: result.sid }
  } catch (error) {
    console.error('Error sending Admin WhatsApp:', error)
    return { success: false, error: error.message }
  }
}

// Send WhatsApp message from Lover to Admin
export const sendLoverWhatsAppMessage = async (to, message) => {
  try {
    const client = getLoverTwilioClient()
    if (!client) {
      console.log('Lover Twilio not configured, skipping WhatsApp')
      return { success: false, error: 'Lover Twilio not configured' }
    }

    // Format phone number for WhatsApp
    const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`
    const whatsappFrom = process.env.LOVER_TWILIO_WHATSAPP_NUMBER 
      ? (process.env.LOVER_TWILIO_WHATSAPP_NUMBER.startsWith('whatsapp:') 
          ? process.env.LOVER_TWILIO_WHATSAPP_NUMBER 
          : `whatsapp:${process.env.LOVER_TWILIO_WHATSAPP_NUMBER}`)
      : 'whatsapp:+14155238886' // Twilio Sandbox number

    const result = await client.messages.create({
      body: message,
      from: whatsappFrom,
      to: whatsappTo
    })

    console.log('Lover WhatsApp message sent:', result.sid)
    return { success: true, sid: result.sid }
  } catch (error) {
    console.error('Error sending Lover WhatsApp:', error)
    return { success: false, error: error.message }
  }
}

// Legacy function for backward compatibility
export const sendWhatsAppMessage = sendAdminWhatsAppMessage

// Send SMS
router.post('/send', authenticate, async (req, res) => {
  try {
    const { to, message } = req.body

    const client = getAdminTwilioClient()
    if (!client) {
      return res.status(500).json({ error: 'SMS service not configured' })
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.ADMIN_TWILIO_PHONE_NUMBER,
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

    const client = getAdminTwilioClient()
    if (!client) {
      return res.status(500).json({ error: 'Phone service not configured' })
    }

    const call = await client.calls.create({
      twiml: `<Response><Say>${message || 'Hello, this is a call from Liza Love Website'}</Say></Response>`,
      to: to,
      from: process.env.ADMIN_TWILIO_PHONE_NUMBER
    })

    res.json({ message: 'Call initiated successfully', sid: call.sid })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Send WhatsApp message endpoint
router.post('/whatsapp', authenticate, async (req, res) => {
  try {
    const { to, message } = req.body
    const result = await sendAdminWhatsAppMessage(to, message)
    
    if (result.success) {
      res.json({ message: 'WhatsApp message sent successfully', sid: result.sid })
    } else {
      res.status(500).json({ error: result.error })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
