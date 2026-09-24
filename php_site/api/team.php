<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — TEAM REST API (FULL CRUD)
// ==========================================================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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

function getPayload() {
    $raw = file_get_contents('php://input');
    if (!empty($raw)) {
        $json = json_decode($raw, true);
        if (is_array($json)) return $json;
    }
    return $_POST;
}

// 1. GET: Fetch all team members
if ($method === 'GET') {
    $category = $_GET['category'] ?? null;
    $team = getTeamMembers($category);
    echo json_encode(['success' => true, 'team' => $team]);
    exit();
}

// Require admin session for write operations
if ($method !== 'GET' && $method !== 'OPTIONS') {
    require_once __DIR__ . '/../admin/auth.php';
    if (empty($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized: Admin session required']);
        exit();
    }
}

// 2. POST: Add a new team member
if ($method === 'POST') {
    $data = getPayload();
    $name           = cleanInput($data['name'] ?? '');
    $role           = cleanInput($data['role'] ?? '');
    $category       = in_array($data['category'] ?? '', ['MANAGEMENT', 'EMPLOYEE']) ? $data['category'] : 'EMPLOYEE';
    $image          = cleanInput($data['image'] ?? $data['imageUrl'] ?? '', false);
    $highlightBadge = cleanInput($data['highlightBadge'] ?? $data['highlight_badge'] ?? '') ?: null;
    $tagline        = cleanInput($data['tagline'] ?? '') ?: null;
    $sortOrder      = (int)($data['sortOrder'] ?? $data['sort_order'] ?? 0);
    $published      = isset($data['published']) ? (int)$data['published'] : 1;

    if (empty($name) || empty($role)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Name and Role are required']);
        exit();
    }

    try {
        $stmt = $db->prepare("
            INSERT INTO team_members (name, role, category, image, highlight_badge, tagline, sort_order, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$name, $role, $category, $image, $highlightBadge, $tagline, $sortOrder, $published]);
        $newId = (int)$db->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Team member added successfully',
            'member' => [
                'id' => $newId,
                'name' => $name,
                'role' => $role,
                'category' => $category,
                'image' => $image,
                'highlight_badge' => $highlightBadge,
                'tagline' => $tagline,
                'sort_order' => $sortOrder,
                'published' => $published
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}

// 3. PUT: Update a team member
if ($method === 'PUT') {
    $data = getPayload();
    $id = (int)($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Valid ID is required']);
        exit();
    }

    $name           = cleanInput($data['name'] ?? '');
    $role           = cleanInput($data['role'] ?? '');
    $category       = in_array($data['category'] ?? '', ['MANAGEMENT', 'EMPLOYEE']) ? $data['category'] : 'EMPLOYEE';
    $image          = cleanInput($data['image'] ?? $data['imageUrl'] ?? '', false);
    $highlightBadge = cleanInput($data['highlightBadge'] ?? $data['highlight_badge'] ?? '') ?: null;
    $tagline        = cleanInput($data['tagline'] ?? '') ?: null;
    $sortOrder      = (int)($data['sortOrder'] ?? $data['sort_order'] ?? 0);
    $published      = isset($data['published']) ? (int)$data['published'] : 1;

    try {
        $stmt = $db->prepare("
            UPDATE team_members SET 
                name = ?, role = ?, category = ?, image = ?, 
                highlight_badge = ?, tagline = ?, sort_order = ?, published = ?
            WHERE id = ?
        ");
        $stmt->execute([$name, $role, $category, $image, $highlightBadge, $tagline, $sortOrder, $published, $id]);

        echo json_encode(['success' => true, 'message' => 'Team member updated']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}

// 4. DELETE: Delete a team member
if ($method === 'DELETE') {
    $data = getPayload();
    $id = (int)($data['id'] ?? $_GET['id'] ?? 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Valid ID is required']);
        exit();
    }

    try {
        $stmtOld = $db->prepare("SELECT image FROM team_members WHERE id = ? LIMIT 1");
        $stmtOld->execute([$id]);
        $oldImg = $stmtOld->fetchColumn();
        if ($oldImg) {
            cleanOldUpload($oldImg);
        }

        $stmt = $db->prepare("DELETE FROM team_members WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Team member deleted successfully', 'deleted_id' => $id]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
