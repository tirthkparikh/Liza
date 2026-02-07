# 🌐 Complete Hosting Guide

## 🎯 Recommended Setup (Free Tier)

### Backend: Railway.app
- ✅ Free tier: 500 hours/month
- ✅ Auto-deploys from GitHub
- ✅ Easy environment variables
- ✅ Built-in MongoDB support (optional)

### Frontend: Vercel
- ✅ Free tier: Unlimited
- ✅ Auto-deploys from GitHub
- ✅ Fast CDN
- ✅ Custom domains

### Admin Panel: Vercel (Separate Project)
- ✅ Same as frontend
- ✅ Free tier
- ✅ Easy setup

## 📋 Step-by-Step

### 1. Prepare MongoDB URL

**Please provide your MongoDB connection string:**
- Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
- Or: `mongodb://localhost:27017/liza-love` (if local)

### 2. GitHub Setup

```bash
# If not already on GitHub
git init
git add .
git commit -m "Liza Love Website - Full Stack"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/liza-love.git
git branch -M main
git push -u origin main
```

### 3. Deploy Backend (Railway)

1. Visit: https://railway.app
2. Sign up with GitHub
3. "New Project" → "Deploy from GitHub"
4. Select your repo
5. Click on the service → Settings
6. Set Root Directory: `server`
7. Add Environment Variables:
   ```
   MONGODB_URI=your-mongodb-url-here
   JWT_SECRET=any-random-secret-string
   NODE_ENV=production
   PORT=5001
   FRONTEND_URL=https://your-frontend.vercel.app (update later)
   ```
8. Railway auto-deploys!
9. Copy the URL (e.g., `https://liza-love-production.up.railway.app`)

### 4. Deploy Frontend (Vercel)

1. Visit: https://vercel.com
2. Sign up with GitHub
3. "New Project" → Import repository
4. Select your repo
5. Configure:
   - Framework: Vite
   - Root Directory: `/` (default)
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
7. Deploy!
8. Copy the URL (e.g., `https://liza-love.vercel.app`)

### 5. Deploy Admin Panel (Vercel - New Project)

1. In Vercel, click "New Project" again
2. Import same repository
3. Configure:
   - Root Directory: `admin`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
5. Deploy!
6. Copy the URL

### 6. Update Backend CORS

Go back to Railway → Environment Variables:
- Add: `FRONTEND_URL=https://your-frontend.vercel.app`
- Add: `ADMIN_URL=https://your-admin.vercel.app`

The server will automatically allow these origins.

### 7. Final Steps

1. Test backend: Visit `https://your-backend.railway.app/api/health`
2. Test frontend: Visit your Vercel URL
3. Test admin: Visit admin Vercel URL
4. Register admin account
5. Start managing content!

## 💰 Cost Breakdown

- **Railway Backend:** Free (500 hours/month)
- **Vercel Frontend:** Free (unlimited)
- **Vercel Admin:** Free (unlimited)
- **MongoDB Atlas:** Free (512MB storage)
- **Total:** $0/month! 🎉

## 🔄 Auto-Deployment

Both Railway and Vercel auto-deploy when you push to GitHub:
```bash
git add .
git commit -m "Update"
git push
# Auto-deploys in 1-2 minutes!
```

## 🎯 Alternative Hosting

### If Railway doesn't work:
- **Render.com** - Free tier, similar to Railway
- **Fly.io** - Good free tier
- **Heroku** - Paid but reliable

### If Vercel doesn't work:
- **Netlify** - Excellent free tier
- **Cloudflare Pages** - Very fast
- **GitHub Pages** - Free but limited

## 📝 What I Need From You

1. **MongoDB Connection String** - Please provide this
2. **GitHub Username** - For repository setup
3. **Preferred URLs** - Any custom domains?

Once you provide the MongoDB URL, I'll update all the config files! 💕

