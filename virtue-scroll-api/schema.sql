-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create virtues table (equivalent to tweets)
CREATE TABLE IF NOT EXISTS virtues (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    like_count INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create likes table to track user interactions
CREATE TABLE IF NOT EXISTS virtue_likes (
    virtue_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (virtue_id, user_id),
    FOREIGN KEY (virtue_id) REFERENCES virtues(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add some initial test data
INSERT INTO users (id, username, display_name, avatar_url) VALUES
    ('user1', 'johndoe', 'John Doe', NULL),
    ('user2', 'janedoe', 'Jane Doe', NULL);

INSERT INTO virtues (id, content, user_id) VALUES
    ('virtue1', 'Hello world! This is my first Virtue!', 'user1'),
    ('virtue2', 'Excited to join Virtue Scroll!', 'user2'),
    ('virtue3', 'Building great things with Cloudflare and React!', 'user1');