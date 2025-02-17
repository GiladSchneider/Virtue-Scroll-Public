# Virtue Scroll

https://www.virtuescroll.com

A Twitter-like social platform built with modern web technologies, demonstrating full-stack development capabilities using React and Cloudflare's edge infrastructure.

## Tech Stack

### Frontend

- React 18 with TypeScript
- Vite for build tooling
- Material-UI (MUI) for UI components
- Auth0 for authentication
- React Router for client-side routing

### Backend

- Cloudflare Workers (Edge computing)
- Cloudflare D1 (SQLite database at the edge)
- Cloudflare Pages for hosting

## Core Features

- Real-time stream of user posts ("Virtues")
- User authentication and profile management
- Individual post views
- User profiles with post history
- Responsive design optimized for mobile and desktop

## Architecture

### Database Schema

```sql
-- Users table
CREATE TABLE users (
 id TEXT PRIMARY KEY,
 email TEXT UNIQUE NOT NULL,
 username TEXT UNIQUE NOT NULL,
 display_name TEXT NOT NULL,
 avatar_url TEXT,
 created_at TEXT NOT NULL
);

-- Virtues table
CREATE TABLE virtues (
 id TEXT PRIMARY KEY,
 content TEXT NOT NULL,
 user_id TEXT NOT NULL,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### API Endpoints

- `GET /api/virtues` - Fetch recent virtues
- `GET /api/users/:username/virtues` - Fetch user's virtues
- `GET /api/virtues/:id` - Fetch specific virtue
- `POST /api/virtues` - Create new virtue
- `POST /api/users` - Create/update user
- `GET /api/users/:id` - Fetch user details

### Frontend Routes

- `/` - Home feed
- `/profile/:username` - User profile view
- `/virtue/:virtueId` - Individual virtue view
- `/me` - Current user's profile

## Implementation Details

### Authentication Flow

- Auth0 handles user authentication
- JWT tokens validated at the edge using Cloudflare Workers
- Protected routes require valid authentication

### Performance Optimizations

- Edge computing for reduced latency
- SQLite at the edge via D1
- React component lazy loading
- Optimistic UI updates
- Infinite scroll implementation

### Security Features

- CORS policy enforcement
- JWT validation at the edge
- SQL injection prevention
- XSS protection via React
- Rate limiting implemented in Workers

## Learning Outcomes

- Edge computing architecture
- Full-stack TypeScript development
- Auth0 integration
- MUI component system
- Cloudflare Workers ecosystem
