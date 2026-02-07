# ⚙️ Vercel Settings for Both Projects

## 🌐 Main Website (Frontend) Settings

**Project Settings → General:**

```
Framework Preset: Vite
Root Directory: / (or leave empty)
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x (or latest)
```

**Environment Variables:**
```
VITE_API_URL=https://your-backend.railway.app
```

**Important:** Replace `your-backend.railway.app` with your actual Railway URL!

---

## 🔐 Admin Panel Settings

**Project Settings → General:**

```
Framework Preset: Vite
Root Directory: admin
Build Command: cd admin && npm run build
Output Directory: admin/dist
Install Command: npm install
Node Version: 18.x (or latest)
```

**Environment Variables:**
```
VITE_API_URL=https://your-backend.railway.app
```

**Same URL as frontend!**

---

## 🔄 How to Update

1. Go to Vercel Dashboard
2. Select project
3. Settings → Environment Variables
4. Add/Edit `VITE_API_URL`
5. Redeploy (Deployments → ... → Redeploy)

---

## ✅ After Settings

Both should show:
- Login pages (not white)
- Proper routing
- Connected to backend

If still white, check build logs for errors!

