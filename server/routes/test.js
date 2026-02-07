import express from 'express'
import nodemailer from 'nodemailer'
import { sendAdminWhatsAppMessage, sendLoverWhatsAppMessage } from './sms.js'

const router = express.Router()

// Test email configuration
router.get('/test-config', async (req, res) => {
  const config = {
    adminEmail: {
      configured: !!(process.env.ADMIN_EMAIL_USER && process.env.ADMIN_EMAIL_PASS),
      user: process.env.ADMIN_EMAIL_USER ? '✓ Set' : '✗ Not set',
      pass: process.env.ADMIN_EMAIL_PASS ? '✓ Set' : '✗ Not set',
      recipient: process.env.ADMIN_EMAIL_RECIPIENT || 'Not set'
    },
    loverEmail: {
      configured: !!(process.env.LOVER_EMAIL_USER && process.env.LOVER_EMAIL_PASS),
      user: process.env.LOVER_EMAIL_USER ? '✓ Set' : '✗ Not set',
      pass: process.env.LOVER_EMAIL_PASS ? '✓ Set' : '✗ Not set',
      recipient: process.env.LOVER_EMAIL_RECIPIENT || 'Not set'
    },
    adminWhatsApp: {
      configured: !!(process.env.ADMIN_TWILIO_ACCOUNT_SID && process.env.ADMIN_TWILIO_AUTH_TOKEN),
      accountSid: process.env.ADMIN_TWILIO_ACCOUNT_SID ? '✓ Set' : '✗ Not set',
      authToken: process.env.ADMIN_TWILIO_AUTH_TOKEN ? '✓ Set' : '✗ Not set',
      phoneNumber: process.env.ADMIN_TWILIO_PHONE_NUMBER || 'Not set'
    },
    loverWhatsApp: {
      configured: !!(process.env.LOVER_TWILIO_ACCOUNT_SID && process.env.LOVER_TWILIO_AUTH_TOKEN),
      accountSid: process.env.LOVER_TWILIO_ACCOUNT_SID ? '✓ Set' : '✗ Not set',
      authToken: process.env.LOVER_TWILIO_AUTH_TOKEN ? '✓ Set' : '✗ Not set',
      phoneNumber: process.env.LOVER_TWILIO_PHONE_NUMBER || 'Not set'
    },
    phoneNumbers: {
      adminPhone: process.env.ADMIN_PHONE || 'Not set',
      loverPhone: process.env.LOVER_PHONE || 'Not set'
    },
    website: process.env.WEBSITE_URL || 'Not set'
  }
  
  res.json(config)
})

