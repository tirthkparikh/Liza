import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendEmail = async (to, subject, html, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Love Website <your-email@gmail.com>',
      to,
      subject,
      text,
      html
    })
    
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error: error.message }
  }
}

// Send message notification email
export const sendMessageNotificationEmail = async (recipientEmail, senderName, messagePreview, isOnline) => {
  if (isOnline) return // Don't send email if user is online
  
  const subject = `💌 New message from ${senderName}`
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 20px; color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 60px; margin-bottom: 10px;">💕</div>
        <h1 style="color: #ff6b9d; margin: 0; font-size: 28px;">You have a new message!</h1>
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255, 255, 255, 0.2);">
        <p style="margin: 0 0 15px 0; font-size: 18px; color: #f093fb;"><strong>${senderName}</strong> sent you a message:</p>
        <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; border-left: 4px solid #ff6b9d;">
          <p style="margin: 0; font-size: 16px; line-height: 1.6; color: white;">"${messagePreview}"</p>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/messages" style="display: inline-block; background: linear-gradient(135deg, #ff6b9d 0%, #f093fb 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);">
          Read Message 💌
        </a>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        <p style="color: rgba(255, 255, 255, 0.6); font-size: 14px; margin: 0;">Sent with love from your Liza Love Website</p>
      </div>
    </div>
  `
  
  const text = `You have a new message from ${senderName}: "${messagePreview}". Visit ${process.env.FRONTEND_URL}/messages to read it.`
  
  return sendEmail(recipientEmail, subject, html, text)
}

// Send call request notification
export const sendCallNotificationEmail = async (recipientEmail, callerName, callType = 'video', isOnline) => {
  if (isOnline) return
  
  const subject = `📹 ${callerName} wants to ${callType} call with you!`
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 20px; color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 60px; margin-bottom: 10px;">📹</div>
        <h1 style="color: #4caf50; margin: 0; font-size: 28px;">Incoming Call!</h1>
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255, 255, 255, 0.2);">
        <p style="margin: 0; font-size: 20px; text-align: center; color: white;"><strong>${callerName}</strong> is waiting for you to join a ${callType} call!</p>
        <p style="margin: 15px 0 0 0; text-align: center; color: rgba(255, 255, 255, 0.7);">Don't keep them waiting too long 💕</p>
      </div>
      
      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/videocall" style="display: inline-block; background: linear-gradient(135deg, #4caf50 0%, #81c784 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);">
          Join Call 📹
        </a>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        <p style="color: rgba(255, 255, 255, 0.6); font-size: 14px; margin: 0;">Sent with love from your Liza Love Website</p>
      </div>
    </div>
  `
  
  const text = `${callerName} wants to ${callType} call with you! Visit ${process.env.FRONTEND_URL}/videocall to join.`
  
  return sendEmail(recipientEmail, subject, html, text)
}

// Send game invitation notification
export const sendGameNotificationEmail = async (recipientEmail, inviterName, gameType, isOnline) => {
  if (isOnline) return
  
  const gameEmojis = {
    'tictactoe': '⭕',
    'connectfour': '🔴',
    'rps': '✊'
  }
  
  const gameNames = {
    'tictactoe': 'Tic Tac Toe',
    'connectfour': 'Connect Four',
    'rps': 'Rock Paper Scissors'
  }
  
  const subject = `${gameEmojis[gameType]} ${inviterName} invited you to play ${gameNames[gameType]}!`
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 20px; color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 60px; margin-bottom: 10px;">${gameEmojis[gameType]}</div>
        <h1 style="color: #9c27b0; margin: 0; font-size: 28px;">Game Invitation!</h1>
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255, 255, 255, 0.2);">
        <p style="margin: 0; font-size: 20px; text-align: center; color: white;"><strong>${inviterName}</strong> wants to play <span style="color: #9c27b0;">${gameNames[gameType]}</span> with you!</p>
        <p style="margin: 15px 0 0 0; text-align: center; color: rgba(255, 255, 255, 0.7);">Ready to have some fun together? 🎮</p>
      </div>
      
      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/games" style="display: inline-block; background: linear-gradient(135deg, #9c27b0 0%, #ce93d8 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(156, 39, 176, 0.4);">
          Play Now 🎮
        </a>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        <p style="color: rgba(255, 255, 255, 0.6); font-size: 14px; margin: 0;">Sent with love from your Liza Love Website</p>
      </div>
    </div>
  `
  
  const text = `${inviterName} invited you to play ${gameNames[gameType]}! Visit ${process.env.FRONTEND_URL}/games to play.`
  
  return sendEmail(recipientEmail, subject, html, text)
}