# Quick Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or Docker)
- npm or yarn

## Step-by-Step Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (copy from `env.example`):
```bash
# On Windows
copy env.example .env

# On macOS/Linux
cp env.example .env
```

Edit `.env` and set your MongoDB connection:
```
PORT=5000
DB_URL=mongodb://localhost:27017/user-network
```

Start MongoDB (if running locally):
```bash
# Option 1: Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Option 2: Local MongoDB service
# Start MongoDB service on your system
```

Start backend:
```bash
npm run dev
```

Backend should be running on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

(Optional) Create `.env` file if backend is on different URL:
```
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

Frontend should be running on `http://localhost:3000`

### 3. Testing

Run backend tests:
```bash
cd backend
npm test
```

## Troubleshooting

**Backend won't start:**
- Check MongoDB is running: `mongosh` or check MongoDB service
- Verify `.env` file exists and has correct `DB_URL`
- Check port 5000 is not in use

**Frontend can't connect:**
- Ensure backend is running first
- Check browser console for CORS errors
- Verify `VITE_API_URL` in frontend `.env` matches backend URL

**Tests failing:**
- Run `npm install` in backend directory
- Ensure MongoDB Memory Server is installed

## First Run

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser to `http://localhost:3000`
4. Click "Create User" to add your first user
5. Drag hobbies from sidebar onto user nodes
6. Drag one node onto another to create friendships

Enjoy! 🎉

