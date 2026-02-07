# 🚨 URGENT: Fix White Pages on Vercel

## The Problem
White pages = Build succeeded but routing failed OR build failed silently

## ✅ Quick Fix (Do This Now!)

### Step 1: Check Vercel Build Settings

**For Main Website:**
1. Vercel Dashboard → Your frontend project
2. Settings → General
3. **VERIFY these settings:**
   ```
   Framework Preset: Vite
   Root Directory: / (or empty)
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

**For Admin Panel:**
1. Vercel Dashboard → Your admin project  
2. Settings → General
3. **VERIFY these settings:**
   ```
   Framework Preset: Vite
   Root Directory: admin
   Build Command: cd admin && npm run build
   Output Directory: admin/dist
   Install Command: npm install
   ```

### Step 2: Add Environment Variable

**BOTH projects need:**
```
VITE_API_URL=https://your-railway-backend-url.railway.app
```

(You'll get this after deploying backend to Railway)

### Step 3: Redeploy

1. Go to Deployments
2. Click "..." on latest
3. Click "Redeploy"
4. Wait 2-3 minutes

### Step 4: Check Build Logs

If still white:
1. Click on deployment
2. Check "Build Logs"
3. Look for errors (red text)

## 🔍 Common Issues

**"Build failed"**
→ Check Node version (should be 18+)
→ Check package.json exists
→ Check all dependencies

**"404 on routes"**
→ Already fixed with vercel.json rewrites

**"Blank page"**
→ Check browser console (F12)
→ Look for JavaScript errors

## ✅ Expected Result

After fix:
- **Frontend:** Should show login page with hearts
- **Admin:** Should show admin login page

**If you see login pages = SUCCESS!** 🎉

---

## 🚂 Deploy Backend First!

Before fixing frontend, deploy backend to Railway:

1. Railway.app → New Project → GitHub
2. Root: `server`
3. Variables:
   ```
   MONGODB_URI=mongodb+srv://liza_admin:liza12345@cluster-1.16ck1li.mongodb.net/liza-love?appName=Cluster-1
   JWT_SECRET=any-random-secret-key
   NODE_ENV=production
   ```
4. Copy Railway URL
5. Add to Vercel: `VITE_API_URL`
6. Redeploy Vercel

**Then white pages will be fixed!** 💕

