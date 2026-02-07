import express from 'express'
import { google } from 'googleapis'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Get OAuth2 client
const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
}

// Get calendar events
router.get('/events', authenticate, async (req, res) => {
  try {
    // This requires OAuth token from frontend
    const { accessToken } = req.body

    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required' })
    }

    const oauth2Client = getOAuth2Client()
    oauth2Client.setCredentials({ access_token: accessToken })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    })

    res.json(response.data.items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create calendar event
router.post('/events', authenticate, async (req, res) => {
  try {
    const { accessToken, summary, description, startDateTime, endDateTime } = req.body

    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required' })
    }

    const oauth2Client = getOAuth2Client()
    oauth2Client.setCredentials({ access_token: accessToken })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    
    const event = {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'UTC',
      },
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    })

    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get OAuth URL
router.get('/auth-url', (req, res) => {
  const oauth2Client = getOAuth2Client()
  const scopes = ['https://www.googleapis.com/auth/calendar']
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  })
  res.json({ url })
})

export default router

