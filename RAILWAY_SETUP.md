# 🚂 Railway Backend Setup

## Your MongoDB URL:
```
mongodb+srv://liza_admin:liza12345@cluster-1.16ck1li.mongodb.net/liza-love?appName=Cluster-1
```

## 🚀 Deploy to Railway:

1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. **Select** your `liza-love` repository
5. **Click** on the deployed service
6. **Settings** → **Root Directory:** Type `server`
7. **Variables** tab → **Add these:**

```
MONGODB_URI=mongodb+srv://liza_admin:liza12345@cluster-1.16ck1li.mongodb.net/liza-love?appName=Cluster-1
JWT_SECRET=liza-love-secret-key-2024-change-this
NODE_ENV=production
PORT=5001
```

8. **Wait for deployment** (watch the logs)
9. **Copy the URL** when done (e.g., `https://liza-love-production.up.railway.app`)

## ✅ Test:

Visit: `https://your-railway-url.railway.app/api/health`

Should see: `{"status":"ok","message":"Liza Love Server is running!"}`

## 🔗 Next:

1. Copy Railway URL
2. Add to Vercel environment variables: `VITE_API_URL`
3. Redeploy Vercel projects
4. Add FRONTEND_URL and ADMIN_URL to Railway
5. Done! 🎉

