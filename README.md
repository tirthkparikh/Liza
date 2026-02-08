# Liza Love Website 💕

A beautiful, romantic full-stack website with admin panel, email, SMS, and Google Calendar integration.

## 🚀 Auto-Deployment Setup (NEW!)

**Push code → Auto builds → Auto deploys → Live in 2 minutes!**

### ⚡ Quick Start:
```bash
./setup-deployment.sh
```

Then follow: **[QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md)**

### 📚 Documentation:
- **[Quick Start](QUICK_START_DEPLOYMENT.md)** - Get auto-deploy running in 5 minutes
- **[Complete Guide](DEPLOYMENT_COMPLETE_GUIDE.md)** - Full detailed instructions
- **[GitHub Secrets](GITHUB_SECRETS_SETUP.md)** - Configure auto-build secrets
- **[Command Reference](DEPLOYMENT_CHEATSHEET.md)** - Quick command reference

---

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
# Runs on http://localhost:5001
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

# Email Configuration (Required for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
LOVER_EMAIL=liza@example.com
EMAIL_FROM=Love Website <your-email@gmail.com>

# Website URL (for email links)
WEBSITE_URL=http://localhost:5173

# Optional Services
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Setup Email Notifications
1. Use a Gmail account
2. Enable 2-Factor Authentication
3. Generate an App Password
4. Add credentials to `.env`
5. Liza will receive beautiful emails when you create stories/blogs!

## 🔐 Admin Setup

1. Deploy backend first
2. Go to admin panel
3. Register admin account (first time only)
4. Login and start managing content

## ✨ New Features (Connected Experience)

- 🔗 **Connected Admin & Website**: Stories and blogs created in admin panel automatically appear on the main website
- 📧 **Automatic Email Notifications**: Liza receives beautiful email notifications when you add new stories or love messages
- 🔔 **Real-time Notifications**: Toast notifications appear when new content is added
- ✨ **New Content Badges**: "New" badges show on the Heart Map when there's fresh content
- 💝 **Romantic Email Templates**: Beautiful, love-themed email designs

## 📦 Features

- 💕 Romantic interactive games
- 📸 Photo galleries
- 📝 Blogs and stories (now connected to admin panel!)
- 📖 Love story timeline (fetches from admin stories)
- 💌 Love letters (fetches from admin blogs)
- 📅 Calendar integration
- 📧 Email functionality with automatic notifications
- 📱 SMS/Phone calls
- ⏰ Reminders system
- 🎮 Love games
- 🔔 Real-time notification system

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Framer Motion
- **Backend:** Express.js, MongoDB, Mongoose
- **Admin:** React, Vite
- **Services:** Nodemailer, Twilio, Google APIs

## 📄 License

Private project for Liza 💕
# Liza
