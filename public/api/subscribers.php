<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — NOTIFICATION SUBSCRIBERS REST API
// ==========================================================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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

// Auto-initialize subscribers table if not exists
try {
    $db->exec("
        CREATE TABLE IF NOT EXISTS `subscribers` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `user_agent` VARCHAR(500) DEFAULT NULL,
          `ip_address` VARCHAR(45) DEFAULT NULL,
          `status` VARCHAR(50) DEFAULT 'ACTIVE',
          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
} catch (Exception $e) {
    // Continue even if table creation fails
}

$method = $_SERVER['REQUEST_METHOD'];

function getPayload() {
    $raw = file_get_contents('php://input');
    if (!empty($raw)) {
        $json = json_decode($raw, true);
        if (is_array($json)) return $json;
    }
    return $_POST;
}

// 1. GET: Fetch subscriber count & analytics
if ($method === 'GET') {
    try {
        $count = (int)$db->query("SELECT COUNT(*) FROM subscribers")->fetchColumn();
        $recent = $db->query("SELECT id, user_agent, ip_address, created_at FROM subscribers ORDER BY id DESC LIMIT 20")->fetchAll();
        echo json_encode([
            'success' => true,
            'count' => $count,
            'subscribers' => $recent
        ]);
    } catch (Exception $e) {
        echo json_encode(['success' => true, 'count' => 0, 'subscribers' => []]);
    }
    exit();
}

// 2. POST: Register new push subscriber
if ($method === 'POST') {
    $data = getPayload();
    $userAgent = cleanInput(substr($data['userAgent'] ?? $_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500));
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $ip = cleanInput(explode(',', $ip)[0]);

    if (empty($userAgent) && empty($ip)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid subscriber payload']);
        exit();
    }

    try {
        // Check if subscriber already exists from this IP and User Agent
        $checkStmt = $db->prepare("SELECT id FROM subscribers WHERE user_agent = ? AND ip_address = ? AND status = 'ACTIVE' LIMIT 1");
        $checkStmt->execute([$userAgent, $ip]);
        $existingId = $checkStmt->fetchColumn();

        if ($existingId) {
            // Update last seen timestamp
            $db->prepare("UPDATE subscribers SET created_at = NOW() WHERE id = ?")->execute([$existingId]);
            $subCount = (int)$db->query("SELECT COUNT(*) FROM subscribers WHERE status = 'ACTIVE'")->fetchColumn();
            echo json_encode([
                'success' => true,
                'id' => (int)$existingId,
                'count' => $subCount,
                'message' => 'Subscriber refreshed successfully'
            ]);
            exit();
        }

        // Insert new subscriber
        $stmt = $db->prepare("INSERT INTO subscribers (user_agent, ip_address, status, created_at) VALUES (?, ?, 'ACTIVE', NOW())");
        $stmt->execute([$userAgent, $ip]);
        $newId = (int)$db->lastInsertId();
        $subCount = (int)$db->query("SELECT COUNT(*) FROM subscribers WHERE status = 'ACTIVE'")->fetchColumn();

        echo json_encode([
            'success' => true,
            'id' => $newId,
            'count' => $subCount,
            'message' => 'Push subscriber registered successfully'
        ]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to save subscriber: ' . $e->getMessage()]);
    }
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);

