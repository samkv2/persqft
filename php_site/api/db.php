<?php
// PERSQFT CONSTRUCTIONS — DATABASE CONNECTION API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_host = getenv('DB_HOST') ?: 'sql302.infinityfree.com';
$db_name = getenv('DB_NAME') ?: 'if0_38475812_persqft';
$db_user = getenv('DB_USER') ?: 'if0_38475812';
$db_pass = getenv('DB_PASS') ?: 'Persqft2026';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // Graceful fallback response if MySQL credentials not initialized yet
    $pdo = null;
}
