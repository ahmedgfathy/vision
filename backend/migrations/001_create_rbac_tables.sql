-- Migration: Create RBAC Tables
-- Date: 2025-11-25

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create profile_modules table
CREATE TABLE IF NOT EXISTS profile_modules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    permission_view BOOLEAN DEFAULT FALSE,
    permission_create BOOLEAN DEFAULT FALSE,
    permission_edit BOOLEAN DEFAULT FALSE,
    permission_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_profile_module (profile_id, module_name)
);

-- Create profile_fields table
CREATE TABLE IF NOT EXISTS profile_fields (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    can_view BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_profile_field (profile_id, module_name, field_name)
);

-- Add profile_id column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_id INT DEFAULT NULL AFTER role_id,
ADD CONSTRAINT fk_users_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX idx_profile_modules_profile ON profile_modules(profile_id);
CREATE INDEX idx_profile_modules_module ON profile_modules(module_name);
CREATE INDEX idx_profile_fields_profile ON profile_fields(profile_id);
CREATE INDEX idx_profile_fields_module ON profile_fields(module_name);
CREATE INDEX idx_users_profile ON users(profile_id);
