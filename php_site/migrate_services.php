<?php
// Temporary migration script for services table
require_once __DIR__ . '/config/database.php';

header('Content-Type: text/plain; charset=utf-8');

$db = getDb();
if (!$db) {
    die("Database connection failed\n");
}

echo "Connected to DB\n";

try {
    $db->exec("
        CREATE TABLE IF NOT EXISTS `services` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `slug` VARCHAR(191) NOT NULL UNIQUE,
          `title` VARCHAR(255) NOT NULL,
          `tagline` VARCHAR(255) DEFAULT NULL,
          `category` VARCHAR(100) NOT NULL DEFAULT 'Design',
          `short_description` TEXT NOT NULL,
          `description` MEDIUMTEXT DEFAULT NULL,
          `image` VARCHAR(500) NOT NULL,
          `icon_name` VARCHAR(50) DEFAULT 'home',
          `brochure_pdf` VARCHAR(500) DEFAULT NULL,
          `brochure_title` VARCHAR(255) DEFAULT 'Comprehensive Service Dossier & Technical Specs',
          `deliverables` VARCHAR(255) DEFAULT NULL,
          `timeline` VARCHAR(100) DEFAULT NULL,
          `inclusions` TEXT DEFAULT NULL,
          `badge` VARCHAR(50) DEFAULT NULL,
          `sort_order` INT NOT NULL DEFAULT 0,
          `published` TINYINT(1) NOT NULL DEFAULT 1,
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "Services table created or verified\n";

    $count = (int)$db->query("SELECT COUNT(*) FROM `services`")->fetchColumn();
    echo "Current services count: $count\n";

    if ($count === 0) {
        $db->exec("
            INSERT INTO `services` (`id`, `slug`, `title`, `tagline`, `category`, `short_description`, `description`, `image`, `icon_name`, `brochure_pdf`, `brochure_title`, `deliverables`, `timeline`, `inclusions`, `badge`, `sort_order`, `published`) VALUES
            (1, 'elevation-design', '3D Elevation Design', 'Modern, Aesthetic & Distinctive Facades', 'Design',
             'Modern, aesthetic and functional elevations that make a lasting impression.',
             'Make a lasting impression with hyper-realistic 3D elevations engineered with precise material specifications, lighting placements, and contemporary exterior finishes.',
             'uploads/services/elevation.webp', 'home', 'uploads/services/persqft_service_brochure_sample.pdf', 'Complete Elevation Design Dossier (PDF)',
             '3D High-Res Renders + Color Code Schedule', '3 - 5 Working Days',
             '[\"Photorealistic Day & Night 3D Views\", \"Complete Exterior Material & Texture Matrix\", \"Boundary Wall & Main Gate Coordinated CAD\", \"Exterior LED Lighting & Facade Fixtures Plan\"]',
             'Popular', 1, 1),

            (2, 'interior-design', 'Luxury Interior Design & Fit-Out', 'Sophisticated Living Tailored to Your Taste', 'Interior',
             'Thoughtfully designed interiors for beautiful, comfortable living.',
             'From modular kitchens and custom false ceilings to premium woodwork, false flooring, and tailored ambient lighting for comfortable, contemporary living.',
             'uploads/services/interior.webp', 'palette', 'uploads/services/persqft_service_brochure_sample.pdf', 'Complete Luxury Interior Catalogue (PDF)',
             '3D Walkthrough Renders + Carpentry CADs', '7 - 12 Working Days',
             '[\"Room-by-Room 3D Interior Visualizations\", \"Modular Kitchen & Wardrobe Detail Drawings\", \"False Ceiling & Electrical Ambience Layouts\", \"Complete Material Selection & BoQ Assistance\"]',
             'Popular', 2, 1),

            (3, 'floor-planning', 'Architectural Floor Planning & Vastu', 'Optimal Space Utilization & Natural Light', 'Planning',
             'Smart space planning for maximum utility and better flow.',
             'Smart 2D floor plans designed to maximize carpet area, optimize airflow, integrate cross-ventilation, and balance traditional Vastu principles with modern lifestyle needs.',
             'uploads/services/planning.webp', 'compass', 'uploads/services/persqft_service_brochure_sample.pdf', 'Architectural Vastu Planning Guide (PDF)',
             '2D Architectural CAD Floor Plans (All Floors)', '2 - 4 Working Days',
             '[\"Vastu-Compliant Zoning & Room Layouts\", \"Maximum Carpet Area to Built-Up Ratio\", \"Sun Path & Cross-Ventilation Engineering\", \"Furniture Flow & Space Optimization Maps\"]',
             NULL, 3, 1),

            (4, 'structural-drawings', 'Structural & Working Drawings', 'Earthquake-Resistant RCC Engineering Blueprints', 'Planning',
             'Detailed architectural, structural and working drawings for a hassle-free build.',
             'Rigorous structural calculations and detailed working drawings ensuring zero construction ambiguity on site, vetted by certified civil and structural engineers.',
             'uploads/services/drawings.webp', 'ruler', 'uploads/services/persqft_service_brochure_sample.pdf', 'Structural Engineering Specifications (PDF)',
             'Certified Construction Working Drawing Set', '5 - 7 Working Days',
             '[\"Foundation, Column Footing & Plinth Beam CADs\", \"RCC Slab & Beam Steel Reinforcement Schedules\", \"Plumbing (Water Supply & Drainage) Blueprints\", \"Concealed Electrical Conduit Line Maps\"]',
             NULL, 4, 1),

            (5, 'turnkey-construction', 'Turnkey Residential Construction', 'End-to-End Home Building with Guaranteed Quality', 'Construction',
             'Complete hassle-free residential construction from foundation to final handover.',
             'Complete hassle-free residential construction from soil testing and excavation to RCC framing, brickwork, finishing, and key handover with zero cost-escalation.',
             'uploads/services/turnkey.webp', 'building', 'uploads/services/persqft_service_brochure_sample.pdf', 'Turnkey Construction Contract & BoQ Dossier (PDF)',
             'Move-in Ready Handover with Warranty', '6 - 12 Months',
             '[\"Grade-A Certified Cement, Steel & Raw Materials\", \"Daily/Weekly Photographic Progress Reports\", \"Dedicated On-Site Civil Project Engineer\", \"Lab Quality Testing for Concrete & Compaction\"]',
             'Popular', 5, 1),

            (6, 'commercial-projects', 'Commercial Complexes & Plazas', 'High-Footfall Retail & Office Infrastructure', 'Construction',
             'High-performance commercial complexes with compliant setbacks and maximum FAR.',
             'Engineered commercial buildings, shopping arcades, and corporate spaces with compliant municipal setback parameters, maximum permissible FAR, and durable modern finishes.',
             'uploads/services/drawings.webp', 'layers', 'uploads/services/persqft_service_brochure_sample.pdf', 'Commercial Infrastructure Dossier (PDF)',
             'Commercial Structural & Architectural Set', 'Tailored to Scope',
             '[\"Municipal Byelaw & Road Width FAR Optimization\", \"Basement Parking & Fire Exit Planning\", \"High-Load Capacity Commercial Frame Engineering\", \"Glass Facade & Composite Panel Cladding Specs\"]',
             NULL, 6, 1),

            (7, 'renovation-remodeling', 'Structural Renovation & Remodeling', 'Transforming Aging Structures into Modern Spaces', 'Construction',
             'Structural reinforcement, space reconfiguration, and modern facade upgrades.',
             'Reinforce old foundation beams, reconfigure cramped room divisions, update exterior facades, and modernize legacy plumbing and electrical systems with precision.',
             'uploads/services/elevation.webp', 'wrench', 'uploads/services/persqft_service_brochure_sample.pdf', 'Renovation Audit & Remodeling Dossier (PDF)',
             'Remodeling Blueprint + Bill of Quantities', '3 - 8 Weeks',
             '[\"Existing Structure Health & Load Bearing Audit\", \"Space Reconfiguration & Wall Demolition Plans\", \"Modern Facade Replacement & Surface Upgrades\", \"Waterproofing & Damp-Proof Chemical Injections\"]',
             NULL, 7, 1);
        ");
        echo "Services seeded successfully with 7 records\n";
    }
    echo "MIGRATION COMPLETE SUCCESS\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
