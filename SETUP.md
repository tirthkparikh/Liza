# Complete Setup Guide

## 🚀 Full Stack Setup

### 1. Backend Server Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

Server runs on: `http://localhost:5000`

### 2. Frontend Setup (Main Website)

```bash
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 3. Admin Panel Setup

```bash
cd admin
npm install
npm run dev
```

Admin Panel runs on: `http://localhost:3001`

## 📧 Service Configuration

### Email (Gmail)
1. Enable 2FA on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `server/.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

### Google Calendar
1. Go to Google Cloud Console
2. Create project
3. Enable Calendar API
4. Create OAuth 2.0 credentials
5. Add to `server/.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
   ```

### SMS/Phone (Twilio)
1. Sign up at https://www.twilio.com
2. Get credentials from dashboard
3. Add to `server/.env`:
   ```
   TWILIO_ACCOUNT_SID=your-sid
   TWILIO_AUTH_TOKEN=your-token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### MongoDB
- Local: Install MongoDB and run `mongod`
- Cloud: Use MongoDB Atlas (free tier available)
- Add connection string to `server/.env`:
  ```
  MONGODB_URI=mongodb://localhost:27017/liza-love
  ```

## 🔐 First Time Admin Setup

1. Start the server
2. Go to Admin Panel: `http://localhost:3001`
3. Click "First time? Register"
4. Create admin account
5. Login and start managing content!

## 📱 Features

### Admin Panel
- ✅ Upload images
- ✅ Create/edit blogs
- ✅ Create/edit stories
- ✅ Manage all content

### Main Website
- ✅ View all images from server
- ✅ Read blogs and stories
- ✅ Set reminders (saved to database)
- ✅ Email functionality
- ✅ SMS/Phone calls
- ✅ Google Calendar integration

## 🎯 Next Steps

1. Configure all services in `.env`
2. Register admin account
3. Upload images via admin panel
4. Create blogs and stories
5. Test email/SMS/Calendar features

Enjoy your complete love website! 💕

