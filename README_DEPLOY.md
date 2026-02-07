# 🚀 QUICK DEPLOY - Read This First!

## ⚡ Super Simple 3-Step Process

### 1️⃣ Get MongoDB URL (2 minutes)

**Easiest way:**
1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google
3. Click "Build a Database" → Choose FREE
4. Create user → Save password!
5. Network Access → Allow from anywhere (0.0.0.0/0)
6. Connect → Copy connection string
7. Replace `<password>` with your password
8. Add `/liza-love` before the `?`

**Your URL:**
```
mongodb+srv://username:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/liza-love?retryWrites=true&w=majority
```

### 2️⃣ Push to GitHub (1 minute)

```bash
git init
git add .
git commit -m "Liza Love Website"
git remote add origin https://github.com/YOUR_USERNAME/liza-love.git
git push -u origin main
```

### 3️⃣ Deploy (10 minutes)

**Backend (Railway):**
- Go to railway.app → Sign up with GitHub
- New Project → Deploy from GitHub
- Root: `server`
- Add: `MONGODB_URI` = (your URL from step 1)
- Add: `JWT_SECRET` = (any random string)
- Copy URL

**Frontend (Vercel):**
- Go to vercel.com → Sign up with GitHub
- New Project → Import repo
- Add: `VITE_API_URL` = (Railway URL)
- Deploy!

**Admin (Vercel):**
- New Project → Same repo
- Root: `admin`
- Add: `VITE_API_URL` = (Railway URL)
- Deploy!

**Update CORS (Railway):**
- Add: `FRONTEND_URL` = (Vercel frontend URL)
- Add: `ADMIN_URL` = (Vercel admin URL)

## ✅ Done! Website is LIVE!

---

## 📝 Need Help?

**MongoDB URL format:**
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/liza-love?retryWrites=true&w=majority
```

**All services are FREE:**
- Railway: 500 hours/month
- Vercel: Unlimited
- MongoDB: 512MB

**Total: $0/month!** 💕

---

**Start with Step 1 - Get MongoDB URL!** 🗄️

