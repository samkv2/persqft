<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — ENQUIRY / QUOTE SUBMISSION API
// ==========================================================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit();
}

// Support both JSON payload and form-data
$data = [];
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

if (stripos($contentType, 'application/json') !== false) {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: [];
} else {
    $data = $_POST;
}

$fullName        = trim($data['fullName'] ?? $data['name'] ?? $data['full_name'] ?? '');
$phone           = trim($data['phone'] ?? '');
$email           = trim($data['email'] ?? '');
$serviceRequired = trim($data['serviceRequired'] ?? $data['service'] ?? $data['service_required'] ?? $data['project_type'] ?? 'Residential Construction');
$areaSqft        = trim($data['areaSqft'] ?? $data['area'] ?? $data['area_sqft'] ?? '');
$projectNote     = trim($data['projectNote'] ?? $data['message'] ?? $data['project_note'] ?? $data['description'] ?? '');

if (empty($fullName) || empty($phone)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please provide at least Name and Phone number.'
    ]);
    exit();
}

if (empty($email)) {
    $email = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $fullName)) . '@persqft-client.com';
}

$referenceId = 'PSQFT-' . mt_rand(100000, 999999);

// Handle file attachment if present
$attachmentUrl = null;
if (!empty($_FILES['attachment']['name']) || !empty($_FILES['blueprint']['name'])) {
    $file = !empty($_FILES['attachment']) ? $_FILES['attachment'] : $_FILES['blueprint'];
    if ($file['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../uploads/blueprints/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $fileName = basename($file['name']);
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedExts = ['pdf', 'dwg', 'dxf', 'png', 'jpg', 'jpeg', 'zip'];

        if (in_array($fileExt, $allowedExts)) {
            $cleanName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($fileName, PATHINFO_FILENAME));
            $newFileName = time() . '_' . $cleanName . '.' . $fileExt;
            if (move_uploaded_file($file['tmp_name'], $uploadDir . $newFileName)) {
                $attachmentUrl = 'uploads/blueprints/' . $newFileName;
            }
        }
    }
}

$db = getDb();
if ($db) {
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
    } catch (Exception $e) {
        error_log("Enquiry save error: " . $e->getMessage());
    }
}

echo json_encode([
    'success'      => true,
    'reference_id' => $referenceId,
    'ref'          => $referenceId,
    'message'      => 'Enquiry received successfully! Our senior architectural team will contact you within 24 hours.'
]);
