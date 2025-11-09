# Deployment Guide

This guide covers deploying the Interactive User Relationship & Hobby Network application.

## Architecture

- **Frontend**: Deploy on Vercel
- **Backend**: Deploy on Render (or Railway/Heroku)
- **Database**: MongoDB Atlas (recommended) or MongoDB on Render

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository with your code

### Steps

1. **Prepare the frontend:**
   ```bash
   cd frontend
   npm install
   npm run build  # Test build locally
   ```

2. **Deploy via Vercel CLI:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy (from frontend directory)
   cd frontend
   vercel
   ```

3. **Or deploy via Vercel Dashboard:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Set **Root Directory** to `frontend`
   - Configure:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

4. **Set Environment Variables:**
   - In Vercel project settings, go to "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
   - Replace with your actual backend URL

5. **Redeploy** after adding environment variables

### Vercel Configuration

The `vercel.json` file is already configured. If you need to customize:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## Backend Deployment (Render)

### Prerequisites
- Render account (sign up at [render.com](https://render.com))
- MongoDB Atlas account (recommended) or MongoDB instance

### Steps

1. **Set up MongoDB Atlas (Recommended):**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string
   - Whitelist IP `0.0.0.0/0` for Render access

2. **Deploy Backend on Render:**
   - Go to [render.com/dashboard](https://render.com/dashboard)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `user-network-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Plan**: Free (or paid)

3. **Set Environment Variables in Render:**
   - Go to your service → "Environment"
   - Add:
     - `PORT`: `10000` (Render assigns port automatically, but this is a fallback)
     - `DB_URL`: Your MongoDB Atlas connection string
     - `NODE_ENV`: `production`

4. **Get Backend URL:**
   - Render provides a URL like: `https://user-network-backend.onrender.com`
   - Update frontend `VITE_API_URL` with this URL + `/api`

### Alternative: Railway Deployment

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables:
   - `DB_URL`: Your MongoDB connection string
   - `PORT`: Railway auto-assigns

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create database user
4. Whitelist IP addresses (add `0.0.0.0/0` for Render)
5. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/user-network?retryWrites=true&w=majority
   ```

### Local MongoDB (Development Only)

For local development, use Docker:
```bash
docker-compose up -d
```

## Post-Deployment Checklist

- [ ] Backend is accessible at `https://your-backend.onrender.com/health`
- [ ] Frontend environment variable `VITE_API_URL` points to backend
- [ ] CORS is enabled in backend (already configured)
- [ ] MongoDB connection is working
- [ ] Test creating a user from frontend
- [ ] Test graph visualization loads

## Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` in Vercel environment variables
- Verify backend URL is correct (include `/api` if needed)
- Check browser console for CORS errors
- Ensure backend CORS allows your Vercel domain

### Backend connection issues
- Verify MongoDB connection string is correct
- Check MongoDB Atlas IP whitelist includes Render IPs
- Check Render logs for errors
- Verify environment variables are set correctly

### Build failures
- Check Node.js version compatibility
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel/Render dashboard

## Environment Variables Summary

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend (Render)
```
PORT=10000
DB_URL=mongodb+srv://user:pass@cluster.mongodb.net/user-network
NODE_ENV=production
```

## Custom Domain (Optional)

### Vercel Custom Domain
1. Go to project settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

### Render Custom Domain
1. Go to service settings → Custom Domains
2. Add your domain
3. Update DNS records as instructed

## Monitoring

- **Vercel**: Check deployment logs and analytics in dashboard
- **Render**: Monitor logs and metrics in service dashboard
- **MongoDB Atlas**: Monitor database performance and usage

## Cost Estimate

- **Vercel**: Free tier (hobby) - sufficient for most projects
- **Render**: Free tier available (spins down after inactivity)
- **MongoDB Atlas**: Free M0 tier (512MB storage)

For production with high traffic, consider paid tiers.

