# Frontend Deployment Checklist

Use this checklist to ensure your frontend is properly configured for Vercel deployment.

## Pre-Deployment

- [ ] All code committed to GitHub
- [ ] `package.json` has all dependencies
- [ ] `vite.config.ts` is configured correctly
- [ ] Frontend builds successfully: `npm run build`
- [ ] No TypeScript errors: `npm run build`
- [ ] Local development works: `npm run dev`

## Vercel Configuration

- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] New project created
- [ ] Root directory set to: `frontend`
- [ ] Framework preset: Vite (auto-detected)
- [ ] Build command: `npm run build` (auto-detected)
- [ ] Output directory: `dist` (auto-detected)
- [ ] Environment variable set:
  - [ ] `VITE_API_URL` = `https://your-backend.onrender.com/api`
- [ ] Project deployed successfully
- [ ] Deployment URL saved

## Post-Deployment

- [ ] Frontend URL accessible
- [ ] No console errors in browser
- [ ] Can create users
- [ ] Graph visualization loads
- [ ] API calls succeed (check Network tab)
- [ ] No CORS errors
- [ ] Toast notifications work

## Testing

1. **Open Frontend URL:**
   - Should load without errors
   - Check browser console (F12)

2. **Test User Creation:**
   - Click "Create User"
   - Fill form and submit
   - Should see success toast

3. **Test Graph:**
   - Users should appear as nodes
   - Can drag nodes
   - Can drag hobbies onto nodes

4. **Test API Connection:**
   - Open Network tab (F12)
   - Check API calls to backend
   - Should see 200 status codes

## Common Issues

### Build Fails
- Check Vercel build logs
- Verify all dependencies in `package.json`
- Ensure TypeScript compiles
- Check for missing environment variables

### Cannot Connect to Backend
- Verify `VITE_API_URL` is set correctly
- Check backend is running
- Ensure backend URL includes `/api`
- Check CORS configuration in backend

### 404 Errors
- Verify `VITE_API_URL` ends with `/api`
- Check backend routes are correct
- Ensure backend is deployed and running

### CORS Errors
- Backend should have CORS enabled
- Check backend allows your Vercel domain
- Verify `FRONTEND_URL` in backend env vars (optional)

## Environment Variables

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

**Important:** 
- Must start with `https://` (not `http://`)
- Must end with `/api`
- No trailing slash after `/api`

## Testing Locally with Production Backend

```bash
# In frontend directory
# Create .env.local file
echo "VITE_API_URL=https://your-backend.onrender.com/api" > .env.local

# Run dev server
npm run dev
```

## Quick Fixes

**Rebuild after env var changes:**
- Go to Vercel dashboard
- Click "Redeploy" → "Redeploy" (latest deployment)

**Clear cache:**
- Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or clear browser cache

**Check backend:**
- Visit: `https://your-backend.onrender.com/health`
- Should return: `{"success":true,"message":"Server is running"}`

