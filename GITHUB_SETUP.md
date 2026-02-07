# 📦 GitHub Setup & Deployment

## Quick Start

### 1. Initialize Git (if not already)

```bash
cd /Users/tirthparikh/Desktop/Liza
git init
git add .
git commit -m "Initial commit - Liza Love Website"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `liza-love` (or any name you like)
3. Description: "Romantic website for Liza 💕"
4. Choose: **Private** (recommended) or Public
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

### 3. Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/liza-love.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/liza-love.git

git branch -M main
git push -u origin main
```

### 4. Verify

Visit: `https://github.com/YOUR_USERNAME/liza-love`
You should see all your files!

## 🚀 Ready for Deployment!

Once on GitHub, you can deploy to:
- **Railway** (Backend) - Auto-connects from GitHub
- **Vercel** (Frontend + Admin) - Auto-connects from GitHub

## 📝 Next Steps

1. **Provide MongoDB URL** - I'll update the config
2. **Deploy Backend** - Railway will auto-detect from GitHub
3. **Deploy Frontend** - Vercel will auto-detect from GitHub
4. **Deploy Admin** - Vercel (separate project)

All deployments will auto-update when you push to GitHub! 🎉

