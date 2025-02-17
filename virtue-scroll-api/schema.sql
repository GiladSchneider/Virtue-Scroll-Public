-- Drop existing tables if they exist
DROP TABLE IF EXISTS virtues;
DROP TABLE IF EXISTS users;

-- Create users table
  CREATE TABLE users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      avatar_url TEXT,
      created_at TEXT NOT NULL
  );

-- Create virtues table with foreign key inline
CREATE TABLE virtues (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes
CREATE INDEX idx_virtues_user_id ON virtues(user_id);
CREATE INDEX idx_virtues_created_at ON virtues(created_at);
CREATE INDEX idx_users_username ON users(username);