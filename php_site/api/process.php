<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — PROCESS STEPS PHOTOS API
// GET  /api/process.php              → list all steps + images (public)
// GET  /api/process.php?step_id=N    → single step with images (public)
// POST /api/process.php?action=init  → create tables (requires admin session)
// POST /api/process.php              → create / update step + upload images
// PUT  /api/process.php              → update step metadata
// DELETE /api/process.php            → delete step or single image
// ==========================================================
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

// Allow credentials for CMS session cookies
header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit(); }

$db = getDb();
if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

// ── Ensure tables exist ──────────────────────────────────────────────────────
function ensureProcessTables(PDO $db): void
{
    $db->exec("
        CREATE TABLE IF NOT EXISTS `process_steps` (
            `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `step_number` TINYINT UNSIGNED NOT NULL DEFAULT 0,
            `title`       VARCHAR(200) NOT NULL DEFAULT '',
            `description` TEXT,
            `sort_order`  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
            `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP,
            `updated_at`  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    $db->exec("
        CREATE TABLE IF NOT EXISTS `process_images` (
            `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `step_id`     INT UNSIGNED NOT NULL,
            `image_path`  VARCHAR(500) NOT NULL,
            `caption`     VARCHAR(300) DEFAULT '',
            `sort_order`  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
            `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`step_id`) REFERENCES `process_steps`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
}

ensureProcessTables($db);

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// ── AUTH GUARD for write operations ─────────────────────────────────────────
if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
    require_once __DIR__ . '/../admin/auth.php';
    if (empty($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit();
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getStepsWithImages(PDO $db): array
{
    $steps = $db->query("SELECT * FROM process_steps ORDER BY sort_order ASC, step_number ASC")->fetchAll();
    foreach ($steps as &$step) {
        $stmt = $db->prepare("SELECT * FROM process_images WHERE step_id = ? ORDER BY sort_order ASC, id ASC");
        $stmt->execute([$step['id']]);
        $step['images'] = $stmt->fetchAll();
    }
    unset($step);
    return $steps;
}

// ── GET ───────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $stepId = isset($_GET['step_id']) ? (int)$_GET['step_id'] : 0;
    if ($stepId > 0) {
        $stmt = $db->prepare("SELECT * FROM process_steps WHERE id = ?");
        $stmt->execute([$stepId]);
        $step = $stmt->fetch();
        if (!$step) { http_response_code(404); echo json_encode(['success' => false, 'message' => 'Step not found']); exit(); }
        $imgStmt = $db->prepare("SELECT * FROM process_images WHERE step_id = ? ORDER BY sort_order ASC, id ASC");
        $imgStmt->execute([$stepId]);
        $step['images'] = $imgStmt->fetchAll();
        echo json_encode(['success' => true, 'step' => $step]);
    } else {
        echo json_encode(['success' => true, 'steps' => getStepsWithImages($db)]);
    }
    exit();
}

// ── POST: Create step or upload images to existing step ───────────────────────
if ($method === 'POST') {
    // Handle image upload to existing step
    if (!empty($_POST['step_id'])) {
        $stepId = (int)$_POST['step_id'];
        if (!$_FILES || empty($_FILES['images'])) {
            echo json_encode(['success' => false, 'message' => 'No images provided']);
            exit();
        }

        // Normalize $_FILES['images'] for single / multiple upload
        $files = $_FILES['images'];
        $count  = is_array($files['name']) ? count($files['name']) : 1;
        $uploaded = [];

        for ($i = 0; $i < $count; $i++) {
            $file = [
                'name'     => is_array($files['name'])     ? $files['name'][$i]     : $files['name'],
                'type'     => is_array($files['type'])     ? $files['type'][$i]     : $files['type'],
                'tmp_name' => is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'],
                'error'    => is_array($files['error'])    ? $files['error'][$i]    : $files['error'],
                'size'     => is_array($files['size'])     ? $files['size'][$i]     : $files['size'],
            ];
            if ($file['error'] !== UPLOAD_ERR_OK) continue;

            $savedPath = saveAndConvertToWebP($file, 'process', $stepId);
            if (!$savedPath) continue;

            $sortStmt = $db->prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM process_images WHERE step_id = ?");
            $sortStmt->execute([$stepId]);
            $sortOrder = (int)$sortStmt->fetchColumn();

            $ins = $db->prepare("INSERT INTO process_images (step_id, image_path, caption, sort_order) VALUES (?, ?, ?, ?)");
            $ins->execute([$stepId, $savedPath, cleanInput($_POST['caption'] ?? ''), $sortOrder]);
            $uploaded[] = ['id' => $db->lastInsertId(), 'image_path' => $savedPath];
        }

        echo json_encode(['success' => true, 'uploaded' => $uploaded, 'steps' => getStepsWithImages($db)]);
        exit();
    }

    // Create new step
    $data        = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $stepNumber  = (int)($data['step_number'] ?? 0);
    $title       = cleanInput($data['title'] ?? '');
    $description = cleanInput($data['description'] ?? '');

    if (empty($title)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Step title is required']);
        exit();
    }

    $sortStmt = $db->query("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM process_steps");
    $sortOrder = (int)$sortStmt->fetchColumn();

    $stmt = $db->prepare("INSERT INTO process_steps (step_number, title, description, sort_order) VALUES (?, ?, ?, ?)");
    $stmt->execute([$stepNumber, $title, $description, $sortOrder]);
    $newId = $db->lastInsertId();

    echo json_encode(['success' => true, 'step_id' => $newId, 'steps' => getStepsWithImages($db)]);
    exit();
}

// ── PUT: Update step metadata ─────────────────────────────────────────────────
if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
    $id   = (int)($data['id'] ?? 0);
    if (!$id) { http_response_code(400); echo json_encode(['success' => false, 'message' => 'id required']); exit(); }

    // Update image caption / sort_order?
    if (!empty($data['image_id'])) {
        $imgId     = (int)$data['image_id'];
        $caption   = cleanInput($data['caption'] ?? '');
        $sortOrder = (int)($data['sort_order'] ?? 0);
        $stmt = $db->prepare("UPDATE process_images SET caption = ?, sort_order = ? WHERE id = ?");
        $stmt->execute([$caption, $sortOrder, $imgId]);
        echo json_encode(['success' => true, 'steps' => getStepsWithImages($db)]);
        exit();
    }

    // Update step fields
    $stepNumber  = (int)($data['step_number'] ?? 0);
    $title       = cleanInput($data['title'] ?? '');
    $description = cleanInput($data['description'] ?? '');
    $sortOrder   = (int)($data['sort_order'] ?? 0);

    $stmt = $db->prepare("UPDATE process_steps SET step_number = ?, title = ?, description = ?, sort_order = ? WHERE id = ?");
    $stmt->execute([$stepNumber, $title, $description, $sortOrder, $id]);
    echo json_encode(['success' => true, 'steps' => getStepsWithImages($db)]);
    exit();
}

// ── DELETE ────────────────────────────────────────────────────────────────────
if ($method === 'DELETE') {
    $data    = json_decode(file_get_contents('php://input'), true) ?: [];
    $stepId  = (int)($data['step_id'] ?? 0);
    $imageId = (int)($data['image_id'] ?? 0);

    if ($imageId) {
        // Delete single image
        $row = $db->prepare("SELECT image_path FROM process_images WHERE id = ?");
        $row->execute([$imageId]);
        $img = $row->fetch();
        if ($img) {
            cleanOldUpload($img['image_path']);
            $db->prepare("DELETE FROM process_images WHERE id = ?")->execute([$imageId]);
        }
        echo json_encode(['success' => true, 'steps' => getStepsWithImages($db)]);
        exit();
    }

    if ($stepId) {
        // Delete all images on disk first
        $imgs = $db->prepare("SELECT image_path FROM process_images WHERE step_id = ?");
        $imgs->execute([$stepId]);
        foreach ($imgs->fetchAll() as $img) { cleanOldUpload($img['image_path']); }
        $db->prepare("DELETE FROM process_steps WHERE id = ?")->execute([$stepId]);
        echo json_encode(['success' => true, 'steps' => getStepsWithImages($db)]);
        exit();
    }

    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'step_id or image_id required']);
}
