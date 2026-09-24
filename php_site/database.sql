-- ==========================================================
-- PERSQFT CONSTRUCTIONS — MYSQL / MARIADB DATABASE SCHEMA
-- Compatible with cPanel, phpMyAdmin, MySQL 5.7+, 8.0+, MariaDB 10+
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `enquiry_files`;
DROP TABLE IF EXISTS `enquiries`;
DROP TABLE IF EXISTS `team_members`;
DROP TABLE IF EXISTS `project_media`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `site_settings`;
DROP TABLE IF EXISTS `admins`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `role` VARCHAR(50) NOT NULL DEFAULT 'Data Entry Admin',
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Site Settings & Stats Counter Table
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `company_name` VARCHAR(191) NOT NULL DEFAULT 'PERSQFT CONSTRUCTIONS',
  `tagline` VARCHAR(255) NOT NULL DEFAULT 'Transforming Quality, Defining Construction',
  `phone` VARCHAR(50) NOT NULL DEFAULT '+91-6306659601',
  `email` VARCHAR(191) NOT NULL DEFAULT 'contact@persqft.com',
  `address` TEXT NOT NULL,
  `experience_years` INT NOT NULL DEFAULT 10,
  `projects_executed` INT NOT NULL DEFAULT 150,
  `locations_covered` INT NOT NULL DEFAULT 25,
  `on_time_delivery_percent` INT NOT NULL DEFAULT 100,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `category` ENUM('Residential', 'Commercial', 'Architecture', 'Interior', 'Turnkey') NOT NULL DEFAULT 'Residential',
  `location` VARCHAR(255) NOT NULL,
  `client` VARCHAR(255) DEFAULT 'Private Client',
  `area` VARCHAR(50) NOT NULL,
  `year` INT NOT NULL DEFAULT 2026,
  `status` ENUM('ONGOING', 'COMPLETED') NOT NULL DEFAULT 'ONGOING',
  `progress` INT NOT NULL DEFAULT 100,
  `cover_image` VARCHAR(500) NOT NULL,
  `gallery` TEXT, -- JSON array of image URLs
  `features` TEXT, -- JSON array of feature strings
  `short_description` TEXT,
  `description` TEXT NOT NULL,
  `sort_order` INT DEFAULT 0,
  `published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Team Members Table
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `role` VARCHAR(150) NOT NULL,
  `category` ENUM('MANAGEMENT', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
  `image` VARCHAR(500) NOT NULL,
  `highlight_badge` VARCHAR(100) DEFAULT NULL,
  `tagline` TEXT DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Enquiries Table
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reference_id` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `service_required` VARCHAR(100) NOT NULL,
  `area_sqft` VARCHAR(50) NOT NULL,
  `project_note` TEXT,
  `attachment_url` VARCHAR(500) DEFAULT NULL,
  `status` ENUM('PENDING', 'REVIEWED', 'CONTACTED', 'CLOSED') NOT NULL DEFAULT 'PENDING',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Services Table (Dedicated Isolated CMS Table)
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `tagline` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Design',
  `short_description` TEXT NOT NULL,
  `description` MEDIUMTEXT DEFAULT NULL,
  `image` VARCHAR(500) NOT NULL,
  `gallery` MEDIUMTEXT DEFAULT NULL, -- JSON array of image URLs
  `icon_name` VARCHAR(50) DEFAULT 'home',
  `brochure_pdf` VARCHAR(500) DEFAULT NULL,
  `brochure_title` VARCHAR(255) DEFAULT 'Comprehensive Service Dossier & Technical Specs',
  `deliverables` VARCHAR(255) DEFAULT NULL,
  `timeline` VARCHAR(100) DEFAULT NULL,
  `inclusions` TEXT DEFAULT NULL, -- JSON array of scope items
  `badge` VARCHAR(50) DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SEED INITIAL DATA
-- ==========================================================

-- 1. Default Admin (Password: PersqftAdmin2026!)
INSERT INTO `admins` (`id`, `username`, `email`, `role`, `password_hash`) VALUES
(1, 'PERSQFT HEAD/CEO', 'admin@persqft.com', 'PERSQFT HEAD/CEO', '$2y$12$oDuItwgtivt5uXbJMRPe2uhUSKEOCvYhI.LMt1C8LqY1yFPl71gJm');

-- 2. Site Settings
INSERT INTO `site_settings` (`id`, `company_name`, `tagline`, `phone`, `email`, `address`, `experience_years`, `projects_executed`, `locations_covered`, `on_time_delivery_percent`) VALUES
(1, 'PERSQFT CONSTRUCTIONS', 'Architectural Excellence & Structural Precision', '+91-6306659601', 'contact@persqft.com', 'Shop No.2, Ramashankar Market, Beside Baba Telecom, Busstand Road, Sultanpur, Uttar Pradesh, 228001', 10, 150, 25, 100);

