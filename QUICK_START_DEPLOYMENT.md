# 🚀 Auto-Deployment Quick Start

## What You Got

I've set up complete auto-deployment for all 3 projects:

### 📁 Files Created:
1. **`.github/workflows/deploy.yml`** - GitHub Actions workflow (auto-build on push)
2. **`setup-deployment.sh`** - Setup script (run once)
3. **`vercel.json`** - Main website config
4. **`admin/vercel.json`** - Admin panel config  
5. **`server/vercel.json`** - Backend config (for Vercel)
6. **`server/railway.json`** - Backend config (for Railway)
7. **`DEPLOYMENT_COMPLETE_GUIDE.md`** - Full guide
8. **`GITHUB_SECRETS_SETUP.md`** - Secrets configuration
9. **`.env.example`** - Environment variables template

## ⚡ Quick Start (5 Minutes)

### Step 1: Run Setup Script
```bash
cd /Users/tirthparikh/Desktop/Liza
./setup-deployment.sh
```

This will:
- ✅ Check project structure
- ✅ Install all dependencies
- ✅ Test all builds
- ✅ Push code to GitHub

### Step 2: Connect Platforms

**Vercel (2 projects):**
1. Go to https://vercel.com
2. Import your GitHub repo **TWICE**:
   - Once for main website (root: `./`)
   - Once for admin panel (root: `./admin`)
3. Note the project IDs

**Railway (1 project):**
1. Go to https://railway.app
2. Create project from GitHub
3. Set root directory: `/server`
4. Note the deployment URL

### Step 3: Add GitHub Secrets

Go to: `GitHub Repo → Settings → Secrets → Actions`

Add these 6 secrets:

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_MAIN_PROJECT_ID=main_project_id
VERCEL_ADMIN_PROJECT_ID=admin_project_id
RAILWAY_TOKEN=your_railway_token
VITE_API_URL=https://your-backend.up.railway.app
```

### Step 4: Test It!

```bash
git add .
git commit -m "Test auto-deployment"
git push origin main
```

Watch it deploy automatically! 🎉

## 🔄 What Happens Now?

Every push to `main`:
1. ✅ Builds all 3 projects
2. ✅ Runs tests
3. ✅ Deploys to production
4. ✅ Notifies you of success/failure

## 📚 Detailed Guides

- **Full Instructions**: See `DEPLOYMENT_COMPLETE_GUIDE.md`
- **GitHub Secrets**: See `GITHUB_SECRETS_SETUP.md`
- **Environment Variables**: See `.env.example`

## 🌐 Your URLs Will Be

- **Main Website**: `https://your-name.vercel.app`
- **Admin Panel**: `https://your-admin.vercel.app`
- **Backend API**: `https://your-backend.up.railway.app`

## 🆘 Need Help?

1. Check the detailed guides above
2. Look at GitHub Actions logs (GitHub → Actions tab)
3. Verify all secrets are correct
4. Make sure you manually deployed once first

## 🎯 One-Line Summary

**Push code → Auto builds → Auto deploys → Live in 2 minutes!**

---

💕 Your Liza Love Project will stay automatically updated forever!