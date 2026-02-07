# 🚂 Deploy Backend to Railway

## Quick Steps:

1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. **Select** your `liza-love` repository
5. **Click** on the deployed service
6. **Settings** tab:
   - **Root Directory:** Type `server`
7. **Variables** tab → **Add these:**

```
MONGODB_URI=mongodb+srv://liza_admin:liza12345@cluster-1.16ck1li.mongodb.net/liza-love?appName=Cluster-1
JWT_SECRET=your-random-secret-key-here-change-this
NODE_ENV=production
PORT=5000
```

8. **Wait for deployment** (green checkmark)
9. **Copy the URL** (e.g., `https://liza-love-production.up.railway.app`)

## ✅ Test Backend

Visit: `https://your-railway-url.railway.app/api/health`

Should see: `{"status":"ok","message":"Liza Love Server is running!"}`

## 🔗 Update Frontend URLs

After getting Railway URL, update Vercel:

**Frontend Vercel:**
- Environment Variable: `VITE_API_URL=https://your-railway-url.railway.app`

**Admin Vercel:**
- Environment Variable: `VITE_API_URL=https://your-railway-url.railway.app`

Then redeploy both!

## 🔄 Update CORS

Railway → Variables → Add:
```
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

Railway will auto-redeploy!

