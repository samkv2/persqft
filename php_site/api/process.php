<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — PROCESS STEPS PHOTOS API
// GET  /api/process.php              → list all steps + images (public)
// GET  /api/process.php?step_id=N    → single step with images (public)
// POST /api/process.php              → create step OR upload images to a step
// PUT  /api/process.php              → update step metadata or image caption
// DELETE /api/process.php            → delete step or single image
// ==========================================================
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

// Safe CORS headers that never conflict with credentials
if (!empty($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$db = getDb();
if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

// ── Ensure tables exist and auto-seed default blueprint steps if empty ───────
function ensureProcessTables(PDO $db): void
{
    try {
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

        // Seed default 6 blueprint steps if table is empty
        $count = (int)$db->query("SELECT COUNT(*) FROM process_steps")->fetchColumn();
        if ($count === 0) {
            $defaultSteps = [
                [
                    'step_number' => 1,
                    'title' => 'Consultation & Requirement Discovery',
                    'description' => 'Site visit, soil bearing capacity test, Vastu orientation, contour assessment, and transparent cost estimates.',
                    'images' => [
                        ['path' => 'uploads/process/step1_im1.webp', 'caption' => 'Site Contour & Boundary Survey'],
                        ['path' => 'uploads/process/step1_im2.webp', 'caption' => 'Soil & Geotechnical Testing'],
                        ['path' => 'uploads/process/step1_im3.webp', 'caption' => 'Client Discovery & Feasibility Brief'],
                    ]
                ],
                [
                    'step_number' => 2,
                    'title' => 'Concept & Design Development',
                    'description' => 'Architectural space planning, sun-path analysis, functional zoning, and 2D conceptual floor plans.',
                    'images' => [
                        ['path' => 'uploads/process/step2_im1.webp', 'caption' => 'Space Optimization & Circulation Layout'],
                        ['path' => 'uploads/process/step2_im2.webp', 'caption' => '2D Concept Blueprint Planning'],
                    ]
                ],
                [
                    'step_number' => 3,
                    'title' => 'Planning & Structural Documentation',
                    'description' => 'Seismic Zone III/IV earthquake-resistant RCC structural calculations, footing schedules, plumbing, and electrical conduits.',
                    'images' => [
                        ['path' => 'uploads/process/step3_im1.webp', 'caption' => 'Structural Framing & Foundation Schedule'],
                        ['path' => 'uploads/process/step3_im2.webp', 'caption' => 'Reinforcement Column & Beam CAD'],
                        ['path' => 'uploads/process/step3_im3.webp', 'caption' => 'Slab Reinforcement Grid Calculations'],
                        ['path' => 'uploads/process/step3_im4.webp', 'caption' => 'Plumbing & Drainage Schematic Blueprint'],
                        ['path' => 'uploads/process/step3_im5.webp', 'caption' => 'Electrical Circuit & Distribution Layout'],
                        ['path' => 'uploads/process/step3_im6.webp', 'caption' => 'Civil Approval & Municipal Setback Drawing'],
                    ]
                ],
                [
                    'step_number' => 4,
                    'title' => '3D Elevation & Interior Styling',
                    'description' => 'Photorealistic 4K 3D elevation facades, exterior material palette, moodboards, and interior spaces.',
                    'images' => [
                        ['path' => 'uploads/process/step4_im1.webp', 'caption' => 'Day Facade 3D Architectural View'],
                        ['path' => 'uploads/process/step4_im2.webp', 'caption' => 'Night Lighting & Exterior Elevation'],
                        ['path' => 'uploads/process/step4_im3.webp', 'caption' => 'Modern Balcony & Cladding Aesthetics'],
                        ['path' => 'uploads/process/step4_im4.webp', 'caption' => 'Living Lounge & Interior Styling Render'],
                        ['path' => 'uploads/process/step4_im5.webp', 'caption' => 'Modular Kitchen & Fabrication Details'],
                        ['path' => 'uploads/process/step4_im6.webp', 'caption' => 'Master Bedroom Ambience & Finishes'],
                        ['path' => 'uploads/process/step4_final.webp', 'caption' => 'Approved Final 3D Elevation Blueprint'],
                    ]
                ],
                [
                    'step_number' => 5,
                    'title' => 'Execution & Rigorous Site Supervision',
                    'description' => 'On-site civil engineer supervision, cube compression testing, waterproofing chemical membranes, and weekly updates.',
                    'images' => [
                        ['path' => 'uploads/process/step5_im1.webp', 'caption' => 'Ground Excavation & Footing Casting'],
                        ['path' => 'uploads/process/step5_im2.webp', 'caption' => 'Plinth Beam Casting & Anti-Termite Treatment'],
                        ['path' => 'uploads/process/step5_im3.webp', 'caption' => 'Brickwork & Concrete Curing Rigor'],
                        ['path' => 'uploads/process/step5_im4.webp', 'caption' => 'Roof Slab Casting with High-Grade Concrete'],
                    ]
                ],
                [
                    'step_number' => 6,
                    'title' => 'Quality Handover & Lifetime Structural Warranty',
                    'description' => '400+ point quality inspection, MEP load testing, defect liability warranty certificate, and key handover.',
                    'images' => [
                        ['path' => 'uploads/process/step6_im1.webp', 'caption' => 'Final Finishing & Surface Paint Inspection'],
                        ['path' => 'uploads/process/step6_im2.webp', 'caption' => 'Electrical Load & Water Pressure Gate Audit'],
                        ['path' => 'uploads/process/step6_im3.webp', 'caption' => 'As-Built Drawings & Warranty Dossier'],
                        ['path' => 'uploads/process/step6_im4.webp', 'caption' => 'Pristine Handover & Happy Homeowner Welcome'],
                    ]
                ],
            ];

            foreach ($defaultSteps as $idx => $s) {
                $stmt = $db->prepare("INSERT INTO process_steps (step_number, title, description, sort_order) VALUES (?, ?, ?, ?)");
                $stmt->execute([$s['step_number'], $s['title'], $s['description'], $idx + 1]);
                $stepId = (int)$db->lastInsertId();

                foreach ($s['images'] as $imgIdx => $img) {
                    $imgStmt = $db->prepare("INSERT INTO process_images (step_id, image_path, caption, sort_order) VALUES (?, ?, ?, ?)");
                    $imgStmt->execute([$stepId, $img['path'], $img['caption'], $imgIdx + 1]);
                }
            }
        }
    } catch (Exception $e) {
        error_log('Error initializing process tables: ' . $e->getMessage());
    }
}

ensureProcessTables($db);

$method = $_SERVER['REQUEST_METHOD'];

// ── AUTH GUARD for write operations ─────────────────────────────────────────
if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
    require_once __DIR__ . '/../admin/auth.php';
    if (empty($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized: Admin session required']);
        exit();
    }
}

// ── Helper: Return steps with images ─────────────────────────────────────────
function getStepsWithImages(PDO $db): array
{
    $steps = $db->query("SELECT * FROM process_steps ORDER BY sort_order ASC, step_number ASC, id ASC")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($steps as &$step) {
        $stmt = $db->prepare("SELECT * FROM process_images WHERE step_id = ? ORDER BY sort_order ASC, id ASC");
        $stmt->execute([$step['id']]);
        $step['images'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    unset($step);
    return $steps;
}

// ── GET: Fetch steps and images ──────────────────────────────────────────────
if ($method === 'GET') {
    $stepId = isset($_GET['step_id']) ? (int)$_GET['step_id'] : 0;
    if ($stepId > 0) {
        $stmt = $db->prepare("SELECT * FROM process_steps WHERE id = ?");
        $stmt->execute([$stepId]);
        $step = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$step) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Step not found']);
            exit();
        }
        $imgStmt = $db->prepare("SELECT * FROM process_images WHERE step_id = ? ORDER BY sort_order ASC, id ASC");
        $imgStmt->execute([$stepId]);
        $step['images'] = $imgStmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'step' => $step]);
    } else {
        echo json_encode(['success' => true, 'steps' => getStepsWithImages($db)]);
    }
    exit();
}