-- 3. Projects Seed Data
INSERT INTO `projects` (`id`, `slug`, `title`, `category`, `location`, `client`, `area`, `year`, `status`, `progress`, `cover_image`, `gallery`, `features`, `short_description`, `description`, `sort_order`, `published`) VALUES
(1, 'skyline-pinnacle-tower', 'Skyline Pinnacle Commercial Tower', 'Commercial', 'Gomti Nagar Extension, Lucknow', 'Apex Global Enterprises', '125,000 SQFT', 2026, 'ONGOING', 78, 
 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1600&auto=format&fit=crop',
 '["https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"]',
 '["Post-Tensioned Structural Concrete Core","Double-Glazed Low-E Architectural Curtain Wall","BREEAM Gold Sustainable Energy Efficiency","Automated Building Management System (BMS)","High-Speed Regenerative Elevator Core"]',
 '18-storey ultra-modern commercial high-rise with earthquake-resistant post-tensioned slab superstructure.',
 'Skyline Pinnacle Commercial Tower represents a milestone in modern commercial execution. Designed with structural integrity at its core, this 18-storey commercial landmark features high-performance glass curtain facades, custom seismic dampers, integrated HVAC tunnels, and 4 subterranean parking levels.',
 1, 1),

(2, 'the-glasshouse-estate', 'The Glasshouse Modern Estate', 'Residential', 'Golf City, Lucknow', 'Private Luxury Residence', '18,500 SQFT', 2025, 'COMPLETED', 100,
 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
 '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"]',
 '["12m Suspended Structural Steel Cantilever","Off-Form Architectural Board-Marked Concrete","Full-Height Floor-to-Ceiling Motorized Glazing","Geothermal Hydronic Radiant Floor System","Custom Millwork & Italian Travertine Finishes"]',
 'High-end cantilevered minimalist residence crafted with exposed architectural concrete, steel, and thermal glass.',
 'An architectural marvel blending seamless indoor-outdoor living with structural audacity. The Glasshouse Estate features a dramatic 12-meter cantilevered upper deck suspended over an infinity reflection pool, precision-engineered thermal insulation, and custom smart automation throughout.',
 2, 1),

(3, 'aethelgard-tech-park', 'Aethelgard Innovation Tech Park', 'Turnkey', 'IT City, Lucknow', 'Aethelgard Infrastructure Ltd.', '210,000 SQFT', 2026, 'ONGOING', 64,
 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop',
 '["https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop"]',
 '["Turnkey Project Delivery in 14 Months","Heavy Structural Prefabricated Steel Truss Work","Solar Photovoltaic Integrated Canopy","Acoustic Damping Slab Insulation","Integrated Fiber & Power Trench Grids"]',
 'Turnkey multi-tenant technology campus with smart energy micro-grid and prefabricated modular steel frameworks.',
 'Built for fast-track delivery, Aethelgard Tech Park integrates state-of-the-art off-site steel fabrication with structural modular construction. The campus accommodates 4,000 tech professionals with zero carbon-footprint design directives.',
 3, 1),

(4, 'vanguard-penthouse-villa', 'Vanguard Villa & Duplex Residence', 'Architecture', 'Civil Lines, Lucknow', 'Private Client', '14,200 SQFT', 2025, 'COMPLETED', 100,
 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop',
 '["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop"]',
 '["Perforated Dynamic Laser-Cut Facade Louvers","Subterranean Humidity-Controlled Vault & Lounge","Double-Height Architectural Atrium with Skylight","Floating Monolithic Steel-Spine Staircase","Integrated Smart Home Automation with KNX"]',
 'Contemporary sculptural residence with perforated copper facade screens and subterranean private gallery.',
 'Vanguard Villa redefines luxury residential living through tactile materials and dramatic geometric volumes. Featuring double-height light wells, passive cooling cross-ventilation shafts, and bespoke metalwork crafted on-site.',
 4, 1),

(5, 'atelier-luxury-interior', 'Atelier Corporate HQ Interiors', 'Interior', 'Vibhuti Khand, Lucknow', 'Nexus Financial Group', '32,000 SQFT', 2026, 'COMPLETED', 100,
 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
 '["https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop"]',
 '["Custom Acoustic Slatted Timber Paneling","Recessed Architectural Linear Diffusers","Bespoke Statuario Marble Reception Monolith","Smart Circadian Lighting Systems","Sound-Isolated Executive Boardroom Chambers"]',
 'Ultra-luxury corporate interior fit-out marrying fluted acoustic wall paneling with brushed brass accents.',
 'A comprehensive corporate workplace fit-out engineered for productivity and refined visual prestige. Features specialized acoustic baffling, custom executive suites, and imported European fixtures.',
 5, 1);

