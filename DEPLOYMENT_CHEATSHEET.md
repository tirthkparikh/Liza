# 🎯 Deployment Command Reference

## 🚀 Quick Commands

### Initial Setup
```bash
# Run setup script
./setup-deployment.sh

# Or manually install
cd /Users/tirthparikh/Desktop/Liza
npm install
cd admin && npm install
cd ../server && npm install
```

### Manual Deploy (First Time)
```bash
# Main Website
cd /Users/tirthparikh/Desktop/Liza
vercel

# Admin Panel
cd admin
vercel

# Backend (Railway)
cd server
railway up
```

### Get Configuration IDs
```bash
# Vercel credentials
vercel token                    # Get token
vercel link                     # Link project
cat .vercel/project.json        # Get org & project IDs
cat admin/.vercel/project.json  # Get admin project ID

# Railway credentials
railway login                   # Login
railway status                  # Check status
```

### Test Auto-Deployment
```bash
# Make a change
echo "Test" >> README.md
git add .
git commit -m "Test deployment"
git push origin main

# Watch it deploy
# Go to GitHub → Actions tab
```

## 🔐 Required GitHub Secrets (6 total)

```
VERCEL_TOKEN              # From: vercel token
VERCEL_ORG_ID            # From: .vercel/project.json
VERCEL_MAIN_PROJECT_ID   # From: .vercel/project.json
VERCEL_ADMIN_PROJECT_ID  # From: admin/.vercel/project.json
RAILWAY_TOKEN            # From: Railway Dashboard
VITE_API_URL             # Your backend URL
```

## 🌐 Platform URLs

After deployment:

| Project | URL Pattern | Example |
|---------|-------------|---------|
| Main Website | `https://[name].vercel.app` | `https://liza-love.vercel.app` |
| Admin Panel | `https://[name].vercel.app` | `https://liza-admin.vercel.app` |
| Backend API | `https://[name].up.railway.app` | `https://liza-api.up.railway.app` |

## 📝 Environment Variables

### Main Website & Admin (.env)
```
VITE_API_URL=https://your-backend.up.railway.app
```

### Backend (Railway)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
LOVER_EMAIL=liza@example.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

## 🔍 Troubleshooting

### Build Fails
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Check Logs
```bash
# GitHub Actions
cat .github/workflows/deploy.yml

# Vercel
vercel logs

# Railway
railway logs
```

### Reset Deployment
```bash
# Remove Vercel config
rm -rf .vercel
rm -rf admin/.vercel

# Re-deploy
vercel
```

## 📊 Status Check Commands

```bash
# Check if repo is clean
git status

# Check remote
git remote -v

# Check GitHub Actions
gh run list

# Check Vercel deployments
vercel list

# Check Railway status
railway status
```

## 🎨 Quick Customization

### Change Deployment Branch
Edit `.github/workflows/deploy.yml`:
```yaml
on:
  push:
    branches: [ main ]  # Change to your branch
```

### Disable Auto-Deploy
Comment out deploy jobs in `.github/workflows/deploy.yml`

### Manual Trigger Only
Add to workflow:
```yaml
on:
  workflow_dispatch:  # Only manual trigger
```

## 🎯 Success Checklist

Run this to verify everything:
```bash
# 1. Check files exist
ls .github/workflows/deploy.yml
ls vercel.json
ls admin/vercel.json
ls server/railway.json

# 2. Check builds work
npm run build
cd admin && npm run build && cd ..
cd server && npm start &

# 3. Check GitHub secrets (if using gh CLI)
gh secret list

# 4. Test push
git add . && git commit -m "Test" && git push
```

## 💡 Pro Tips

1. **Always deploy backend first** - Frontend needs the API URL
2. **Use branch protection** - Prevent direct pushes to main
3. **Enable Vercel previews** - Test changes before merging
4. **Set up monitoring** - Use Railway/Vercel dashboards
5. **Keep secrets safe** - Never commit .env files

## 🆘 Emergency Commands

```bash
# Redeploy everything
vercel --prod
cd admin && vercel --prod
cd server && railway up

# Rollback to previous version
vercel rollback

# View deployment history
vercel list
railway history
```

---

💕 Save this card for quick reference!