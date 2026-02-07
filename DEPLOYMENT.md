# 🚀 Deployment Guide

## Step-by-Step Deployment Instructions

### 1. GitHub Setup

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit - Liza Love Website"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/liza-love.git
git branch -M main
git push -u origin main
```

### 2. MongoDB Setup

**Option A: MongoDB Atlas (Recommended - Free)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<password>` with your database password
7. Add your IP to whitelist (or 0.0.0.0/0 for all)

**Your MongoDB URL will look like:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/liza-love?retryWrites=true&w=majority
```

### 3. Backend Deployment (Railway - Recommended)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to: `server`
6. Add environment variables:
   ```
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=generate-a-random-secret-key
   NODE_ENV=production
   PORT=5001
   FRONTEND_URL=https://your-frontend-url.vercel.app
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   TWILIO_ACCOUNT_SID=your-twilio-sid
   TWILIO_AUTH_TOKEN=your-twilio-token
   TWILIO_PHONE_NUMBER=+1234567890
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```
7. Railway will auto-deploy
8. Copy the deployment URL (e.g., `https://your-app.railway.app`)

### 4. Frontend Deployment (Vercel)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project" → Import your repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `/` (leave as is)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
6. Deploy!

### 5. Admin Panel Deployment (Vercel - Separate Project)

1. In Vercel, click "New Project" again
2. Import the same repository
3. Configure:
   - **Root Directory:** `admin`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
5. Deploy!

### 6. Update CORS in Backend

After getting your frontend URLs, update `server/server.js`:
```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://your-admin.vercel.app',
    'http://localhost:5173',
    'http://localhost:3001'
  ],
  credentials: true
}))
```

Or update `FRONTEND_URL` in Railway environment variables.

### 7. Update Frontend API URLs

Update `src/utils/api.js` (create this file):
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
```

Update `admin/src/App.jsx`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
```

## 🔄 Alternative Hosting Options

### Backend Alternatives:
- **Render.com** (Free tier available)
- **Heroku** (Paid, but reliable)
- **Fly.io** (Good free tier)
- **DigitalOcean App Platform**

### Frontend Alternatives:
- **Netlify** (Great for static sites)
- **Cloudflare Pages** (Fast CDN)
- **GitHub Pages** (Free but limited)

## 📝 Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and connected to backend
- [ ] Admin panel deployed
- [ ] MongoDB connected
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Admin account created
- [ ] Test email/SMS/Calendar (if configured)

## 🐛 Troubleshooting

**Backend not connecting to MongoDB:**
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check environment variables

**CORS errors:**
- Update CORS origins in server
- Check FRONTEND_URL environment variable

**Build failures:**
- Check Node.js version (should be 18+)
- Verify all dependencies installed
- Check build logs for errors

## 💡 Pro Tips

1. Use Railway's free tier for backend (500 hours/month)
2. Vercel has excellent free tier for frontends
3. MongoDB Atlas free tier: 512MB storage
4. Set up automatic deployments from GitHub
5. Use environment variables for all secrets
6. Enable GitHub Actions for CI/CD (optional)

## 📞 Support

If you need help:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints with Postman/curl
4. Check browser console for frontend errors

Good luck with deployment! 💕

