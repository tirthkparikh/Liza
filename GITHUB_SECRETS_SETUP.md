# GitHub Secrets Setup Guide 🔐

To enable auto-deployment on every push, you need to add these secrets to your GitHub repository.

## 📝 Required Secrets

Add these to: `GitHub Repo → Settings → Secrets and variables → Actions → New repository secret`

### 1. Vercel Configuration

#### `VERCEL_TOKEN`
**How to get:**
```bash
npm i -g vercel
vercel login
vercel token
```
Copy the token and add it as a secret.

#### `VERCEL_ORG_ID`
**How to get:**
```bash
vercel link
```
After linking, check `.vercel/project.json`:
```json
{
  "orgId": "YOUR_ORG_ID_HERE",
  "projectId": "YOUR_PROJECT_ID_HERE"
}
```

#### `VERCEL_MAIN_PROJECT_ID`
**How to get:**
1. Deploy main website to Vercel first (manual deploy)
2. Check `.vercel/project.json` for `projectId`
3. Or go to Vercel Dashboard → Project Settings → General → Project ID

#### `VERCEL_ADMIN_PROJECT_ID`
**How to get:**
1. Deploy admin panel to Vercel separately
2. Check `admin/.vercel/project.json` for `projectId`
3. Or go to Vercel Dashboard → Project Settings → General → Project ID

### 2. Railway Configuration

#### `RAILWAY_TOKEN`
**How to get:**
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click your profile (top right corner)
3. Select "Tokens"
4. Click "New Token"
5. Name it "GitHub Actions"
6. Copy the token and add to GitHub secrets

### 3. Application Configuration

#### `VITE_API_URL`
**Value:** Your backend URL after deployment
```
https://your-backend.up.railway.app
```

This tells the frontend where to find the API.

## 🔧 Step-by-Step Setup

### Step 1: Manual First Deploy (Required)

Before auto-deployment works, you need to manually deploy once:

#### Deploy Main Website:
```bash
cd /Users/tirthparikh/Desktop/Liza
npm install
vercel
# Follow prompts, set root to ./
# Note the deployment URL
```

#### Deploy Admin Panel:
```bash
cd admin
npm install
vercel
# Follow prompts, set root to ./admin
# Note the deployment URL
```

#### Deploy Backend:
```bash
# Option A: Railway (Recommended)
cd server
railway login
railway init
railway up
# Note the deployment URL

# Option B: Vercel (Alternative)
cd server
vercel
# Follow prompts, set root to ./server
```

### Step 2: Get Your Project IDs

After manual deploy, you'll have project files:

```bash
# Main website
cat .vercel/project.json

# Admin panel
cat admin/.vercel/project.json
```

Example output:
```json
{
  "orgId": "team_abc123xyz",
  "projectId": "prj_def456uvw"
}
```

### Step 3: Add All Secrets to GitHub

Go to your GitHub repo and add these 7 secrets:

| Secret Name | Value | Where to Find |
|------------|-------|---------------|
| `VERCEL_TOKEN` | Your Vercel token | `vercel token` command |
| `VERCEL_ORG_ID` | Your org ID | `.vercel/project.json` |
| `VERCEL_MAIN_PROJECT_ID` | Main project ID | `.vercel/project.json` |
| `VERCEL_ADMIN_PROJECT_ID` | Admin project ID | `admin/.vercel/project.json` |
| `RAILWAY_TOKEN` | Railway API token | Railway Dashboard → Tokens |
| `VITE_API_URL` | Backend URL | Your Railway deployment URL |

### Step 4: Add Environment Variables to Platforms

#### Vercel (Main & Admin):
Go to Vercel Dashboard → Project → Settings → Environment Variables

Add:
```
VITE_API_URL=https://your-backend.up.railway.app
```

#### Railway (Backend):
Go to Railway Dashboard → Project → Variables

Add all from `.env.example`:
```
MONGODB_URI=...
JWT_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
LOVER_EMAIL=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

### Step 5: Test Auto-Deployment

Make a small change and push:

```bash
echo "# Test deploy" >> README.md
git add .
git commit -m "Test auto-deployment"
git push origin main
```

Go to GitHub → Actions tab and watch the deployment!

## ✅ Verification Checklist

- [ ] Vercel token generated and added
- [ ] Vercel org ID found and added
- [ ] Main website project ID found and added
- [ ] Admin project ID found and added
- [ ] Railway token generated and added
- [ ] VITE_API_URL set correctly
- [ ] All secrets added to GitHub
- [ ] Environment variables added to Vercel (2 projects)
- [ ] Environment variables added to Railway
- [ ] Test push triggered deployment successfully

## 🐛 Common Issues

### "VERCEL_TOKEN not found"
**Fix:** Make sure you added the secret to GitHub, not just locally

### "Project not found"
**Fix:** Deploy manually first to create the project, then get the project ID

### "Cannot find module"
**Fix:** Make sure `npm install` runs before build in the workflow

### "Deployment failed"
**Fix:** Check the GitHub Actions logs for specific error messages

## 📞 Quick Commands Reference

```bash
# Get Vercel token
vercel token

# Link project and get IDs
vercel link
cat .vercel/project.json

# Railway login
railway login

# Railway deploy
railway up
```

## 🎯 Success Indicators

After pushing to main, you should see:
1. GitHub Actions workflow starts
2. All 3 builds complete successfully
3. Deployments happen automatically
4. Green checkmarks on all jobs

Your projects will be live at:
- Main: `https://[project-name].vercel.app`
- Admin: `https://[admin-project-name].vercel.app`
- API: `https://[backend-name].up.railway.app`

## 🚀 Next Steps

Once secrets are configured:
1. Every push to `main` will auto-deploy
2. Pull requests will build but not deploy
3. You'll get notifications on success/failure
4. All 3 projects stay in sync automatically

Happy deploying! 💕