// Test admin email sending (to lover)
router.post('/test-admin-email', async (req, res) => {
  try {
    console.log('Testing admin email...')
    console.log('Admin User:', process.env.ADMIN_EMAIL_USER)
    console.log('Admin Pass Set:', process.env.ADMIN_EMAIL_PASS ? 'Yes' : 'No')
    console.log('Lover Recipient:', process.env.LOVER_EMAIL_RECIPIENT)
    
    if (!process.env.ADMIN_EMAIL_USER || !process.env.ADMIN_EMAIL_PASS) {
      return res.status(500).json({ 
        success: false, 
        error: 'Admin email not configured. Check ADMIN_EMAIL_USER and ADMIN_EMAIL_PASS in .env' 
      })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL_USER,
        pass: process.env.ADMIN_EMAIL_PASS
      },
      debug: true,
      logger: true
    })

    // Verify connection
    console.log('Verifying transporter...')
    await transporter.verify()
    console.log('Transporter verified!')
    
    const mailOptions = {
      from: `${process.env.EMAIL_FROM} <${process.env.ADMIN_EMAIL_USER}>`,
      to: process.env.LOVER_EMAIL_RECIPIENT || process.env.ADMIN_EMAIL_USER,
      subject: '💕 Test: Admin -> Lover Notification',
      html: `
        <div style="font-family: 'Georgia', serif; background: linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%); padding: 40px; border-radius: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d63384; text-align: center;">💕 Admin Email Test!</h1>
          <p style="text-align: center; color: #666;">If you see this, admin email notifications are working!</p>
          <p style="text-align: center; color: #999; margin-top: 30px;">
            Sent from: ${process.env.ADMIN_EMAIL_USER}<br>
            To: ${process.env.LOVER_EMAIL_RECIPIENT}<br>
            Time: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    }

    console.log('Sending email...')
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent! Message ID:', info.messageId)
    
    res.json({ 
      success: true, 
      message: 'Test email sent successfully!',
      messageId: info.messageId,
      from: process.env.ADMIN_EMAIL_USER,
      to: process.env.LOVER_EMAIL_RECIPIENT
    })
  } catch (error) {
    console.error('Email test error:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message,
      code: error.code,
      command: error.command,
      hint: 'Make sure you are using an App Password (16 chars, no spaces), not your regular Gmail password'
    })
  }
})

// Test lover email sending (to admin)
router.post('/test-lover-email', async (req, res) => {
  try {
    if (!process.env.LOVER_EMAIL_USER || !process.env.LOVER_EMAIL_PASS) {
      return res.status(500).json({ 
        success: false, 
        error: 'Lover email not configured. Check LOVER_EMAIL_USER and LOVER_EMAIL_PASS in .env' 
      })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.LOVER_EMAIL_USER,
        pass: process.env.LOVER_EMAIL_PASS
      }
    })

    // Verify connection
    await transporter.verify()
    
    const mailOptions = {
      from: `${process.env.EMAIL_FROM} <${process.env.LOVER_EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL_RECIPIENT || process.env.LOVER_EMAIL_USER,
      subject: '💕 Test: Lover -> Admin Notification',
      html: `
        <div style="font-family: 'Georgia', serif; background: linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%); padding: 40px; border-radius: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d63384; text-align: center;">💕 Lover Email Test!</h1>
          <p style="text-align: center; color: #666;">If you see this, lover email notifications are working!</p>
          <p style="text-align: center; color: #999; margin-top: 30px;">
            Sent from: ${process.env.LOVER_EMAIL_USER}<br>
            To: ${process.env.ADMIN_EMAIL_RECIPIENT}<br>
            Time: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    
    res.json({ 
      success: true, 
      message: 'Test email sent successfully!',
      messageId: info.messageId,
      from: process.env.LOVER_EMAIL_USER,
      to: process.env.ADMIN_EMAIL_RECIPIENT
    })
  } catch (error) {
    console.error('Email test error:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message,
      hint: 'Make sure you are using an App Password, not your regular Gmail password'
    })
  }
})

// Test WhatsApp
router.post('/test-whatsapp', async (req, res) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return res.status(500).json({ 
        success: false, 
        error: 'Twilio not configured. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env' 
      })
    }

    const testMessage = `💕 *Test Message from Liza Love Website* 💕\n\nIf you receive this, WhatsApp notifications are working!\n\nSent at: ${new Date().toLocaleString()}`
    
    const result = await sendWhatsAppMessage(
      process.env.LOVER_PHONE || process.env.ADMIN_PHONE,
      testMessage
    )
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Test WhatsApp message sent!',
        sid: result.sid 
      })
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      })
    }
  } catch (error) {
    console.error('WhatsApp test error:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

// Test Admin WhatsApp
router.post('/test-admin-whatsapp', async (req, res) => {
  try {
    if (!process.env.ADMIN_TWILIO_ACCOUNT_SID || !process.env.ADMIN_TWILIO_AUTH_TOKEN) {
      return res.status(500).json({ 
        success: false, 
        error: 'Admin Twilio not configured. Check ADMIN_TWILIO_ACCOUNT_SID and ADMIN_TWILIO_AUTH_TOKEN in .env' 
      })
    }

    if (!process.env.LOVER_PHONE) {
      return res.status(500).json({ 
        success: false, 
        error: 'Lover phone not configured' 
      })
    }

    const testMessage = `💕 *Test from Admin* 💕\n\nIf you receive this, Admin WhatsApp notifications are working!\n\nSent at: ${new Date().toLocaleString()}`
    
    const result = await sendAdminWhatsAppMessage(process.env.LOVER_PHONE, testMessage)
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Admin WhatsApp message sent!',
        sid: result.sid,
        to: process.env.LOVER_PHONE
      })
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      })
    }
  } catch (error) {
    console.error('Admin WhatsApp test error:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

// Test Lover WhatsApp
router.post('/test-lover-whatsapp', async (req, res) => {
  try {
    if (!process.env.LOVER_TWILIO_ACCOUNT_SID || !process.env.LOVER_TWILIO_AUTH_TOKEN) {
      return res.status(500).json({ 
        success: false, 
        error: 'Lover Twilio not configured. Check LOVER_TWILIO_ACCOUNT_SID and LOVER_TWILIO_AUTH_TOKEN in .env' 
      })
    }

    if (!process.env.ADMIN_PHONE) {
      return res.status(500).json({ 
        success: false, 
        error: 'Admin phone not configured' 
      })
    }

    const testMessage = `💕 *Test from Lover* 💕\n\nIf you receive this, Lover WhatsApp notifications are working!\n\nSent at: ${new Date().toLocaleString()}`
    
    const result = await sendLoverWhatsAppMessage(process.env.ADMIN_PHONE, testMessage)
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Lover WhatsApp message sent!',
        sid: result.sid,
        to: process.env.ADMIN_PHONE
      })
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      })
    }
  } catch (error) {
    console.error('Lover WhatsApp test error:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

// Test full notification (both directions)
router.post('/test-full', async (req, res) => {
  const results = {
    adminEmail: { success: false, error: null },
    loverEmail: { success: false, error: null },
    adminWhatsApp: { success: false, error: null },
    loverWhatsApp: { success: false, error: null }
  }
  
  // Test Admin Email
  try {
    if (!process.env.ADMIN_EMAIL_USER || !process.env.ADMIN_EMAIL_PASS) {
      results.adminEmail.error = 'Admin email not configured'
    } else {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.ADMIN_EMAIL_USER,
          pass: process.env.ADMIN_EMAIL_PASS
        }
      })

      await transporter.verify()
      
      const mailOptions = {
        from: `${process.env.EMAIL_FROM} <${process.env.ADMIN_EMAIL_USER}>`,
        to: process.env.LOVER_EMAIL_RECIPIENT,
        subject: '💕 Test: Admin -> Lover',
        html: `
          <div style="font-family: 'Georgia', serif; background: linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%); padding: 40px; border-radius: 20px;">
            <h1 style="color: #d63384; text-align: center;">💕 Admin Email Test</h1>
            <p style="text-align: center;">Testing admin to lover notification!</p>
          </div>
        `
      }

      await transporter.sendMail(mailOptions)
      results.adminEmail.success = true
    }
  } catch (error) {
    results.adminEmail.error = error.message
  }
  
  // Test Lover Email
  try {
    if (!process.env.LOVER_EMAIL_USER || !process.env.LOVER_EMAIL_PASS) {
      results.loverEmail.error = 'Lover email not configured'
    } else {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.LOVER_EMAIL_USER,
          pass: process.env.LOVER_EMAIL_PASS
        }
      })

      await transporter.verify()
      
      const mailOptions = {
        from: `${process.env.EMAIL_FROM} <${process.env.LOVER_EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL_RECIPIENT,
        subject: '💕 Test: Lover -> Admin',
        html: `
          <div style="font-family: 'Georgia', serif; background: linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%); padding: 40px; border-radius: 20px;">
            <h1 style="color: #d63384; text-align: center;">💕 Lover Email Test</h1>
            <p style="text-align: center;">Testing lover to admin notification!</p>
          </div>
        `
      }

      await transporter.sendMail(mailOptions)
      results.loverEmail.success = true
    }
  } catch (error) {
    results.loverEmail.error = error.message
  }
  
  // Test Admin WhatsApp (Admin -> Lover)
  try {
    if (!process.env.ADMIN_TWILIO_ACCOUNT_SID || !process.env.ADMIN_TWILIO_AUTH_TOKEN) {
      results.adminWhatsApp.error = 'Admin Twilio not configured'
    } else if (!process.env.LOVER_PHONE) {
      results.adminWhatsApp.error = 'Lover phone not configured'
    } else {
      const result = await sendAdminWhatsAppMessage(
        process.env.LOVER_PHONE,
        `💕 *Admin WhatsApp Test* 💕\n\nTesting admin to lover WhatsApp!\n\nTime: ${new Date().toLocaleString()}`
      )
      
      if (result.success) {
        results.adminWhatsApp.success = true
      } else {
        results.adminWhatsApp.error = result.error
      }
    }
  } catch (error) {
    results.adminWhatsApp.error = error.message
  }
  
  // Test Lover WhatsApp (Lover -> Admin)
  try {
    if (!process.env.LOVER_TWILIO_ACCOUNT_SID || !process.env.LOVER_TWILIO_AUTH_TOKEN) {
      results.loverWhatsApp.error = 'Lover Twilio not configured'
    } else if (!process.env.ADMIN_PHONE) {
      results.loverWhatsApp.error = 'Admin phone not configured'
    } else {
      const result = await sendLoverWhatsAppMessage(
        process.env.ADMIN_PHONE,
        `💕 *Lover WhatsApp Test* 💕\n\nTesting lover to admin WhatsApp!\n\nTime: ${new Date().toLocaleString()}`
      )
      
      if (result.success) {
        results.loverWhatsApp.success = true
      } else {
        results.loverWhatsApp.error = result.error
      }
    }
  } catch (error) {
    results.loverWhatsApp.error = error.message
  }
  
  res.json(results)
})

export default router