// ── POST: Create step OR upload multiple images to existing step ─────────────
if ($method === 'POST') {
    // 1. Image upload to existing step
    if (!empty($_POST['step_id'])) {
        $stepId = (int)$_POST['step_id'];

        $fileKey = null;
        if (!empty($_FILES['images'])) $fileKey = 'images';
        elseif (!empty($_FILES['image'])) $fileKey = 'image';
        elseif (!empty($_FILES['files'])) $fileKey = 'files';

        if (!$fileKey) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No images provided for upload']);
            exit();
        }

        $files = $_FILES[$fileKey];
        $count = is_array($files['name']) ? count($files['name']) : 1;
        $uploaded = [];

        for ($i = 0; $i < $count; $i++) {
            $file = [
                'name'     => is_array($files['name'])     ? $files['name'][$i]     : $files['name'],
                'type'     => is_array($files['type'])     ? $files['type'][$i]     : $files['type'],
                'tmp_name' => is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'],
                'error'    => is_array($files['error'])    ? $files['error'][$i]    : $files['error'],
                'size'     => is_array($files['size'])     ? $files['size'][$i]     : $files['size'],
            ];

            if ($file['error'] !== UPLOAD_ERR_OK) {
                continue;
            }

            $origBase = pathinfo($file['name'], PATHINFO_FILENAME);
            $cleanBase = preg_replace('/[^a-zA-Z0-9_-]/', '-', $origBase);
            $prefix = 'step-' . $stepId . '-' . substr($cleanBase, 0, 20);

            $savedPath = saveAndConvertToWebP($file, 'process', $prefix);
            if (!$savedPath) {
                continue;
            }

            $sortStmt = $db->prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM process_images WHERE step_id = ?");
            $sortStmt->execute([$stepId]);
            $sortOrder = (int)$sortStmt->fetchColumn();

            $ins = $db->prepare("INSERT INTO process_images (step_id, image_path, caption, sort_order) VALUES (?, ?, ?, ?)");
            $ins->execute([$stepId, $savedPath, cleanInput($_POST['caption'] ?? ''), $sortOrder]);
            $uploaded[] = ['id' => (int)$db->lastInsertId(), 'image_path' => $savedPath];
        }

        if (empty($uploaded)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Failed to process any uploaded images (verify valid image formats)']);
            exit();
        }

        echo json_encode(['success' => true, 'uploaded' => $uploaded, 'steps' => getStepsWithImages($db)]);
        exit();
    }

    // 2. Create new step
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
    $newId = (int)$db->lastInsertId();

    echo json_encode(['success' => true, 'step_id' => $newId, 'steps' => getStepsWithImages($db)]);
    exit();
}

