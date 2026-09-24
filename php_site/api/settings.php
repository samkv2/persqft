<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — SITE SETTINGS JSON API (READ & WRITE)
// ==========================================================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
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

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET: Fetch settings
if ($method === 'GET') {
    $settings = getSiteSettings();
    echo json_encode(['success' => true, 'settings' => $settings]);
    exit();
}

// 2. POST / PUT: Update settings — requires admin session
if ($method === 'POST' || $method === 'PUT') {
    require_once __DIR__ . '/../admin/auth.php';
    if (empty($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized: Admin session required']);
        exit();
    }
    $raw = file_get_contents('php://input');
    $data = (!empty($raw)) ? (json_decode($raw, true) ?: $_POST) : $_POST;

    $current = getSiteSettings();

    $companyName = cleanInput($data['companyName'] ?? $data['company_name'] ?? $current['company_name']);
    $tagline     = cleanInput($data['tagline'] ?? $current['tagline']);
    $phone       = cleanInput($data['phone'] ?? $current['phone']);
    $email       = strtolower(cleanInput($data['email'] ?? $current['email']));
    $address     = cleanInput($data['address'] ?? $current['address']);
    $expYears    = max(0, (int)($data['experienceYears'] ?? $data['experience_years'] ?? $current['experience_years']));
    $projects    = max(0, (int)($data['projectsExecuted'] ?? $data['projects_executed'] ?? $current['projects_executed']));
    $locations   = max(0, (int)($data['locationsCovered'] ?? $data['locations_covered'] ?? $current['locations_covered']));
    $deliveryPct = max(0, min(100, (int)($data['onTimeDeliveryPercent'] ?? $data['on_time_delivery_percent'] ?? $current['on_time_delivery_percent'])));

    try {
        $stmt = $db->prepare("
            UPDATE site_settings SET 
                company_name = ?, tagline = ?, phone = ?, email = ?, address = ?,
                experience_years = ?, projects_executed = ?, locations_covered = ?, on_time_delivery_percent = ?
            WHERE id = 1
        ");
        $stmt->execute([$companyName, $tagline, $phone, $email, $address, $expYears, $projects, $locations, $deliveryPct]);

        $updated = getSiteSettings();
        echo json_encode(['success' => true, 'message' => 'Settings updated successfully', 'settings' => $updated]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
