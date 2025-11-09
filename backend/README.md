# User Network Backend API

Backend API for the Interactive User Relationship & Hobby Network application.

## Setup

1. Install dependencies:

```bash
npm install
```

2.

Update `.env` with your MongoDB connection string.

4. Make sure MongoDB is running locally or update `DB_URL` to your MongoDB instance.

## Development

Run the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or the PORT specified in `.env`).

## Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## API Endpoints

### Users

- `GET /api/users` - Fetch all users
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user (only if no friends)

### Relationships

- `POST /api/users/:id/link` - Create friendship between two users
- `DELETE /api/users/:id/unlink` - Remove friendship between two users

### Graph Data

- `GET /api/graph` - Get nodes and edges for React Flow visualization

## Popularity Score

The popularity score is calculated as:

```
popularityScore = numUniqueFriends + (sharedHobbies * 0.5)
```

## Error Codes

- `400` - Validation error
- `404` - User not found
- `409` - Relationship conflict (e.g., friendship already exists)
- `500` - Internal server error

## Deployment

This backend is ready for deployment on Render. Make sure to:

1. Set environment variables in Render dashboard
2. Update `DB_URL` to your production MongoDB instance
3. Build and start commands are configured in `package.json`
