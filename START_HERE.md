# 🎯 START HERE - Quick Deployment

## 🗄️ Step 1: Get MongoDB URL (REQUIRED)

### Fastest Way - MongoDB Atlas (Free):

1. **Visit:** https://www.mongodb.com/cloud/atlas/register
2. **Sign up** (use Google - it's fastest)
3. **Click "Build a Database"**
4. **Choose FREE tier** (M0)
5. **Click "Create"**
6. **Create Database User:**
   - Username: `liza-admin`
   - Password: (create and SAVE this!)
7. **Network Access:**
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
8. **Get Connection String:**
   - Click "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the string
   - Replace `<password>` with your password
   - Add `/liza-love` before the `?`

**Your final URL should look like:**
```
mongodb+srv://liza-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/liza-love?retryWrites=true&w=majority
```

## 📦 Step 2: Push to GitHub

```bash
cd /Users/tirthparikh/Desktop/Liza

# Initialize git
git init
git add .
git commit -m "Liza Love Website"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/liza-love.git
git branch -M main
git push -u origin main
```

## 🚂 Step 3: Deploy Backend (Railway)

1. Go to: https://railway.app
2. Sign up with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Settings → Root Directory: `server`
6. Variables → Add:
   - `MONGODB_URI` = (your MongoDB URL from Step 1)
   - `JWT_SECRET` = (any random string)
   - `NODE_ENV` = `production`
7. Copy the deployment URL

## 🌐 Step 4: Deploy Frontend (Vercel)

1. Go to: https://vercel.com
2. Sign up with GitHub
3. "New Project" → Import repo
4. Root: `/`
5. Build: `npm run build`
6. Output: `dist`
7. Environment: `VITE_API_URL` = (your Railway URL)
8. Deploy!

## 🔐 Step 5: Deploy Admin (Vercel)

1. Vercel → "New Project" (same repo)
2. Root: `admin`
3. Build: `npm run build`
4. Output: `dist`
5. Environment: `VITE_API_URL` = (your Railway URL)
6. Deploy!

## ✅ Step 6: Update CORS

Railway → Variables → Add:
- `FRONTEND_URL` = (your frontend Vercel URL)
- `ADMIN_URL` = (your admin Vercel URL)

## 🎉 Done!

Your website is live! Visit your Vercel URLs!

---

## 💡 Pro Tip

**If MongoDB setup is taking too long:**
- Use Railway's MongoDB addon (one-click)
- Or use local MongoDB for testing: `mongodb://localhost:27017/liza-love`

**Start with getting your MongoDB URL - that's the only thing you need!** 💕

