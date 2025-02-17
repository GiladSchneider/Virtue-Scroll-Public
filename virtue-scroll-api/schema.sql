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
('u6', 'zoe.zhang@example.com', 'zoezhang', 'Zoe Zhang', '2024-01-20'),
('u7', 'priya.kumar@example.com', 'priyatech', 'Priya Kumar', '2024-01-21'),
('u8', 'david.miller@example.com', 'daviddev', 'David Miller', '2024-01-22'),
('u9', 'emma.brown@example.com', 'emmab', 'Emma Brown', '2024-01-23'),
('u10', 'carlos.garcia@example.com', 'carlosg', 'Carlos Garcia', '2024-01-24'),
('u11', 'nina.patel@example.com', 'ninadev', 'Nina Patel', '2024-01-25'),
('u12', 'marcus.johnson@example.com', 'marcusj', 'Marcus Johnson', '2024-01-26');

-- Add test virtues
INSERT INTO virtues (id, content, user_id, created_at) VALUES 
-- Original virtues
('v1', 'Just deployed my first React app! The learning curve was worth it. 🚀', 'u1', '2024-02-01 10:15:00'),
('v2', 'TypeScript really does make your code more maintainable. Convert your projects, trust me!', 'u1', '2024-02-03 14:30:00'),
('v3', 'Sunday coding session: building a new portfolio site with Next.js', 'u1', '2024-02-04 16:45:00'),
('v4', 'Writing clean code is like writing good prose: clarity is everything.', 'u2', '2024-02-01 11:20:00'),
('v5', 'Just finished reading "Clean Code". Game changer for my development practices.', 'u2', '2024-02-02 13:25:00'),
('v6', 'Remember to document your code, future you will thank you!', 'u2', '2024-02-04 09:30:00'),
('v7', 'Code reviews are opportunities to learn, not criticisms.', 'u2', '2024-02-05 15:40:00'),
('v8', 'UI design tip: consistency in spacing can make or break your layout.', 'u3', '2024-02-02 12:00:00'),
('v9', 'Finally mastered CSS Grid! My layouts will never be the same.', 'u3', '2024-02-03 16:20:00'),
('v10', 'Exploring new color palettes for my latest web project. Design is fun!', 'u3', '2024-02-04 14:15:00'),
('v11', 'Docker makes development so much smoother. No more "works on my machine"!', 'u4', '2024-02-01 09:45:00'),
('v12', 'Just gave a tech talk on API design patterns. Love sharing knowledge!', 'u4', '2024-02-03 11:30:00'),
('v13', 'Debugging tip: console.log() is your best friend', 'u4', '2024-02-04 13:50:00'),
('v14', 'Started learning Rust today. Mind = blown 🤯', 'u4', '2024-02-05 17:20:00'),
('v15', 'Always test your error handling. Always.', 'u5', '2024-02-02 10:40:00'),
('v16', 'Just discovered a new VS Code extension that changed my life!', 'u5', '2024-02-03 15:10:00'),
('v17', 'Code refactoring day. Its like spring cleaning for your codebase.', 'u5', '2024-02-04 12:25:00'),
('v18', 'Finally understanding the beauty of functional programming', 'u6', '2024-02-01 13:45:00'),
('v19', 'Remember to take breaks while coding. Your brain needs it!', 'u6', '2024-02-03 10:55:00'),
('v20', 'Just solved a tricky bug that took 3 days. Never give up!', 'u6', '2024-02-04 16:30:00'),
('v21', 'Learning AWS has opened up so many possibilities!', 'u6', '2024-02-05 14:20:00'),

-- New virtues for existing users
('v22', 'Implemented my first GraphQL API today. The flexibility is amazing!', 'u1', '2024-02-06 09:15:00'),
('v23', 'Pair programming session was super productive. Two minds > one!', 'u2', '2024-02-06 11:30:00'),
('v24', 'Design systems are worth the initial investment. Trust me on this one.', 'u3', '2024-02-06 13:45:00'),
('v25', 'Kubernetes is both amazing and terrifying. Still learning! 😅', 'u4', '2024-02-06 15:20:00'),
('v26', 'TDD changed how I think about code architecture', 'u5', '2024-02-06 16:10:00'),
('v27', 'Made my first open source contribution today! 🎉', 'u6', '2024-02-06 17:30:00'),

-- Virtues for new users
-- Priya's virtues
('v28', 'Machine learning project update: finally got my model accuracy above 95%! 🎯', 'u7', '2024-02-01 09:30:00'),
('v29', 'Python vs R for data science? Why not both? Each has its strengths!', 'u7', '2024-02-03 14:20:00'),
('v30', 'Jupyter notebooks are a game changer for data exploration', 'u7', '2024-02-05 16:45:00'),

-- David's virtues
('v31', 'Mobile-first design isn''t just a buzzword, it''s a necessity', 'u8', '2024-02-02 10:15:00'),
('v32', 'Swift UI is becoming my favorite way to build iOS apps', 'u8', '2024-02-04 11:30:00'),
('v33', 'Accessibility in web design should be a priority, not an afterthought', 'u8', '2024-02-06 13:20:00'),

-- Emma's virtues
('v34', 'Just finished setting up my first CI/CD pipeline! 🔄', 'u9', '2024-02-01 15:45:00'),
('v35', 'Git rebase vs merge? The eternal debate continues...', 'u9', '2024-02-03 12:30:00'),
('v36', 'Automated testing saved our release today!', 'u9', '2024-02-05 14:15:00'),

-- Carlos's virtues
('v37', 'Learning about blockchain development. The potential is huge! 🔗', 'u10', '2024-02-02 09:20:00'),
('v38', 'Smart contracts are fascinating. Building my first DApp!', 'u10', '2024-02-04 11:45:00'),
('v39', 'Web3 development has such a unique set of challenges', 'u10', '2024-02-06 16:30:00'),

-- Nina's virtues
('v40', 'Started learning about microservices architecture today', 'u11', '2024-02-01 13:15:00'),
('v41', 'Redis caching improved our API response time by 70%! 🚀', 'u11', '2024-02-03 15:40:00'),
('v42', 'Exploring event-driven architecture for our next project', 'u11', '2024-02-05 10:25:00'),

-- Marcus's virtues
('v43', 'Tailwind CSS is growing on me. The utility-first approach makes sense now', 'u12', '2024-02-02 14:30:00'),
('v44', 'Three.js is amazing for web-based 3D graphics! Check out my latest demo', 'u12', '2024-02-04 16:20:00'),
('v45', 'WebAssembly is the future of high-performance web apps', 'u12', '2024-02-06 11:15:00');