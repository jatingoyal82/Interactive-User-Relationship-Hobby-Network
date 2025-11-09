# Deploy Frontend on Vercel - Step by Step

## 🚀 Quick Deployment Guide

### Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### Step 2: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub (recommended)

2. **Import Project:**
   - Click **"Add New Project"** or **"Import Project"**
   - Select your GitHub repository: `Interactive-User-Relationship-Hobby-Network`
   - Click **"Import"**

3. **Configure Project:**
   
   **IMPORTANT:** Set these values:
   
   - **Framework Preset:** `Vite` (should auto-detect)
   - **Root Directory:** `frontend` ⚠️ **CRITICAL - Change this!**
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Add Environment Variable:**
   
   Before clicking "Deploy", click **"Environment Variables"**:
   
   - **Key:** `VITE_API_URL`
   - **Value:** `https://interactive-user-relationship-hobby-knqj.onrender.com/api`
   - **Environment:** Select all (Production, Preview, Development)
   - Click **"Add"**

5. **Deploy:**
   - Click **"Deploy"**
   - Wait 1-2 minutes for build to complete
   - Your app will be live! 🎉

### Step 3: Verify Deployment

1. **Check the deployment URL** provided by Vercel
2. **Open browser console** (F12) and check for errors
3. **Test creating a user** - should work!

## 🔧 Alternative: Deploy via Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Add environment variable
vercel env add VITE_API_URL production
# When prompted, enter: https://interactive-user-relationship-hobby-knqj.onrender.com/api

# Deploy to production
vercel --prod
```

## ⚠️ Common Issues & Fixes

### Issue: "Root Directory not found"
**Fix:** Make sure you set **Root Directory** to `frontend` (not the project root)

### Issue: "Environment Variable not found"
**Fix:** 
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `VITE_API_URL` manually
3. Value: `https://interactive-user-relationship-hobby-knqj.onrender.com/api`
4. Redeploy

### Issue: "Build failed"
**Fix:**
- Check Vercel build logs
- Ensure `package.json` has all dependencies
- Verify root directory is `frontend`

### Issue: "Cannot connect to backend"
**Fix:**
- Verify `VITE_API_URL` is set correctly
- Check backend is running: `https://interactive-user-relationship-hobby-knqj.onrender.com/health`
- Ensure URL ends with `/api` (not just the domain)

## 📝 Environment Variable Format

**Correct:**
```
VITE_API_URL=https://interactive-user-relationship-hobby-knqj.onrender.com/api
```

**Wrong:**
```
VITE_API_URL=https://interactive-user-relationship-hobby-knqj.onrender.com
VITE_API_URL=interactive-user-relationship-hobby-knqj.onrender.com/api
```

## ✅ After Deployment

1. **Test the app:**
   - Visit your Vercel URL
   - Try creating a user
   - Check if graph loads

2. **Update backend CORS (if needed):**
   - Your backend already allows all origins, so this should work
   - If you get CORS errors, check backend logs

3. **Share your app:**
   - Vercel provides a URL like: `https://your-project.vercel.app`
   - You can add a custom domain later if needed

## 🎯 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Repository imported
- [ ] Root directory set to `frontend`
- [ ] Environment variable `VITE_API_URL` added
- [ ] Value: `https://interactive-user-relationship-hobby-knqj.onrender.com/api`
- [ ] Deployed successfully
- [ ] App loads without errors
- [ ] Can create users
- [ ] Graph visualization works

## 🆘 Still Having Issues?

1. **Check Vercel build logs:**
   - Dashboard → Your Project → Deployments → Click latest deployment → View logs

2. **Check browser console:**
   - Open browser DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed API calls

3. **Verify backend:**
   - Test: `https://interactive-user-relationship-hobby-knqj.onrender.com/health`
   - Should return: `{"success":true,"message":"Server is running"}`

4. **Redeploy:**
   - Sometimes a simple redeploy fixes issues
   - Vercel Dashboard → Deployments → Click "..." → Redeploy

---

**Need more help?** Check the main [DEPLOYMENT.md](../DEPLOYMENT.md) guide.

