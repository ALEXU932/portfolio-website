-- ============================================
-- Portfolio Website Database Schema
-- ============================================
-- This script creates the complete database structure
-- for the portfolio website with all required tables
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS portfolio;
USE portfolio;

-- ============================================
-- 1. ADMINS TABLE
-- ============================================
-- Stores admin user credentials and settings
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  notification_email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. CONTACTS TABLE
-- ============================================
-- Stores contact form submissions with attachments support
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
  admin_response TEXT,
  attachments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. PROJECTS TABLE
-- ============================================
-- Stores portfolio projects with links and images
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  technologies VARCHAR(255),
  github_url VARCHAR(255),
  live_url VARCHAR(255),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. IMAGES TABLE
-- ============================================
-- Stores uploaded images metadata
CREATE TABLE IF NOT EXISTS images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_created_at (created_at),
  INDEX idx_filename (filename)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. INSERT DEFAULT ADMIN ACCOUNT
-- ============================================
-- Default credentials:
-- Username: admin
-- Password: Admin123!
-- Email: admin@portfolio.com
-- 
-- ⚠️  IMPORTANT: Change these credentials after first login!
-- ⚠️  The password is hashed using bcrypt (10 rounds)
-- ============================================

INSERT INTO admins (username, email, password, notification_email)
SELECT 'admin', 'admin@portfolio.com', '$2b$10$7jIcThaufX9ejeGBAANEQ.2xbYJlp880k23z0GOvamqOHFT29xU.i', 'admin@portfolio.com'
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin');

-- Note: The above password hash is for 'Admin123!'
-- To generate a new hash, use bcrypt with 10 rounds
-- Or use the setup-admin.js script to create a custom admin

-- ============================================
-- 6. SAMPLE DATA (OPTIONAL)
-- ============================================
-- Uncomment the following sections to insert sample data

-- Sample Projects
-- INSERT INTO projects (title, description, technologies, github_url, live_url, image_url) VALUES
-- ('Portfolio Website', 'A modern portfolio website with admin panel', 'HTML, CSS, JavaScript, Node.js, MySQL', 'https://github.com/username/portfolio', 'https://portfolio.com', '/images/portfolio.jpg'),
-- ('E-Learning Platform', 'Online learning management system', 'React, Node.js, MongoDB', 'https://github.com/username/elearning', NULL, '/images/e-Learning.jpg');

-- ============================================
-- 7. DATABASE VERIFICATION
-- ============================================
-- Run these queries to verify the setup:
-- 
-- SELECT * FROM admins;
-- SELECT COUNT(*) as total_contacts FROM contacts;
-- SELECT COUNT(*) as total_projects FROM projects;
-- SELECT COUNT(*) as total_images FROM images;
-- SHOW TABLES;
-- 
-- ============================================

-- Display success message
SELECT 
  '✅ Database setup completed successfully!' as Status,
  'Database: portfolio' as Database_Name,
  '4 tables created' as Tables,
  'Default admin created' as Admin_Status,
  'Username: admin' as Default_Username,
  'Password: Admin123!' as Default_Password,
  '⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!' as Security_Warning;