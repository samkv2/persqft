<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — BROADCAST PUSH ALERTS REST API
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

// Auto-initialize tables if not exists
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

    $db->exec("
        CREATE TABLE IF NOT EXISTS `broadcast_alerts` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `title` VARCHAR(255) NOT NULL,
          `message` TEXT NOT NULL,
          `url` VARCHAR(500) DEFAULT NULL,
          `icon` VARCHAR(500) DEFAULT NULL,
          `target_count` INT DEFAULT 0,
          `created_by` VARCHAR(100) DEFAULT 'Admin',
          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
} catch (Exception $e) {}

// 1. GET: Fetch latest broadcast alert(s)
try {
    $subscriberCount = (int)$db->query("SELECT COUNT(*) FROM subscribers WHERE status = 'ACTIVE'")->fetchColumn();

    $sinceId = isset($_GET['since_id']) ? (int)$_GET['since_id'] : 0;

    if ($sinceId > 0) {
        $stmt = $db->prepare("SELECT id, title, message, url, icon, created_at FROM broadcast_alerts WHERE id > ? ORDER BY id ASC LIMIT 5");
        $stmt->execute([$sinceId]);
        $newAlerts = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'subscriber_count' => $subscriberCount,
            'alerts' => $newAlerts
        ]);
        exit();
    }

    $latestAlert = $db->query("SELECT id, title, message, url, icon, created_at FROM broadcast_alerts ORDER BY id DESC LIMIT 1")->fetch();

    echo json_encode([
        'success' => true,
        'subscriber_count' => $subscriberCount,
        'latest_alert' => $latestAlert ?: null,
        'alerts' => $latestAlert ? [$latestAlert] : []
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Query error: ' . $e->getMessage()]);
}

