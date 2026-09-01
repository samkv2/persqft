-- PERSQFT CONSTRUCTIONS — MYSQL DATABASE SCHEMA
-- InfinityFree Compatible MySQL Setup

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `enquiry_files`;
DROP TABLE IF EXISTS `enquiries`;
DROP TABLE IF EXISTS `project_media`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `admins`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `location` VARCHAR(255) NOT NULL,
  `category` ENUM('Residential', 'Commercial', 'Architecture', 'Interior', 'Turnkey') NOT NULL DEFAULT 'Residential',
  `status` ENUM('ONGOING', 'COMPLETED') NOT NULL DEFAULT 'ONGOING',
  `progress` INT NOT NULL DEFAULT 0,
  `description` TEXT,
  `start_date` DATE DEFAULT NULL,
  `expected_completion` DATE DEFAULT NULL,
  `completion_date` DATE DEFAULT NULL,
  `cover_image` VARCHAR(500) DEFAULT NULL,
  `published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Project Media Gallery Table
CREATE TABLE IF NOT EXISTS `project_media` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `file_type` VARCHAR(50) DEFAULT 'image',
  `sort_order` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Enquiries Table
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `project_type` VARCHAR(100) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `budget` VARCHAR(100) DEFAULT NULL,
  `message` TEXT,
  `status` ENUM('NEW', 'CONTACTED', 'IN PROGRESS', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'NEW',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Enquiry Attachment Files Table
CREATE TABLE IF NOT EXISTS `enquiry_files` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `enquiry_id` INT NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(50) DEFAULT 'document',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`enquiry_id`) REFERENCES `enquiries`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEED INITIAL ADMIN USER
-- Default Email: admin@persqftconstructions.com
-- Default Pass: PersqftAdmin2026!
INSERT INTO `admins` (`email`, `password_hash`) 
VALUES ('admin@persqftconstructions.com', '$2y$10$7vN3P5GqHn3G7A/a5HkR2eX5N4O0Y/F1Y2e5e1F5e1F5e1F5e1F5e')
ON DUPLICATE KEY UPDATE `email`=`email`;
