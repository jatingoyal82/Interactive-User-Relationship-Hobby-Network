# Quick Deployment Guide

Follow these steps to deploy your full-stack application.

## Step 1: Set Up MongoDB Atlas (Database)

1. **Create Account:**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose **FREE** (M0) tier
   - Select a cloud provider and region (choose closest to you)
   - Click "Create"

3. **Create Database User:**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `admin` (or your choice)
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

4. **Whitelist IP Addresses:**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (adds `0.0.0.0/0`)
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Click "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - **Replace `<username>` and `<password>`** with your database user credentials
   - **Add database name** at the end: `?retryWrites=true&w=majority` → `?retryWrites=true&w=majority` becomes `?retryWrites=true&w=majority&appName=Cluster0`
   - Better format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/user-network?retryWrites=true&w=majority`
   - **SAVE THIS STRING** - you'll need it for Render

## Step 2: Deploy Backend on Render

1. **Create Account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub (recommended)

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service:**
   - **Name:** `user-network-backend` (or your choice)
   - **Region:** Choose closest to you
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (or choose paid)

4. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   Add these:
   - **Key:** `NODE_ENV` → **Value:** `production`
   - **Key:** `PORT` → **Value:** `10000` (Render auto-assigns, but this is fallback)
   - **Key:** `DB_URL` → **Value:** Your MongoDB Atlas connection string from Step 1
     - Example: `mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/user-network?retryWrites=true&w=majority`

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for build to complete (2-5 minutes)
   - Note the URL: `https://user-network-backend.onrender.com` (or similar)
   - **Test it:** Visit `https://your-backend-url.onrender.com/health`
   - Should see: `{"success":true,"message":"Server is running"}`

## Step 3: Deploy Frontend on Vercel

1. **Create Account:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project:**
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Project:**
   - **Framework Preset:** Vite (auto-detected)
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Add Environment Variable:**
   - Go to "Environment Variables"
   - Click "Add"
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.onrender.com/api`
     - Replace `your-backend-url` with your actual Render backend URL
     - Example: `https://user-network-backend.onrender.com/api`

5. **Deploy:**
   - Click "Deploy"
   - Wait for build (1-2 minutes)
   - Vercel will provide a URL like: `https://your-project.vercel.app`

## Step 4: Test Everything

1. **Test Backend:**
   - Visit: `https://your-backend.onrender.com/health`
   - Should return: `{"success":true,"message":"Server is running"}`

2. **Test Frontend:**
   - Visit your Vercel URL
   - Open browser console (F12)
   - Check for any errors
   - Try creating a user

3. **Test API Connection:**
   - In browser console, check Network tab
   - Look for API calls to your backend
   - Should see successful requests

## Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB":**
- Check MongoDB Atlas connection string is correct
- Verify username/password in connection string
- Check IP whitelist includes `0.0.0.0/0`
- Wait 2-3 minutes after whitelisting IP

**"Build failed":**
- Check Render logs
- Ensure `package.json` has all dependencies
- Verify TypeScript compiles: `cd backend && npm run build`

**"Service keeps restarting":**
- Check Render logs for errors
- Verify `DB_URL` is set correctly
- Check MongoDB connection string format

### Frontend Issues

**"Cannot connect to backend":**
- Verify `VITE_API_URL` in Vercel matches backend URL
- Check backend is running (visit `/health` endpoint)
- Check CORS is enabled (already configured in backend)
- Rebuild frontend after changing env vars

**"404 errors":**
- Ensure `VITE_API_URL` ends with `/api`
- Check backend routes are correct

**"CORS errors":**
- Backend already has CORS enabled
- If issues persist, check Render logs

## Quick Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] IP whitelist set to `0.0.0.0/0`
- [ ] Connection string saved
- [ ] Backend deployed on Render
- [ ] Backend environment variables set
- [ ] Backend health check works
- [ ] Frontend deployed on Vercel
- [ ] Frontend `VITE_API_URL` set to backend URL
- [ ] Frontend can create users
- [ ] Graph visualization works

## URLs to Save

- **MongoDB Atlas Dashboard:** https://cloud.mongodb.com
- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Backend URL:** `https://your-backend.onrender.com`
- **Frontend URL:** `https://your-project.vercel.app`

## Need More Help?

- Check `DEPLOYMENT.md` for detailed instructions
- Check Render logs: Dashboard → Your Service → Logs
- Check Vercel logs: Dashboard → Your Project → Deployments → View Function Logs
- MongoDB Atlas logs: Dashboard → Your Cluster → Metrics