-- 4. Team Members Seed Data
INSERT INTO `team_members` (`id`, `name`, `role`, `category`, `image`, `highlight_badge`, `tagline`, `sort_order`, `published`) VALUES
(1, 'Tony Stark', 'Founder & CEO', 'MANAGEMENT', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', 'FOUNDER & CEO', 'Architectural visionary guiding PERSQFT standards & futuristic designs.', 1, 1),
(2, 'Steve Rogers', 'Co-Founder & Director', 'MANAGEMENT', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop', 'CO-FOUNDER', 'Directing structural integrity, ethics & project execution.', 2, 1),
(3, 'Nick Fury', 'Co-Founder & Operations', 'MANAGEMENT', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop', 'CO-FOUNDER', 'Leading strategic operations and turnkey execution.', 3, 1),
(4, 'Bruce Banner', 'Lead Structural Engineer', 'EMPLOYEE', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop', NULL, 'Specialist in heavy RCC foundations & load-bearing analysis.', 4, 1),
(5, 'Peter Parker', 'Junior Civil Engineer', 'EMPLOYEE', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop', NULL, 'Managing site execution & high-precision structural blueprints.', 5, 1),
(6, 'Natasha Romanoff', 'Project Head & Safety', 'EMPLOYEE', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop', NULL, 'Overseeing site safety, compliance, and quality control.', 6, 1),
(7, 'Thor Odinson', 'Heavy Machinery Head', 'EMPLOYEE', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop', NULL, 'Driving heavy site excavation, steel structures & piling.', 7, 1),
(8, 'Wanda Maximoff', 'Chief Interior Architect', 'EMPLOYEE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', NULL, 'Crafting bespoke luxury interior aesthetics & spatial design.', 8, 1),
(9, 'Stephen Strange', 'Spatial Design Consultant', 'EMPLOYEE', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=800&auto=format&fit=crop', NULL, 'Elevating 3D walkthroughs, lighting & dimension planning.', 9, 1);

-- 5. Enquiries Seed Data
INSERT INTO `enquiries` (`id`, `reference_id`, `full_name`, `phone`, `email`, `service_required`, `area_sqft`, `project_note`, `attachment_url`, `status`, `created_at`) VALUES
(1, 'PSQFT-849201', 'Vikramaditya Sharma', '+91 98765 43210', 'v.sharma@gmail.com', 'Custom Home Builds', '3,500 SQFT', 'Looking to construct a 3-storey luxury villa in Golf City, Lucknow. Have initial AutoCAD floor plans ready.', NULL, 'PENDING', '2026-09-01 14:32:00'),
(2, 'PSQFT-739102', 'Ananya Verma', '+91 98112 34567', 'ananya.v@realtycorp.in', 'Commercial Projects', '25,000 SQFT', 'Turnkey commercial floor construction requirement in Gomti Nagar Extension. Need site audit.', NULL, 'CONTACTED', '2026-08-31 11:15:00');

-- 6. Services Seed Data
INSERT INTO `services` (`id`, `slug`, `title`, `tagline`, `category`, `short_description`, `description`, `image`, `icon_name`, `brochure_pdf`, `brochure_title`, `deliverables`, `timeline`, `inclusions`, `badge`, `sort_order`, `published`) VALUES
(1, 'elevation-design', '3D Elevation Design', 'Modern, Aesthetic & Distinctive Facades', 'Design',
 'Modern, aesthetic and functional elevations that make a lasting impression.',
 'Make a lasting impression with hyper-realistic 3D elevations engineered with precise material specifications, lighting placements, and contemporary exterior finishes.',
 'uploads/services/elevation.webp', 'home', 'uploads/services/persqft_service_brochure_sample.pdf', 'Complete Elevation Design Dossier (PDF)',
 '3D High-Res Renders + Color Code Schedule', '3 - 5 Working Days',
 '["Photorealistic Day & Night 3D Views", "Complete Exterior Material & Texture Matrix", "Boundary Wall & Main Gate Coordinated CAD", "Exterior LED Lighting & Facade Fixtures Plan"]',
 'Popular', 1, 1),

(2, 'interior-design', 'Luxury Interior Design & Fit-Out', 'Sophisticated Living Tailored to Your Taste', 'Interior',
 'Thoughtfully designed interiors for beautiful, comfortable living.',
 'From modular kitchens and custom false ceilings to premium woodwork, false flooring, and tailored ambient lighting for comfortable, contemporary living.',
 'uploads/services/interior.webp', 'palette', 'uploads/services/persqft_service_brochure_sample.pdf', 'Complete Luxury Interior Catalogue (PDF)',
 '3D Walkthrough Renders + Carpentry CADs', '7 - 12 Working Days',
 '["Room-by-Room 3D Interior Visualizations", "Modular Kitchen & Wardrobe Detail Drawings", "False Ceiling & Electrical Ambience Layouts", "Complete Material Selection & BoQ Assistance"]',
 'Popular', 2, 1),

(3, 'floor-planning', 'Architectural Floor Planning & Vastu', 'Optimal Space Utilization & Natural Light', 'Planning',
 'Smart space planning for maximum utility and better flow.',
 'Smart 2D floor plans designed to maximize carpet area, optimize airflow, integrate cross-ventilation, and balance traditional Vastu principles with modern lifestyle needs.',
 'uploads/services/planning.webp', 'compass', 'uploads/services/persqft_service_brochure_sample.pdf', 'Architectural Vastu Planning Guide (PDF)',
 '2D Architectural CAD Floor Plans (All Floors)', '2 - 4 Working Days',
 '["Vastu-Compliant Zoning & Room Layouts", "Maximum Carpet Area to Built-Up Ratio", "Sun Path & Cross-Ventilation Engineering", "Furniture Flow & Space Optimization Maps"]',
 NULL, 3, 1),

(4, 'structural-drawings', 'Structural & Working Drawings', 'Earthquake-Resistant RCC Engineering Blueprints', 'Planning',
 'Detailed architectural, structural and working drawings for a hassle-free build.',
 'Rigorous structural calculations and detailed working drawings ensuring zero construction ambiguity on site, vetted by certified civil and structural engineers.',
 'uploads/services/drawings.webp', 'ruler', 'uploads/services/persqft_service_brochure_sample.pdf', 'Structural Engineering Specifications (PDF)',
 'Certified Construction Working Drawing Set', '5 - 7 Working Days',
 '["Foundation, Column Footing & Plinth Beam CADs", "RCC Slab & Beam Steel Reinforcement Schedules", "Plumbing (Water Supply & Drainage) Blueprints", "Concealed Electrical Conduit Line Maps"]',
 NULL, 4, 1),

(5, 'turnkey-construction', 'Turnkey Residential Construction', 'End-to-End Home Building with Guaranteed Quality', 'Construction',
 'Complete hassle-free residential construction from foundation to final handover.',
 'Complete hassle-free residential construction from soil testing and excavation to RCC framing, brickwork, finishing, and key handover with zero cost-escalation.',
 'uploads/services/turnkey.webp', 'building', 'uploads/services/persqft_service_brochure_sample.pdf', 'Turnkey Construction Contract & BoQ Dossier (PDF)',
 'Move-in Ready Handover with Warranty', '6 - 12 Months',
 '["Grade-A Certified Cement, Steel & Raw Materials", "Daily/Weekly Photographic Progress Reports", "Dedicated On-Site Civil Project Engineer", "Lab Quality Testing for Concrete & Compaction"]',
 'Popular', 5, 1),

(6, 'commercial-projects', 'Commercial Complexes & Plazas', 'High-Footfall Retail & Office Infrastructure', 'Construction',
 'High-performance commercial complexes with compliant setbacks and maximum FAR.',
 'Engineered commercial buildings, shopping arcades, and corporate spaces with compliant municipal setback parameters, maximum permissible FAR, and durable modern finishes.',
 'uploads/services/drawings.webp', 'layers', 'uploads/services/persqft_service_brochure_sample.pdf', 'Commercial Infrastructure Dossier (PDF)',
 'Commercial Structural & Architectural Set', 'Tailored to Scope',
 '["Municipal Byelaw & Road Width FAR Optimization", "Basement Parking & Fire Exit Planning", "High-Load Capacity Commercial Frame Engineering", "Glass Facade & Composite Panel Cladding Specs"]',
 NULL, 6, 1),

(7, 'renovation-remodeling', 'Structural Renovation & Remodeling', 'Transforming Aging Structures into Modern Spaces', 'Construction',
 'Structural reinforcement, space reconfiguration, and modern facade upgrades.',
 'Reinforce old foundation beams, reconfigure cramped room divisions, update exterior facades, and modernize legacy plumbing and electrical systems with precision.',
 'uploads/services/elevation.webp', 'wrench', 'uploads/services/persqft_service_brochure_sample.pdf', 'Renovation Audit & Remodeling Dossier (PDF)',
 'Remodeling Blueprint + Bill of Quantities', '3 - 8 Weeks',
 '["Existing Structure Health & Load Bearing Audit", "Space Reconfiguration & Wall Demolition Plans", "Modern Facade Replacement & Surface Upgrades", "Waterproofing & Damp-Proof Chemical Injections"]',
 NULL, 7, 1);

