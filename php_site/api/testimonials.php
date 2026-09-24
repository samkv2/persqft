<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — CLIENT TESTIMONIALS REST API
// ==========================================================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';

$db = getDb();
if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

// Auto-initialize testimonials table
try {
    $db->exec("
        CREATE TABLE IF NOT EXISTS `testimonials` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `name` VARCHAR(255) NOT NULL,
          `role` VARCHAR(255) NOT NULL,
          `location` VARCHAR(255) DEFAULT 'Lucknow, UP',
          `project_type` VARCHAR(255) DEFAULT 'Luxury Villa Construction',
          `quote` TEXT NOT NULL,
          `rating` INT DEFAULT 5,
          `gender` VARCHAR(10) DEFAULT 'male',
          `photo` VARCHAR(500) DEFAULT NULL,
          `sort_order` INT DEFAULT 0,
          `published` TINYINT(1) DEFAULT 1,
          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // Seed default 6 verified reviews if table is brand new
    $cnt = (int)$db->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
    if ($cnt === 0) {
        $seeds = [
            [1, 'Mr. Anoop Shukla', 'Employed at Secretariat Lucknow', 'Lucknow, UP', 'Luxury Villa Construction', 'PERSQFT Construction exceeded our expectations. Every detail from structural integrity to interior execution was delivered with pristine craftsmanship. We highly recommend them.', 5, 'male', 1],
            [2, 'Mr. R.K. Verma', 'Senior Guard at INDIAN RAILWAYS', 'Kanpur, UP', 'Independent Residence', 'Every corner reflects our vision. Thanks to the PERSQFT team for bringing our dream home to life with complete transparency and on-time handover.', 5, 'male', 2],
            [3, 'Dr. Sunita Sharma', 'Senior Medical Officer', 'Noida, NCR', 'Turnkey Residential', 'Building our family home was smooth and stress-free. The 3D walkthroughs gave us exact clarity before construction even began. Outstanding team!', 5, 'female', 3],
            [4, 'Er. Vikramaditya Singh', 'Chief Structural Consultant', 'Lucknow, UP', 'Commercial Complex', 'As an engineer myself, I was deeply impressed by PERSQFT\'s structural precision and strict adherence to architectural standards throughout our commercial project.', 5, 'male', 4],
            [5, 'Mrs. Priya Malhotra', 'Interior Architect', 'Gomti Nagar, Lucknow', 'Contemporary Residence', 'Working with PERSQFT was absolute bliss. Their structural finesse and willingness to collaborate made our multi-level home a true masterpiece.', 5, 'female', 5],
            [6, 'Mr. Alok Trivedi', 'Director, Trivedi Enterprises', 'Lucknow, UP', 'Corporate Office', 'Top-notch quality, transparent billing, and zero delay in project timeline. PERSQFT is hands down the best architectural construction firm in the region.', 5, 'male', 6],
        ];
        $stmt = $db->prepare("
            INSERT INTO testimonials (id, name, role, location, project_type, quote, rating, gender, sort_order, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        ");
        foreach ($seeds as $s) {
            $stmt->execute($s);
        }
    }
} catch (Exception $e) {
    // Continue even if table exists or migration error
}

// 1. GET: Fetch published testimonials
try {
    $stmt = $db->query("
        SELECT id, name, role, location, project_type, quote, rating, gender, photo, sort_order, created_at 
        FROM testimonials 
        WHERE published = 1 
        ORDER BY sort_order ASC, id ASC
    ");
    $testimonials = $stmt->fetchAll();

    // Map fields for client consumption
    $formatted = array_map(function($t) {
        return [
            'id'          => (int)$t['id'],
            'name'        => $t['name'],
            'role'        => $t['role'],
            'location'    => $t['location'] ?: 'Lucknow, UP',
            'projectType' => $t['project_type'] ?: 'Turnkey Project',
            'quote'       => $t['quote'],
            'rating'      => (int)($t['rating'] ?: 5),
            'gender'      => $t['gender'] ?: 'male',
            'photo'       => $t['photo'] ?: null,
            'sortOrder'   => (int)$t['sort_order'],
        ];
    }, $testimonials);

    echo json_encode([
        'success'      => true,
        'count'        => count($formatted),
        'testimonials' => $formatted
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch testimonials: ' . $e->getMessage()]);
}
