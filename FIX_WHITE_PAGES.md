# 🔧 Fix White Pages on Vercel

## The Issue

White pages usually mean:
1. Build failed silently
2. Routing not configured
3. Missing environment variables
4. Wrong build settings

## ✅ Fix Steps

### Step 1: Check Build Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments"
4. Click on the latest deployment
5. Check "Build Logs"

**Look for:**
- ✅ "Build successful" = Good
- ❌ "Build failed" = Problem

### Step 2: Fix Build Settings

**For Main Website:**

Vercel → Settings → General:
- **Framework Preset:** Vite
- **Root Directory:** `/` (empty or `/`)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**For Admin Panel:**

Vercel → Settings → General:
- **Framework Preset:** Vite
- **Root Directory:** `admin`
- **Build Command:** `cd admin && npm run build`
- **Output Directory:** `admin/dist`
- **Install Command:** `npm install`

### Step 3: Add Environment Variables

**Both projects need:**
```
VITE_API_URL=https://your-backend.railway.app
```

(Get this URL after deploying backend to Railway)

### Step 4: Redeploy

1. Go to Deployments
2. Click "..." on latest
3. Click "Redeploy"
4. Wait for build

### Step 5: Check Again

Visit your Vercel URLs:
- Should see login page or content
- Not white page!

## 🆘 Still White?

1. **Check browser console:**
   - Press F12
   - Look for errors (red text)

2. **Check Network tab:**
   - See if files are loading
   - Look for 404 errors

3. **Try hard refresh:**
   - Ctrl+Shift+R (Windows)
   - Cmd+Shift+R (Mac)

4. **Check Vercel logs:**
   - Deployments → View Function Logs

## ✅ Expected Result

After fix, you should see:
- **Frontend:** Login page with hearts animation
- **Admin:** Admin login page

If you see login pages = SUCCESS! 🎉

