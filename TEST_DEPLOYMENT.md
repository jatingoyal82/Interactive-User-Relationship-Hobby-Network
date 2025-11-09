# Testing Your Deployment

## ✅ Your Backend is Live!

**URL:** `https://interactive-user-relationship-hobby-knqj.onrender.com`

## 🧪 Test Endpoints

### 1. Health Check
```bash
# In browser or terminal:
https://interactive-user-relationship-hobby-knqj.onrender.com/health
```
**Expected:** `{"success":true,"message":"Server is running"}`

### 2. Get All Users
```bash
https://interactive-user-relationship-hobby-knqj.onrender.com/api/users
```
**Expected:** `{"success":true,"data":[]}` (empty array initially)

### 3. Create a User (POST)
```bash
# Use Postman, curl, or browser console:
POST https://interactive-user-relationship-hobby-knqj.onrender.com/api/users
Content-Type: application/json

{
  "username": "TestUser",
  "age": 25,
  "hobbies": ["coding", "reading"]
}
```

### 4. Get Graph Data
```bash
https://interactive-user-relationship-hobby-knqj.onrender.com/api/graph
```
**Expected:** `{"success":true,"data":{"nodes":[],"edges":[]}}`

## 🌐 Test in Browser Console

Open browser console (F12) and run:

```javascript
// Test health endpoint
fetch('https://interactive-user-relationship-hobby-knqj.onrender.com/health')
  .then(r => r.json())
  .then(console.log);

// Test users endpoint
fetch('https://interactive-user-relationship-hobby-knqj.onrender.com/api/users')
  .then(r => r.json())
  .then(console.log);

// Create a user
fetch('https://interactive-user-relationship-hobby-knqj.onrender.com/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'TestUser',
    age: 25,
    hobbies: ['coding']
  })
})
  .then(r => r.json())
  .then(console.log);
```

## ✅ Next Step: Deploy Frontend

Now that your backend is working, deploy the frontend on Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory: `frontend`
4. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://interactive-user-relationship-hobby-knqj.onrender.com/api`
5. Deploy!

## 📝 About the 404 Errors

The 404 errors you see in logs are **completely normal**:
- `/` - No route defined (use `/health` instead)
- `/favicon.ico` - Browser automatically requests this
- `/api` - Needs specific endpoint like `/api/users`

These don't affect functionality. Your API endpoints work fine!

