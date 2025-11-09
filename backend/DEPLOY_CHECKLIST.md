# Backend Deployment Checklist

Use this checklist to ensure your backend is properly configured for deployment.

## Pre-Deployment

- [ ] All code committed to GitHub
- [ ] `package.json` has all dependencies
- [ ] `tsconfig.json` is configured correctly
- [ ] `.env` file is NOT committed (in `.gitignore`)
- [ ] Backend builds successfully: `npm run build`
- [ ] Tests pass: `npm test`

## MongoDB Atlas Setup

- [ ] MongoDB Atlas account created
- [ ] Free cluster (M0) created
- [ ] Database user created with username and password
- [ ] IP whitelist includes `0.0.0.0/0` (allows all IPs)
- [ ] Connection string copied and formatted correctly
- [ ] Connection string includes database name: `user-network`
- [ ] Connection string tested locally (optional)

## Render Configuration

- [ ] Render account created
- [ ] GitHub repository connected
- [ ] New Web Service created
- [ ] Root directory set to: `backend`
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Environment variables set:
  - [ ] `NODE_ENV` = `production`
  - [ ] `PORT` = `10000`
  - [ ] `DB_URL` = MongoDB Atlas connection string
- [ ] Service deployed successfully
- [ ] Health check works: `https://your-service.onrender.com/health`

## Post-Deployment

- [ ] Backend URL saved
- [ ] Backend responds to `/health` endpoint
- [ ] Backend responds to `/api/users` endpoint
- [ ] No errors in Render logs
- [ ] MongoDB connection successful (check logs)
- [ ] CORS configured correctly
- [ ] Frontend can connect to backend

## Common Issues

### Build Fails
- Check Render logs for specific error
- Verify all dependencies in `package.json`
- Ensure TypeScript compiles: `npm run build`

### MongoDB Connection Fails
- Verify connection string format
- Check username/password are correct
- Ensure IP whitelist includes Render IPs
- Wait 2-3 minutes after whitelisting

### Service Keeps Restarting
- Check Render logs
- Verify environment variables are set
- Check MongoDB connection string
- Ensure PORT is set correctly

### CORS Errors
- Verify frontend URL is allowed
- Check CORS configuration in `app.ts`
- Ensure `FRONTEND_URL` env var is set (optional)

## Testing Commands

```bash
# Test build locally
cd backend
npm install
npm run build

# Test start command
npm start

# Test MongoDB connection (if local MongoDB)
# Update .env with Atlas connection string
npm run dev
```

## Environment Variables Reference

```env
NODE_ENV=production
PORT=10000
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/user-network?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend.vercel.app  # Optional, for CORS
```

