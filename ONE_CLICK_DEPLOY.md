# ⚡ One-Click Deployment Guide

## 🎯 The Fastest Way to Deploy

### What You Need:
1. **MongoDB URL** (get it in 2 minutes - see below)
2. **GitHub account** (free)
3. **Railway account** (free)
4. **Vercel account** (free)

---

## 📋 Complete Checklist

### ✅ Pre-Deployment (5 minutes)

- [ ] Get MongoDB URL (see GET_MONGODB.md)
- [ ] Create GitHub repository
- [ ] Push code to GitHub

### ✅ Backend Deployment (Railway - 3 minutes)

- [ ] Sign up at railway.app
- [ ] Connect GitHub
- [ ] Deploy from repo
- [ ] Set root: `server`
- [ ] Add MONGODB_URI
- [ ] Add JWT_SECRET
- [ ] Copy deployment URL

### ✅ Frontend Deployment (Vercel - 2 minutes)

- [ ] Sign up at vercel.com
- [ ] Connect GitHub
- [ ] Import repo
- [ ] Add VITE_API_URL
- [ ] Deploy
- [ ] Copy URL

### ✅ Admin Deployment (Vercel - 2 minutes)

- [ ] New project in Vercel
- [ ] Same repo, root: `admin`
- [ ] Add VITE_API_URL
- [ ] Deploy
- [ ] Copy URL

### ✅ Final Setup (1 minute)

- [ ] Add FRONTEND_URL to Railway
- [ ] Add ADMIN_URL to Railway
- [ ] Test all URLs

---

## 🚀 Quick Start Commands

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Liza Love Website"
git remote add origin https://github.com/YOUR_USERNAME/liza-love.git
git push -u origin main

# 2. Then deploy via Railway and Vercel web interfaces
# (No command line needed - all GUI!)
```

---

## 📝 Environment Variables Cheat Sheet

### Railway (Backend):
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/liza-love?retryWrites=true&w=majority
JWT_SECRET=any-random-secret-string
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

### Vercel (Frontend & Admin):
```
VITE_API_URL=https://your-backend.railway.app
```

---

## 🎁 All Free!

- Railway: 500 hours/month free
- Vercel: Unlimited free
- MongoDB Atlas: 512MB free
- **Total: $0/month!**

---

## 🆘 Troubleshooting

**"MongoDB connection failed"**
→ Check your MongoDB URL
→ Make sure password is correct
→ Verify IP whitelist (0.0.0.0/0)

**"CORS error"**
→ Add FRONTEND_URL and ADMIN_URL to Railway
→ Wait for redeploy

**"Build failed"**
→ Check build logs
→ Verify Node.js version (18+)
→ Check all dependencies installed

---

**Ready? Start with getting your MongoDB URL!** 💕

See `GET_MONGODB.md` for detailed MongoDB setup.

