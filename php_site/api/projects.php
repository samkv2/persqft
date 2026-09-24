<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — PROJECTS REST API (FULL CRUD)
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

// 1. GET: Fetch all projects
if ($method === 'GET') {
    $category = $_GET['category'] ?? null;
    $projects = getProjects($category);

    foreach ($projects as &$p) {
        if (!empty($p['gallery']) && is_string($p['gallery'])) {
            $p['gallery'] = json_decode($p['gallery'], true) ?: [$p['cover_image']];
        }
        if (!empty($p['features']) && is_string($p['features'])) {
            $p['features'] = json_decode($p['features'], true) ?: [];
        }
    }

    echo json_encode(['success' => true, 'projects' => $projects]);
    exit();
}

// 2. POST: Create a new project
if ($method === 'POST') {
    $data = getPayload();
    $title            = cleanInput($data['title'] ?? '');
    $rawSlug          = cleanInput($data['slug'] ?? '');
    $category         = cleanInput($data['category'] ?? 'Residential');
    $location         = cleanInput($data['location'] ?? '');
    $client           = cleanInput($data['client'] ?? 'Private Client');
    $area             = cleanInput($data['area'] ?? '');
    $year             = (int)($data['year'] ?? date('Y'));
    $status           = in_array($data['status'] ?? '', ['ONGOING', 'COMPLETED']) ? $data['status'] : 'ONGOING';
    $progress         = max(0, min(100, (int)($data['progress'] ?? 100)));
    $coverImage       = cleanInput($data['coverImage'] ?? $data['cover_image'] ?? '', false);
    $shortDescription = cleanInput($data['shortDescription'] ?? $data['short_description'] ?? '');
    $description      = cleanInput($data['description'] ?? '');
    $published        = isset($data['published']) ? (int)$data['published'] : 1;

    $galleryArr = is_array($data['gallery'] ?? null) ? $data['gallery'] : [];
    $galleryJson = json_encode(array_values(array_filter($galleryArr)));

    $featuresArr = is_array($data['features'] ?? null) ? $data['features'] : [];
    $featuresJson = json_encode(array_values(array_filter($featuresArr)));

    $slug = !empty($rawSlug) ? preg_replace('/[^a-zA-Z0-9_-]/', '-', strtolower($rawSlug)) : preg_replace('/[^a-zA-Z0-9_-]/', '-', strtolower($title));
    $slug = trim(preg_replace('/-+/', '-', $slug), '-');
    if (empty($slug)) {
        $slug = 'project-' . time();
    }

    if (empty($title) || empty($coverImage)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Title and Cover Image are required']);
        exit();
    }

    try {
        $stmt = $db->prepare("
            INSERT INTO projects (
                title, slug, category, location, client, area, year, 
                status, progress, cover_image, gallery, features, 
                short_description, description, published
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $title, $slug, $category, $location, $client, $area, $year,
            $status, $progress, $coverImage, $galleryJson, $featuresJson,
            $shortDescription, $description, $published
        ]);
        $newId = (int)$db->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Project created successfully',
            'id' => $newId,
            'slug' => $slug
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}

// 3. PUT: Update a project
if ($method === 'PUT') {
    $data = getPayload();
    $id = (int)($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Valid Project ID is required']);
        exit();
    }

    $title            = cleanInput($data['title'] ?? '');
    $category         = cleanInput($data['category'] ?? 'Residential');
    $location         = cleanInput($data['location'] ?? '');
    $client           = cleanInput($data['client'] ?? 'Private Client');
    $area             = cleanInput($data['area'] ?? '');
    $year             = (int)($data['year'] ?? date('Y'));
    $status           = in_array($data['status'] ?? '', ['ONGOING', 'COMPLETED']) ? $data['status'] : 'ONGOING';
    $progress         = max(0, min(100, (int)($data['progress'] ?? 100)));
    $coverImage       = cleanInput($data['coverImage'] ?? $data['cover_image'] ?? '', false);
    $shortDescription = cleanInput($data['shortDescription'] ?? $data['short_description'] ?? '');
    $description      = cleanInput($data['description'] ?? '');
    $published        = isset($data['published']) ? (int)$data['published'] : 1;

    $galleryArr = is_array($data['gallery'] ?? null) ? $data['gallery'] : [];
    $galleryJson = json_encode(array_values(array_filter($galleryArr)));

    $featuresArr = is_array($data['features'] ?? null) ? $data['features'] : [];
    $featuresJson = json_encode(array_values(array_filter($featuresArr)));

    try {
        $stmt = $db->prepare("
            UPDATE projects SET 
                title = ?, category = ?, location = ?, client = ?, area = ?, year = ?, 
                status = ?, progress = ?, cover_image = ?, gallery = ?, features = ?, 
                short_description = ?, description = ?, published = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $title, $category, $location, $client, $area, $year,
            $status, $progress, $coverImage, $galleryJson, $featuresJson,
            $shortDescription, $description, $published, $id
        ]);

        echo json_encode(['success' => true, 'message' => 'Project updated successfully']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}

// 4. DELETE: Delete a project
if ($method === 'DELETE') {
    $data = getPayload();
    $id = (int)($data['id'] ?? $_GET['id'] ?? 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Valid Project ID is required']);
        exit();
    }

    try {
        $stmtOld = $db->prepare("SELECT cover_image, gallery FROM projects WHERE id = ? LIMIT 1");
        $stmtOld->execute([$id]);
        $oldProj = $stmtOld->fetch();
        if ($oldProj) {
            cleanOldUpload($oldProj['cover_image']);
            $gal = json_decode($oldProj['gallery'] ?? '[]', true) ?: [];
            foreach ($gal as $gUrl) {
                cleanOldUpload($gUrl);
            }
        }

        $stmt = $db->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Project deleted successfully', 'deleted_id' => $id]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
