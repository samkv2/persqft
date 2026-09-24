<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — DATABASE CONFIGURATION & HELPERS
// Compatible with cPanel, shared hosts, LAMP, and Localhost
// ==========================================================

require_once __DIR__ . '/helpers.php';

// Set writable session save path for conventional hosts and container environments
if (session_status() === PHP_SESSION_NONE) {
    if (!is_writable(session_save_path())) {
        session_save_path('/tmp');
    }
    session_start();
}

// Database Credentials
// Can be customized via environment variables or modified directly for cPanel
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_port = getenv('DB_PORT') ?: '3306'; // Standard 3306 for cPanel
$db_name = getenv('DB_NAME') ?: 'persq6da_persqft';
$db_user = getenv('DB_USER') ?: 'persq6da_dbuser';
$db_pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : 'Persqft@2026#db';

/**
 * Returns the active PDO connection instance.
 * @return PDO|null
 */
function getDb() {
    global $db_host, $db_port, $db_name, $db_user, $db_pass;
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    try {
        if (file_exists('/tmp/persqft_mariadb.sock')) {
            $dsn = "mysql:unix_socket=/tmp/persqft_mariadb.sock;dbname={$db_name};charset=utf8mb4";
        } elseif (!empty(getenv('DB_SOCKET'))) {
            $dsn = "mysql:unix_socket=" . getenv('DB_SOCKET') . ";dbname={$db_name};charset=utf8mb4";
        } else {
            $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
        }
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];
        $pdo = new PDO($dsn, $db_user, $db_pass, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Log connection error silently or inspect via error_get_last()
        error_log("PERSQFT Database Connection Error: " . $e->getMessage());
        return null;
    }
}

/**
 * Fetch company site settings and stats counters.
 */
function getSiteSettings() {
    $defaultSettings = [
        'company_name' => 'PERSQFT CONSTRUCTIONS',
        'tagline' => 'Architectural Excellence & Structural Precision',
        'phone' => '+91-6306659601',
        'email' => 'contact@persqft.com',
        'address' => 'Shop No.2, Ramashankar Market, Beside Baba Telecom, Busstand Road, Sultanpur, Uttar Pradesh, 228001',
        'experience_years' => 10,
        'projects_executed' => 150,
        'locations_covered' => 25,
        'on_time_delivery_percent' => 100,
    ];

    $db = getDb();
    if (!$db) return $defaultSettings;

    try {
        $stmt = $db->query("SELECT * FROM site_settings WHERE id = 1 LIMIT 1");
        $row = $stmt->fetch();
        return $row ?: $defaultSettings;
    } catch (Exception $e) {
        return $defaultSettings;
    }
}

/**
 * Fetch active projects, optionally filtered by category.
 */
function getProjects($category = null) {
    $db = getDb();
    if (!$db) return [];

    try {
        if ($category && $category !== 'All') {
            $stmt = $db->prepare("SELECT * FROM projects WHERE published = 1 AND category = ? ORDER BY sort_order ASC, id ASC");
            $stmt->execute([$category]);
        } else {
            $stmt = $db->query("SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC, id ASC");
        }
        return $stmt->fetchAll();
    } catch (Exception $e) {
        return [];
    }
}

/**
 * Fetch a single project by slug or ID.
 */
function getProject($slugOrId) {
    $db = getDb();
    if (!$db) return null;

    try {
        if (is_numeric($slugOrId)) {
            $stmt = $db->prepare("SELECT * FROM projects WHERE id = ? LIMIT 1");
        } else {
            $stmt = $db->prepare("SELECT * FROM projects WHERE slug = ? LIMIT 1");
        }
        $stmt->execute([$slugOrId]);
        return $stmt->fetch() ?: null;
    } catch (Exception $e) {
        return null;
    }
}

/**
 * Fetch team members, optionally filtered by category (MANAGEMENT or EMPLOYEE).
 */
function getTeamMembers($category = null) {
    $db = getDb();
    if (!$db) return [];

    try {
        if ($category) {
            $stmt = $db->prepare("SELECT * FROM team_members WHERE published = 1 AND category = ? ORDER BY sort_order ASC, id ASC");
            $stmt->execute([$category]);
        } else {
            $stmt = $db->query("SELECT * FROM team_members WHERE published = 1 ORDER BY sort_order ASC, id ASC");
        }
        return $stmt->fetchAll();
    } catch (Exception $e) {
        return [];
    }
}

/**
 * Sanitize user input for HTML output.
 */
function e($string) {
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
}
