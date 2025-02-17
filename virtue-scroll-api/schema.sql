-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create virtues table
CREATE TABLE virtues (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create some indexes
CREATE INDEX idx_virtues_user_id ON virtues(user_id);
CREATE INDEX idx_virtues_created_at ON virtues(created_at);
CREATE INDEX idx_users_username ON users(username);