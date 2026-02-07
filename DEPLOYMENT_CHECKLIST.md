# ✅ Deployment Checklist

## Before Deployment

- [ ] MongoDB URL ready
- [ ] All environment variables prepared
- [ ] GitHub repository created
- [ ] Code pushed to GitHub

## Backend (Railway)

- [ ] Account created on Railway
- [ ] Project created and connected to GitHub
- [ ] Root directory set to `server`
- [ ] Environment variables added:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] EMAIL_USER
  - [ ] EMAIL_PASS
  - [ ] TWILIO_ACCOUNT_SID
  - [ ] TWILIO_AUTH_TOKEN
  - [ ] TWILIO_PHONE_NUMBER
  - [ ] GOOGLE_CLIENT_ID
  - [ ] GOOGLE_CLIENT_SECRET
  - [ ] FRONTEND_URL (update after frontend deploys)
- [ ] Deployment successful
- [ ] Backend URL copied

## Frontend (Vercel)

- [ ] Account created on Vercel
- [ ] Project created and connected to GitHub
- [ ] Root directory: `/`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable added:
  - [ ] VITE_API_URL (backend URL from Railway)
- [ ] Deployment successful
- [ ] Frontend URL copied

## Admin Panel (Vercel)

- [ ] New project created in Vercel
- [ ] Same repository, different root: `admin`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable added:
  - [ ] VITE_API_URL (backend URL from Railway)
- [ ] Deployment successful
- [ ] Admin URL copied

## Post-Deployment

- [ ] Update FRONTEND_URL in Railway with frontend URL
- [ ] Update CORS in backend to include all URLs
- [ ] Test backend health: `https://your-backend.railway.app/api/health`
- [ ] Test frontend loads correctly
- [ ] Test admin panel loads correctly
- [ ] Register admin account
- [ ] Test image upload
- [ ] Test blog creation
- [ ] Test story creation
- [ ] Verify MongoDB connection
- [ ] Test email (if configured)
- [ ] Test SMS (if configured)

## URLs to Save

- Backend: `https://________________.railway.app`
- Frontend: `https://________________.vercel.app`
- Admin: `https://________________.vercel.app`

## Notes

- MongoDB Atlas: Whitelist all IPs (0.0.0.0/0) for Railway
- CORS: Update server.js with all frontend URLs
- Environment: Never commit .env files
- Secrets: Use environment variables for all sensitive data

