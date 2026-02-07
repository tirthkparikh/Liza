# ⚡ Quick Deployment Guide

## 🎯 What You Need

1. **MongoDB Connection String**
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
   - Get from MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas

2. **GitHub Account** (free)
   - https://github.com

3. **Railway Account** (free)
   - https://railway.app

4. **Vercel Account** (free)
   - https://vercel.com

## 📋 Deployment Steps (15 minutes)

### Step 1: Push to GitHub ✅
```bash
git init
git add .
git commit -m "Liza Love Website"
git remote add origin https://github.com/YOUR_USERNAME/liza-love.git
git push -u origin main
```

### Step 2: Deploy Backend (Railway) 🚂

1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select your repo
4. Settings → Root Directory: `server`
5. Variables → Add:
   ```
   MONGODB_URI=your-mongodb-url-here
   JWT_SECRET=any-random-secret
   NODE_ENV=production
   ```
6. Copy deployment URL

### Step 3: Deploy Frontend (Vercel) 🌐

1. Go to https://vercel.com
2. "New Project" → Import from GitHub
3. Select your repo
4. Settings:
   - Root: `/`
   - Build: `npm run build`
   - Output: `dist`
5. Environment:
   ```
   VITE_API_URL=https://your-railway-url.railway.app
   ```
6. Deploy!

### Step 4: Deploy Admin (Vercel) 🔐

1. Vercel → "New Project" (same repo)
2. Settings:
   - Root: `admin`
   - Build: `npm run build`
   - Output: `dist`
3. Environment:
   ```
   VITE_API_URL=https://your-railway-url.railway.app
   ```
4. Deploy!

### Step 5: Update Backend CORS 🔄

Railway → Variables → Add:
```
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

Railway will auto-redeploy!

## ✅ Done!

Your website is live:
- Frontend: `https://your-frontend.vercel.app`
- Admin: `https://your-admin.vercel.app`
- Backend: `https://your-backend.railway.app`

## 🎁 Free Tier Limits

- **Railway:** 500 hours/month (plenty for personal use)
- **Vercel:** Unlimited (free forever)
- **MongoDB Atlas:** 512MB storage (free)

**Total Cost: $0/month!** 💕

## 🔄 Auto-Deploy

Every time you push to GitHub:
```bash
git add .
git commit -m "Update"
git push
```

All 3 apps auto-deploy in 1-2 minutes! 🚀

---

**Please provide your MongoDB URL and I'll help you configure everything!** 📧

