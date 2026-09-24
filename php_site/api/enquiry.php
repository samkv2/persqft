<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — ENQUIRIES REST API (FULL CRUD)
// ==========================================================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

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

// 1. GET / PUT / DELETE: Require admin session (POST is public — clients submit enquiries)
if (in_array($method, ['GET', 'PUT', 'DELETE'])) {
    require_once __DIR__ . '/../admin/auth.php';
    if (empty($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized: Admin session required']);
        exit();
    }
}

// 2. GET: Fetch all enquiries
if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM enquiries ORDER BY created_at DESC");
        $enquiries = $stmt->fetchAll();
        echo json_encode(['success' => true, 'inquiries' => $enquiries]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}

// 2. PUT: Update inquiry status
if ($method === 'PUT') {
    $data = getPayload();
    $id = $data['id'] ?? 0;
    $status = cleanInput($data['status'] ?? 'PENDING');
    $validStatuses = ['PENDING', 'REVIEWED', 'CONTACTED', 'CLOSED'];

    if (!in_array($status, $validStatuses)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid status']);
        exit();
    }

    try {
        if (is_numeric($id)) {
            $stmt = $db->prepare("UPDATE enquiries SET status = ? WHERE id = ?");
            $stmt->execute([$status, (int)$id]);
        } else {
            $stmt = $db->prepare("UPDATE enquiries SET status = ? WHERE reference_id = ?");
            $stmt->execute([$status, (string)$id]);
        }
        echo json_encode(['success' => true, 'message' => 'Status updated']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}

// 3. DELETE: Delete inquiry
if ($method === 'DELETE') {
    $data = getPayload();
    $id = $data['id'] ?? $_GET['id'] ?? 0;

    try {
        if (is_numeric($id)) {
            $stmtOld = $db->prepare("SELECT attachment_url FROM enquiries WHERE id = ? LIMIT 1");
            $stmtOld->execute([(int)$id]);
            $oldAtt = $stmtOld->fetchColumn();
            if ($oldAtt) cleanOldUpload($oldAtt);

            $stmt = $db->prepare("DELETE FROM enquiries WHERE id = ?");
            $stmt->execute([(int)$id]);
        } else {
            $stmtOld = $db->prepare("SELECT attachment_url FROM enquiries WHERE reference_id = ? LIMIT 1");
            $stmtOld->execute([(string)$id]);
            $oldAtt = $stmtOld->fetchColumn();
            if ($oldAtt) cleanOldUpload($oldAtt);

            $stmt = $db->prepare("DELETE FROM enquiries WHERE reference_id = ?");
            $stmt->execute([(string)$id]);
        }
        echo json_encode(['success' => true, 'message' => 'Inquiry deleted']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}

// 4. POST: Submit a new enquiry
if ($method === 'POST') {
    $data = getPayload();

    $fullName        = cleanInput($data['fullName'] ?? $data['name'] ?? $data['full_name'] ?? '');
    $phone           = cleanInput($data['phone'] ?? '');
    $email           = strtolower(cleanInput($data['email'] ?? ''));
    $serviceRequired = cleanInput($data['serviceRequired'] ?? $data['service'] ?? $data['service_required'] ?? $data['project_type'] ?? 'Residential Construction');
    $areaSqft        = cleanInput($data['areaSqft'] ?? $data['area'] ?? $data['area_sqft'] ?? '');
    $projectNote     = cleanInput($data['projectNote'] ?? $data['message'] ?? $data['project_note'] ?? $data['description'] ?? '');

    if (empty($fullName) || empty($phone)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please provide both your Full Name and Mobile number.'
        ]);
        exit();
    }

    // 1. Name validation: letters only, min 3 letters, no numbers
    $lettersInName = preg_replace('/[^a-zA-Z]/', '', $fullName);
    if (strlen($lettersInName) < 3 || preg_match('/[0-9]/', $fullName)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Full name must contain at least 3 letters and cannot contain numbers.'
        ]);
        exit();
    }

    // 2. Phone validation: clean to 10 digits and verify starting digit 6-9
    $cleanPhone = preg_replace('/\D/', '', $phone);
    if (strlen($cleanPhone) === 12 && substr($cleanPhone, 0, 2) === '91') {
        $cleanPhone = substr($cleanPhone, 2);
    } elseif (strlen($cleanPhone) === 11 && substr($cleanPhone, 0, 1) === '0') {
        $cleanPhone = substr($cleanPhone, 1);
    }
    if (strlen($cleanPhone) !== 10 || !preg_match('/^[6-9]\d{9}$/', $cleanPhone)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
        ]);
        exit();
    }
    $phone = $cleanPhone;

    // 3. Message validation: if entered, cannot be only a phone number or digits
    if (!empty($projectNote)) {
        $trimmedNote = trim($projectNote);
        $lettersInNote = preg_replace('/[^a-zA-Z]/', '', $trimmedNote);
        $digitsInNote = preg_replace('/\D/', '', $trimmedNote);
        if (strlen($lettersInNote) < 5 && strlen($digitsInNote) >= 5) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Project message cannot be only a phone number or numbers. Please describe your requirements.'
            ]);
            exit();
        }
        if (strlen($trimmedNote) < 10) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Please enter at least 10 characters describing your project requirements.'
            ]);
            exit();
        }
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $email = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $fullName)) . '@persqft-client.com';
    }

    $referenceId = 'PSQFT-' . mt_rand(100000, 999999);

    // Handle file attachment if present (auto-convert images to WebP)
    $attachmentUrl = null;
    if (!empty($_FILES['attachment']['name']) || !empty($_FILES['blueprint']['name'])) {
        $file = !empty($_FILES['attachment']) ? $_FILES['attachment'] : $_FILES['blueprint'];
        if ($file['error'] === UPLOAD_ERR_OK && $file['size'] <= 15 * 1024 * 1024) {
            $fileName = basename($file['name']);
            $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            
            // If image, convert to WebP
            if (in_array($fileExt, ['jpg', 'jpeg', 'png', 'webp'])) {
                $converted = saveAndConvertToWebP($file, 'blueprints', $referenceId, 82);
                if ($converted) {
                    $attachmentUrl = $converted;
                }
            } elseif (in_array($fileExt, ['pdf', 'dwg', 'dxf', 'zip'])) {
                // Architectural CAD or PDF documents
                $uploadDir = __DIR__ . '/../uploads/blueprints/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                $cleanName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($fileName, PATHINFO_FILENAME));
                $newFileName = time() . '_' . substr(bin2hex(random_bytes(4)), 0, 8) . '_' . $cleanName . '.' . $fileExt;
                if (move_uploaded_file($file['tmp_name'], $uploadDir . $newFileName)) {
                    @chmod($uploadDir . $newFileName, 0644);
                    $attachmentUrl = 'uploads/blueprints/' . $newFileName;
                }
            }
        }
    }

    try {
        $stmt = $db->prepare("
            INSERT INTO enquiries (reference_id, full_name, phone, email, service_required, area_sqft, project_note, attachment_url, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
        ");
        $stmt->execute([
            $referenceId,
            $fullName,
            $phone,
            $email,
            $serviceRequired,
            $areaSqft,
            $projectNote,
            $attachmentUrl
        ]);

        echo json_encode([
            'success'      => true,
            'reference_id' => $referenceId,
            'ref'          => $referenceId,
            'message'      => 'Enquiry received successfully! Our senior architectural team will contact you within 24 hours.'
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
