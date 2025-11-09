# Interactive User Relationship & Hobby Network

A full-stack application for managing user relationships and hobbies, visualized as an interactive network graph using React Flow.

## 🌟 Features

- **User Management**: Create, update, and delete users with username, age, and hobbies
- **Relationship Visualization**: Interactive graph showing users as nodes and friendships as edges
- **Popularity Scoring**: Automatic calculation based on number of friends and shared hobbies
- **Drag & Drop**:
  - Link users by dragging one node onto another
  - Add hobbies to users by dragging from sidebar
- **Live Updates**: Real-time graph refresh when data changes
- **Custom Node Types**: High-score nodes (popularity > 5) and low-score nodes with different visual styles

## 🛠 Tech Stack

### Backend

- Node.js + Express + TypeScript
- MongoDB with Mongoose
- Jest + Supertest for testing
- Dotenv for configuration

### Frontend

- React + TypeScript + Vite
- React Flow Renderer for graph visualization
- Axios for API calls
- React Query for data synchronization
- React Hot Toast for notifications
- Tailwind CSS for styling

## 📁 Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── config/db.ts
│   │   ├── models/User.ts
│   │   ├── controllers/userController.ts
│   │   ├── routes/userRoutes.ts
│   │   ├── utils/scoreUtils.ts
│   │   └── middleware/errorHandler.ts
│   ├── tests/
│   │   └── userLogic.test.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GraphView.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── UserPanel.tsx
│   │   │   └── nodes/
│   │   │       ├── HighScoreNode.tsx
│   │   │       └── LowScoreNode.tsx
│   │   ├── api/api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or remote instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```bash
PORT=5000
DB_URL=mongodb://localhost:27017/user-network
```

4. Start MongoDB (if running locally):

```bash
# On macOS/Linux with Homebrew
brew services start mongodb-community

# On Windows, start MongoDB service
# Or use Docker:
docker run -d -p 27017:27017 --name mongodb mongo
```

5. Run the development server:

```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (optional, defaults to localhost:5000):

```bash
VITE_API_URL=http://localhost:5000/api
```

4. Run the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🧪 Testing

### Backend Tests

Run tests from the backend directory:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Test coverage includes:

- Popularity score calculation
- Friendship creation and conflict prevention
- Deletion prevention when user has friends

## 📡 API Endpoints

### Users

| Method | Endpoint           | Description                      |
| ------ | ------------------ | -------------------------------- |
| GET    | `/api/users`     | Get all users                    |
| GET    | `/api/users/:id` | Get user by ID                   |
| POST   | `/api/users`     | Create new user                  |
| PUT    | `/api/users/:id` | Update user                      |
| DELETE | `/api/users/:id` | Delete user (only if no friends) |

### Relationships

| Method | Endpoint                  | Description       |
| ------ | ------------------------- | ----------------- |
| POST   | `/api/users/:id/link`   | Create friendship |
| DELETE | `/api/users/:id/unlink` | Remove friendship |

### Graph Data

| Method | Endpoint       | Description                        |
| ------ | -------------- | ---------------------------------- |
| GET    | `/api/graph` | Get nodes and edges for React Flow |

### Request/Response Examples

**Create User:**

```json
POST /api/users
{
  "username": "John Doe",
  "age": 25,
  "hobbies": ["reading", "coding"]
}
```

**Link Users:**

```json
POST /api/users/{userId}/link
{
  "friendId": "anotherUserId"
}
```

## 🎯 Popularity Score Formula

The popularity score is calculated as:

```
popularityScore = numUniqueFriends + (sharedHobbies * 0.5)
```

Where:

- `numUniqueFriends`: Number of unique friends
- `sharedHobbies`: Number of hobbies shared with at least one friend

## 🎨 UI Features

- **Graph View**: Interactive visualization with zoom, pan, and minimap
- **Sidebar**:
  - Draggable hobby chips
  - Search/filter hobbies
  - User list with quick selection
- **User Panel**:
  - Create/edit user form
  - Add/remove hobbies
  - Delete user (with confirmation)
- **Node Types**:
  - **High Score Node**: Large, glowing blue nodes for popularity > 5
  - **Low Score Node**: Smaller, gray nodes for popularity ≤ 5

## 🚢 Deployment

1. **Backend (Render): https://interactive-user-relationship-hobby-knqj.onrender.com**
2. **Frontend (Vercel): https://interactive-user-relationship-hobby-five.vercel.app**

## 🐳 Docker (Optional)`docker-compose.yml` file is included for local development with MongoDB:

```bash
docker-compose up -d
```

## 📝 Notes

- Users cannot be deleted if they have active friendships
- Friendships are bidirectional (A ↔ B)
- Circular friendships are prevented (only one link between two users)
- Popularity scores are automatically recalculated when:
  - Friendships are added/removed
  - User hobbies are updated
- Graph refreshes every 2 seconds for live updates

## 🐛 Troubleshooting

**Backend won't start:**

- Check if MongoDB is running
- Verify `DB_URL` in `.env` is correct
- Check if port 5000 is available

**Frontend can't connect to backend:**

- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS is enabled in backend

**Tests failing:**

- Make sure MongoDB Memory Server dependencies are installed
- Run `npm install` in backend directory

## 👥 Contributing

This is a development assignment project. Feel free to extend and improve!
