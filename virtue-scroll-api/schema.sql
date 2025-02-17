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

-- Add test users
INSERT INTO users (id, email, username, display_name, created_at) VALUES 
('u1', 'sarah.tech@example.com', 'sarahcodes', 'Sarah Chen', '2024-01-15'),
('u2', 'alex.writer@example.com', 'alexw', 'Alex Wilson', '2024-01-16'),
('u3', 'maya.design@example.com', 'mayaarts', 'Maya Rodriguez', '2024-01-17'),
('u4', 'jordan.dev@example.com', 'jordandev', 'Jordan Taylor', '2024-01-18'),
('u5', 'sam.smith@example.com', 'samsmith', 'Sam Smith', '2024-01-19'),
('u6', 'zoe.zhang@example.com', 'zoezhang', 'Zoe Zhang', '2024-01-20');

-- Add test virtues
INSERT INTO virtues (id, content, user_id, created_at) VALUES 
-- Sarah's virtues
('v1', 'Just deployed my first React app! The learning curve was worth it. 🚀', 'u1', '2024-02-01 10:15:00'),
('v2', 'TypeScript really does make your code more maintainable. Convert your projects, trust me!', 'u1', '2024-02-03 14:30:00'),
('v3', 'Sunday coding session: building a new portfolio site with Next.js', 'u1', '2024-02-04 16:45:00'),

-- Alex's virtues
('v4', 'Writing clean code is like writing good prose: clarity is everything.', 'u2', '2024-02-01 11:20:00'),
('v5', 'Just finished reading "Clean Code". Game changer for my development practices.', 'u2', '2024-02-02 13:25:00'),
('v6', 'Remember to document your code, future you will thank you!', 'u2', '2024-02-04 09:30:00'),
('v7', 'Code reviews are opportunities to learn, not criticisms.', 'u2', '2024-02-05 15:40:00'),

-- Maya's virtues
('v8', 'UI design tip: consistency in spacing can make or break your layout.', 'u3', '2024-02-02 12:00:00'),
('v9', 'Finally mastered CSS Grid! My layouts will never be the same.', 'u3', '2024-02-03 16:20:00'),
('v10', 'Exploring new color palettes for my latest web project. Design is fun!', 'u3', '2024-02-04 14:15:00'),

-- Jordan's virtues
('v11', 'Docker makes development so much smoother. No more "works on my machine"!', 'u4', '2024-02-01 09:45:00'),
('v12', 'Just gave a tech talk on API design patterns. Love sharing knowledge!', 'u4', '2024-02-03 11:30:00'),
('v13', 'Debugging tip: console.log() is your best friend', 'u4', '2024-02-04 13:50:00'),
('v14', 'Started learning Rust today. Mind = blown 🤯', 'u4', '2024-02-05 17:20:00'),

-- Sam's virtues
('v15', 'Always test your error handling. Always.', 'u5', '2024-02-02 10:40:00'),
('v16', 'Just discovered a new VS Code extension that changed my life!', 'u5', '2024-02-03 15:10:00'),
('v17', 'Code refactoring day. Its like spring cleaning for your codebase.', 'u5', '2024-02-04 12:25:00'),

-- Zoe's virtues
('v18', 'Finally understanding the beauty of functional programming', 'u6', '2024-02-01 13:45:00'),
('v19', 'Remember to take breaks while coding. Your brain needs it!', 'u6', '2024-02-03 10:55:00'),
('v20', 'Just solved a tricky bug that took 3 days. Never give up!', 'u6', '2024-02-04 16:30:00'),
('v21', 'Learning AWS has opened up so many possibilities!', 'u6', '2024-02-05 14:20:00');