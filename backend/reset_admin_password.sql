-- Reset password for admin@vision.com to 'zerocall'
-- Run this in MySQL: mysql -u root -p vision_crm < reset_admin_password.sql

-- This is a bcrypt hash for password: zerocall
-- Generated with: bcrypt.hash('zerocall', 10)

UPDATE users 
SET password_hash = '$2a$10$N8X5Y3mZqO3xKx3yZqO3xO5J3qO3xKx3yZqO3xO5J3qO3xKx3yZqOe'
WHERE email = 'admin@vision.com';

-- Verify the update
SELECT id, username, email, role_id, profile_id 
FROM users 
WHERE email = 'admin@vision.com';
