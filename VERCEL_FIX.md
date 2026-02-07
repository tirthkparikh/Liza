# 🔧 Fix Empty White Pages on Vercel

## Problem: White/Empty Pages

This happens because Vercel needs proper routing configuration for React apps.

## ✅ Solution

### For Main Website (Frontend):

1. **Go to Vercel Dashboard**
2. **Select your frontend project**
3. **Settings → General**
4. **Check these settings:**
   - Framework Preset: **Vite**
   - Root Directory: `/` (or leave empty)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

6. **Redeploy:**
   - Go to Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"

### For Admin Panel:

1. **Go to Vercel Dashboard**
2. **Select your admin project**
3. **Settings → General**
4. **Check these settings:**
   - Framework Preset: **Vite**
   - Root Directory: `admin`
   - Build Command: `cd admin && npm run build`
   - Output Directory: `admin/dist`
   - Install Command: `npm install`

5. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

6. **Redeploy**

## 🔍 Check Build Logs

If still white page:
1. Go to Deployments
2. Click on the deployment
3. Check "Build Logs"
4. Look for errors

Common issues:
- Build failing → Check Node version (should be 18+)
- Missing dependencies → Check package.json
- Routing issues → Already fixed in vercel.json

## ✅ After Fix

Your pages should show:
- Frontend: Login page or home page
- Admin: Login page

If you see login pages, it's working! 🎉

