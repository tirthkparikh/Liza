# 🎯 FINAL SETUP - Everything You Need

## ✅ What's Ready

- ✅ Backend server (Express.js + MongoDB)
- ✅ Frontend website (React)
- ✅ Admin panel (React)
- ✅ All deployment configs
- ✅ GitHub setup files
- ✅ Environment templates

## 🚀 Deploy in 3 Steps

### Step 1: MongoDB URL

**Get it here:** https://www.mongodb.com/cloud/atlas/register

Quick steps:
1. Sign up (Google login = fastest)
2. Create FREE cluster
3. Create database user
4. Allow all IPs (0.0.0.0/0)
5. Copy connection string
6. Replace password
7. Add `/liza-love` before `?`

**Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/liza-love?retryWrites=true&w=majority
```

### Step 2: GitHub

```bash
git init
git add .
git commit -m "Liza Love Website"
git remote add origin https://github.com/YOUR_USERNAME/liza-love.git
git push -u origin main
```

### Step 3: Deploy

**Railway (Backend):**
- railway.app → GitHub → Deploy
- Root: `server`
- Variables: `MONGODB_URI`, `JWT_SECRET`

**Vercel (Frontend + Admin):**
- vercel.com → GitHub → Deploy (twice)
- Root: `/` and `admin`
- Variable: `VITE_API_URL`

## 📋 Environment Variables

### Railway:
```
MONGODB_URI=your-mongodb-url
JWT_SECRET=random-secret
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

### Vercel:
```
VITE_API_URL=https://your-backend.railway.app
```

## 🎉 That's It!

Once deployed, all 3 apps will:
- Auto-update on git push
- Run 24/7
- Cost $0/month

**Start with MongoDB URL!** 💕

