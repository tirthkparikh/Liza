# Liza Love Website 💕

A beautiful, romantic full-stack website with admin panel, email, SMS, and Google Calendar integration.

## 🏗️ Project Structure

```
Liza/
├── src/              # Main website (React frontend)
├── server/           # Backend API (Express.js)
├── admin/            # Admin panel (React)
└── public/           # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)
- Git

### Local Development

1. **Main Website:**
```bash
npm install
npm run dev
# Runs on http://localhost:5173
```

2. **Backend Server:**
```bash
cd server
npm install
cp .env.example .env
# Add your MongoDB URL and other credentials
npm run dev
# Runs on http://localhost:5000
```

3. **Admin Panel:**
```bash
cd admin
npm install
npm run dev
# Runs on http://localhost:3001
```

## 🌐 Deployment

### Option 1: Vercel (Frontend + Admin) + Railway (Backend) - Recommended

**Frontend (Vercel):**
- Connect GitHub repo
- Root directory: `/`
- Build command: `npm run build`
- Output directory: `dist`

**Admin Panel (Vercel):**
- Connect GitHub repo
- Root directory: `/admin`
- Build command: `npm run build`
- Output directory: `admin/dist`

**Backend (Railway):**
- Connect GitHub repo
- Root directory: `/server`
- Add environment variables from `.env`
- Railway auto-detects Node.js

### Option 2: Netlify (Frontend + Admin) + Render (Backend)

**Frontend (Netlify):**
- Connect GitHub repo
- Base directory: `/`
- Build command: `npm run build`
- Publish directory: `dist`

**Admin Panel (Netlify):**
- Connect GitHub repo
- Base directory: `/admin`
- Build command: `cd admin && npm run build`
- Publish directory: `admin/dist`

**Backend (Render):**
- Connect GitHub repo
- Root directory: `/server`
- Environment: Node
- Build command: `npm install`
- Start command: `npm start`

## 📝 Environment Variables

### Server (.env)
```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## 🔐 Admin Setup

1. Deploy backend first
2. Go to admin panel
3. Register admin account (first time only)
4. Login and start managing content

## 📦 Features

- 💕 Romantic interactive games
- 📸 Photo galleries
- 📝 Blogs and stories
- 📅 Calendar integration
- 📧 Email functionality
- 📱 SMS/Phone calls
- ⏰ Reminders system
- 🎮 Love games
- 💌 Love letters

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Framer Motion
- **Backend:** Express.js, MongoDB, Mongoose
- **Admin:** React, Vite
- **Services:** Nodemailer, Twilio, Google APIs

## 📄 License

Private project for Liza 💕
# Liza
