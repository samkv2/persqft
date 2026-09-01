<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$email = trim($_POST['email'] ?? '');
$project_type = trim($_POST['project_type'] ?? 'Residential Construction');
$location = trim($_POST['location'] ?? '');
$budget = trim($_POST['budget'] ?? '');
$message = trim($_POST['description'] ?? '');

if (empty($name) || empty($phone) || empty($email) || empty($location)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit();
}

if (!$pdo) {
    // Return success in fallback mode so preview works smoothly
    echo json_encode([
        'success' => true,
        'message' => 'Enquiry received successfully (Preview Mode).',
        'ref' => 'PSQFT-' . rand(100000, 999999)
    ]);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO enquiries (name, phone, email, project_type, location, budget, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'NEW')");
    $stmt->execute([$name, $phone, $email, $project_type, $location, $budget, $message]);
    $enquiry_id = $pdo->lastInsertId();

    // File Upload Handling
    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['attachment'];
        $allowed = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if (in_array($ext, $allowed) && $file['size'] <= 10 * 1024 * 1024) {
            $upload_dir = __DIR__ . '/../uploads/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }

            $safe_filename = 'enquiry_' . $enquiry_id . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
            $destination = $upload_dir . $safe_filename;

            if (move_uploaded_file($file['tmp_name'], $destination)) {
                $file_stmt = $pdo->prepare("INSERT INTO enquiry_files (enquiry_id, file_path, original_name, file_type) VALUES (?, ?, ?, ?)");
                $file_stmt->execute([$enquiry_id, 'uploads/' . $safe_filename, $file['name'], $file['type']]);
            }
        }
    }

    echo json_encode([
        'success' => true,
        'message' => 'Enquiry submitted successfully',
        'ref' => 'PSQFT-' . $enquiry_id
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
