# Complete Deployment Guide 🚀

This guide will help you deploy all 3 projects (Main Website, Admin Panel, Backend Server) with auto-build on every push to GitHub.

## 📁 Project Structure

```
Liza/
├── .github/workflows/deploy.yml    # Auto-deploy workflow
├── vercel.json                      # Main website config
├── package.json                     # Main website
├── admin/
│   ├── vercel.json                 # Admin config
│   └── package.json
└── server/
    ├── railway.json                # Backend config
    ├── vercel.json                 # Alternative backend config
    └── package.json
```

## 🚀 Quick Setup (5 minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Setup auto-deployment"
git push origin main
```

### 2. Connect to Vercel (Frontend + Admin)

#### Main Website:
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repo
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
6. Click "Deploy"

#### Admin Panel:
1. Add another project on Vercel
2. Import same GitHub repo
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add same environment variables
5. Click "Deploy"

### 3. Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repo
5. Set root directory to `/server`
6. Add Environment Variables (see below)
7. Click "Deploy"

## 🔐 Required Environment Variables

### Main Website (Vercel)
```
VITE_API_URL=https://your-backend-url.railway.app
```

### Admin Panel (Vercel)
```
VITE_API_URL=https://your-backend-url.railway.app
```

### Backend Server (Railway)
```
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/liza-love
JWT_SECRET=your-super-secret-key-here

# Optional - for features
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
LOVER_EMAIL=liza@example.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

## 🤖 GitHub Actions Auto-Build Setup

### 1. Add GitHub Secrets
Go to your GitHub repo → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_MAIN_PROJECT_ID=main-website-project-id
VERCEL_ADMIN_PROJECT_ID=admin-project-id
RAILWAY_TOKEN=your-railway-token
VITE_API_URL=https://your-backend-url.railway.app
```

### 2. Get Vercel Credentials
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Get token
vercel token

# Get org ID (from .vercel/project.json after linking)
vercel link
```

### 3. Get Railway Token
1. Go to Railway Dashboard
2. Click your profile (top right)
3. Go to "Tokens"
4. Create new token
5. Copy and add to GitHub secrets

## 🔄 How Auto-Build Works

When you push to `main` branch:

1. **GitHub Actions triggers**
2. **Builds all 3 projects**:
   - Main website: `npm run build`
   - Admin panel: `cd admin && npm run build`
   - Server: `cd server && npm install`

3. **Deploys automatically**:
   - Main website → Vercel
   - Admin panel → Vercel
   - Backend → Railway

4. **Notifications**:
   - Success message with all URLs
   - Error message if anything fails

## 🌐 Deployment URLs After Setup

- **Main Website**: `https://your-project.vercel.app`
- **Admin Panel**: `https://your-admin.vercel.app`
- **Backend API**: `https://your-backend.up.railway.app`

## 🛠️ Alternative Deployment Options

### Option A: All on Vercel (Easiest)
- Main: Vercel
- Admin: Vercel
- Backend: Vercel (serverless)

**Pros**: One platform, free tier
**Cons**: Server has cold starts, limited execution time

### Option B: Vercel + Railway (Recommended)
- Main: Vercel
- Admin: Vercel
- Backend: Railway

**Pros**: Best performance, always-on backend
**Cons**: Two platforms to manage

### Option C: Netlify + Render (Alternative)
- Main: Netlify
- Admin: Netlify
- Backend: Render

## 🔧 Manual Deployment (if needed)

### Deploy Main Website
```bash
# From root directory
npm install
npm run build
vercel --prod
```

### Deploy Admin
```bash
cd admin
npm install
npm run build
vercel --prod
```

### Deploy Backend
```bash
cd server
npm install
railway up
```

## 📝 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel projects created (2)
- [ ] Railway project created (1)
- [ ] Environment variables added to all platforms
- [ ] GitHub secrets configured
- [ ] GitHub Actions workflow file in place
- [ ] Test push to trigger auto-build
- [ ] Verify all 3 sites are live
- [ ] Test login and features

## 🆘 Troubleshooting

### Build fails on Vercel
- Check `package.json` has correct build script
- Verify Node.js version 18+
- Check for missing environment variables

### Backend not connecting
- Verify `VITE_API_URL` points to correct backend
- Check CORS settings in `server/server.js`
- Ensure MongoDB URI is correct

### Auto-build not triggering
- Verify `.github/workflows/deploy.yml` exists
- Check GitHub secrets are set correctly
- Ensure Actions are enabled in repo settings

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs
2. Verify environment variables
3. Test locally first: `npm run dev` in each folder
4. Check deployment platform logs

## 🎉 Success!

Once configured, every push to `main` will automatically:
- Build all 3 projects
- Run tests
- Deploy to production
- Notify you of success/failure

Your Liza Love Project will be live and auto-updating! 💕