// ── PUT: Update step metadata or image caption ────────────────────────────────
if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true) ?: [];

    // 1. Update image caption / sort_order
    if (!empty($data['image_id'])) {
        $imgId     = (int)$data['image_id'];
        $caption   = cleanInput($data['caption'] ?? '');
        $sortOrder = (int)($data['sort_order'] ?? 0);
        $stmt = $db->prepare("UPDATE process_images SET caption = ?, sort_order = ? WHERE id = ?");
        $stmt->execute([$caption, $sortOrder, $imgId]);
        echo json_encode(['success' => true, 'steps' => getStepsWithImages($db)]);
        exit();
    }

    // 2. Update step details
    $id = (int)($data['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Step ID is required']);
        exit();
    }

    $stepNumber  = (int)($data['step_number'] ?? 0);
    $title       = cleanInput($data['title'] ?? '');
    $description = cleanInput($data['description'] ?? '');
    $sortOrder   = (int)($data['sort_order'] ?? 0);

    $stmt = $db->prepare("UPDATE process_steps SET step_number = ?, title = ?, description = ?, sort_order = ? WHERE id = ?");
    $stmt->execute([$stepNumber, $title, $description, $sortOrder, $id]);
    echo json_encode(['success' => true, 'steps' => getStepsWithImages($db)]);
    exit();
}

// ── DELETE: Delete image or whole step ─────────────────────────────────────────
if ($method === 'DELETE') {
    $data    = json_decode(file_get_contents('php://input'), true) ?: [];
    $stepId  = (int)($data['step_id'] ?? 0);
    $imageId = (int)($data['image_id'] ?? 0);

    if ($imageId) {
        $row = $db->prepare("SELECT image_path FROM process_images WHERE id = ?");
        $row->execute([$imageId]);
        $img = $row->fetch(PDO::FETCH_ASSOC);
        if ($img) {
            cleanOldUpload($img['image_path']);
            $db->prepare("DELETE FROM process_images WHERE id = ?")->execute([$imageId]);
        }
        echo json_encode(['success' => true, 'steps' => getStepsWithImages($db)]);
        exit();
    }

    if ($stepId) {
        $imgs = $db->prepare("SELECT image_path FROM process_images WHERE step_id = ?");
        $imgs->execute([$stepId]);
        foreach ($imgs->fetchAll(PDO::FETCH_ASSOC) as $img) {
            cleanOldUpload($img['image_path']);
        }
        $db->prepare("DELETE FROM process_steps WHERE id = ?")->execute([$stepId]);
        echo json_encode(['success' => true, 'steps' => getStepsWithImages($db)]);
        exit();
    }

    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'step_id or image_id required']);
}
