#!/bin/bash

# Liza Love Project - Auto Deployment Setup Script
# This script helps you configure auto-deployment for all 3 projects

echo "🚀 Liza Love Project - Deployment Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git repo exists
if [ ! -d .git ]; then
    echo -e "${RED}❌ Error: Not a git repository${NC}"
    echo "Please initialize git first: git init"
    exit 1
fi

echo -e "${GREEN}✅ Git repository found${NC}"
echo ""

# Check for required files
echo "📁 Checking project structure..."

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Missing: package.json (Main Website)${NC}"
    exit 1
fi

if [ ! -f "admin/package.json" ]; then
    echo -e "${RED}❌ Missing: admin/package.json (Admin Panel)${NC}"
    exit 1
fi

if [ ! -f "server/package.json" ]; then
    echo -e "${RED}❌ Missing: server/package.json (Backend)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All project files found${NC}"
echo ""

# Check for GitHub remote
echo "🌐 Checking GitHub connection..."
REMOTE=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$REMOTE" ]; then
    echo -e "${YELLOW}⚠️  No GitHub remote configured${NC}"
    echo "Please add your GitHub repo:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    exit 1
fi

echo -e "${GREEN}✅ GitHub remote: $REMOTE${NC}"
echo ""

# Check for deployment files
echo "⚙️  Checking deployment configuration..."

if [ ! -f ".github/workflows/deploy.yml" ]; then
    echo -e "${RED}❌ Missing: .github/workflows/deploy.yml${NC}"
    echo "Please ensure the GitHub Actions workflow file exists"
    exit 1
fi

echo -e "${GREEN}✅ GitHub Actions workflow configured${NC}"
echo ""

# Install dependencies locally to test
echo "📦 Testing local build..."
echo "Installing main website dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install main website dependencies${NC}"
    exit 1
fi

echo "Installing admin dependencies..."
cd admin && npm install && cd ..

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install admin dependencies${NC}"
    exit 1
fi

echo "Installing server dependencies..."
cd server && npm install && cd ..

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install server dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All dependencies installed${NC}"
echo ""

# Test build
echo "🔨 Testing builds..."
echo "Building main website..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Main website build failed${NC}"
    exit 1
fi

echo "Building admin panel..."
cd admin && npm run build && cd ..

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Admin panel build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All builds successful${NC}"
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Setup auto-deployment configuration" || echo "Nothing to commit"
git push origin main || git push origin master

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Push failed or no changes to push${NC}"
    echo "You may need to push manually"
fi

echo -e "${GREEN}✅ Code pushed to GitHub${NC}"
echo ""

# Instructions
echo "========================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "========================================"
echo ""
echo "Next steps to enable auto-deployment:"
echo ""
echo -e "${YELLOW}1. Connect to Vercel:${NC}"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repo (2 times - for main and admin)"
echo "   - Configure root directories and build settings"
echo ""
echo -e "${YELLOW}2. Deploy Backend to Railway:${NC}"
echo "   - Go to https://railway.app"
echo "   - Create new project from GitHub"
echo "   - Set root directory to /server"
echo "   - Add environment variables"
echo ""
echo -e "${YELLOW}3. Add GitHub Secrets:${NC}"
echo "   Go to: GitHub Repo → Settings → Secrets → Actions"
echo "   Add these secrets:"
echo "   - VERCEL_TOKEN"
echo "   - VERCEL_ORG_ID"
echo "   - VERCEL_MAIN_PROJECT_ID"
echo "   - VERCEL_ADMIN_PROJECT_ID"
echo "   - RAILWAY_TOKEN"
echo "   - VITE_API_URL"
echo ""
echo -e "${YELLOW}4. Get Your Tokens:${NC}"
echo "   Vercel: npm i -g vercel && vercel login && vercel token"
echo "   Railway: Railway Dashboard → Tokens → Create"
echo ""
echo -e "${GREEN}Once configured, every push to main will auto-deploy!${NC}"
echo ""
echo "📖 See DEPLOYMENT_COMPLETE_GUIDE.md for detailed instructions"
echo ""
echo "💕 Happy deploying!"