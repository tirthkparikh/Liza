# 🗄️ Get MongoDB URL in 2 Minutes

## Quick Setup (MongoDB Atlas - Free)

### Step 1: Create Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google (fastest) or email
3. Verify email if needed

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0)
3. Select a cloud provider (AWS is fine)
4. Choose a region closest to you
5. Click "Create"

### Step 3: Create Database User
1. Username: `liza-admin` (or any name)
2. Password: Create a strong password (save it!)
3. Click "Create Database User"

### Step 4: Network Access
1. Click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Database" → "Connect"
2. Choose "Connect your application"
3. Driver: Node.js
4. Version: 5.5 or later
5. **Copy the connection string**

It looks like:
```
mongodb+srv://liza-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Add Database Name
Replace the `?` at the end with your database name:
```
mongodb+srv://liza-admin:<password>@cluster0.xxxxx.mongodb.net/liza-love?retryWrites=true&w=majority
```

**Replace `<password>` with your actual password!**

## ✅ That's it! You now have your MongoDB URL!

Copy it and we'll add it to the deployment config.

---

## Alternative: Use Local MongoDB

If you have MongoDB installed locally:
```
mongodb://localhost:27017/liza-love
```

But for hosting, MongoDB Atlas is better!

