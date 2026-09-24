<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — CMS ADMIN ACCOUNTS API
// ==========================================================
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../admin/auth.php';

// Only logged in administrators can access this API
if (empty($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized: Admin authentication required']);
    exit();
}

$db = getDb();
if (!$db) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

$currentAdminId = (int)($_SESSION['admin_id'] ?? 0);
$currentAdminRole = (string)($_SESSION['admin_role'] ?? '');
$isSuperAdmin = ($currentAdminId === 1)
    || (stripos($currentAdminRole, 'HEAD') !== false)
    || (stripos($currentAdminRole, 'CEO') !== false)
    || (stripos($currentAdminRole, 'Super') !== false)
    || (stripos($currentAdminRole, 'Owner') !== false);

$method = $_SERVER['REQUEST_METHOD'];

// GET: List all administrators
if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT id, username, email, role, created_at FROM admins ORDER BY id ASC");
        $admins = $stmt->fetchAll();
        echo json_encode(['success' => true, 'admins' => $admins]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit();
}

// POST: Create a new administrator (e.g. for Data Entry) - Super Admin ONLY
if ($method === 'POST') {
    if (!$isSuperAdmin) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden: Only the Super Admin / CEO can release new admin accounts.']);
        exit();
    }

    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;

    $username = trim($data['username'] ?? '');
    $email    = strtolower(trim($data['email'] ?? ''));
    $password = $data['password'] ?? '';
    $role     = trim($data['role'] ?? 'Data Entry Admin');

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'A valid email address is required.']);
        exit();
    }

    if (empty($password) || strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'Password must be at least 6 characters long.']);
        exit();
    }

    // Auto-generate username from email if empty
    if (empty($username)) {
        $username = explode('@', $email)[0];
    }

    try {
        // Check for existing email or username
        $checkStmt = $db->prepare("SELECT id FROM admins WHERE email = ? OR username = ? LIMIT 1");
        $checkStmt->execute([$email, $username]);
        if ($checkStmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'An admin with this email or username already exists.']);
            exit();
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $insertStmt = $db->prepare("
            INSERT INTO admins (username, email, role, password_hash, created_at)
            VALUES (?, ?, ?, ?, NOW())
        ");
        $insertStmt->execute([$username, $email, $role, $passwordHash]);
        $newId = (int)$db->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Admin account created successfully.',
            'admin' => [
                'id' => $newId,
                'username' => $username,
                'email' => $email,
                'role' => $role,
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create admin: ' . $e->getMessage()]);
    }
    exit();
}

// PUT: Update admin details and/or password
if ($method === 'PUT') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: [];

    $id = (int)($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid admin ID']);
        exit();
    }

    // Sub-admins can ONLY modify their own profile
    if (!$isSuperAdmin && $id !== $currentAdminId) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden: You are only allowed to edit your own account information.']);
        exit();
    }

    // Check target admin exists
    $existingStmt = $db->prepare("SELECT * FROM admins WHERE id = ? LIMIT 1");
    $existingStmt->execute([$id]);
    $existingAdmin = $existingStmt->fetch();
    if (!$existingAdmin) {
        http_response_code(404);
        echo json_encode(['error' => 'Admin account not found.']);
        exit();
    }

    $rawUsername = trim(strip_tags($data['username'] ?? ''));
    $rawEmail    = trim($data['email'] ?? '');
    $password    = trim($data['password'] ?? '');

    $username = preg_replace('/[^\w\s\-\.\/]/u', '', $rawUsername);
    $email    = strtolower(filter_var($rawEmail, FILTER_SANITIZE_EMAIL));

    // Role Lock: Role can ONLY be modified by the Super Admin / CEO
    if (!$isSuperAdmin) {
        $role = $existingAdmin['role'];
    } else {
        $role = preg_replace('/[^\w\s\-\.\/]/u', '', trim(strip_tags($data['role'] ?? 'Data Entry Admin')));
        if (empty($role)) {
            $role = $existingAdmin['role'];
        }
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'A valid email address is required.']);
        exit();
    }

    if (empty($username) || strlen($username) < 2) {
        http_response_code(400);
        echo json_encode(['error' => 'Username must be at least 2 characters long.']);
        exit();
    }

    try {
        $checkStmt = $db->prepare("SELECT id FROM admins WHERE (email = ? OR username = ?) AND id != ? LIMIT 1");
        $checkStmt->execute([$email, $username, $id]);
        if ($checkStmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'An admin with this email or username already exists.']);
            exit();
        }

        if (!empty($password)) {
            if (strlen($password) < 6) {
                http_response_code(400);
                echo json_encode(['error' => 'Password must be at least 6 characters.']);
                exit();
            }
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $db->prepare("UPDATE admins SET username = ?, email = ?, role = ?, password_hash = ? WHERE id = ?");
            $stmt->execute([$username, $email, $role, $passwordHash, $id]);
        } else {
            $stmt = $db->prepare("UPDATE admins SET username = ?, email = ?, role = ? WHERE id = ?");
            $stmt->execute([$username, $email, $role, $id]);
        }

        if ($id === $currentAdminId) {
            $_SESSION['admin_username'] = $username;
            $_SESSION['admin_email'] = $email;
            if ($isSuperAdmin) {
                $_SESSION['admin_role'] = $role;
            }
        }

        echo json_encode([
            'success' => true,
            'message' => 'Admin details updated successfully.',
            'admin' => [
                'id' => $id,
                'username' => $username,
                'email' => $email,
                'role' => $role
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update admin: ' . $e->getMessage()]);
    }
    exit();
}

// DELETE: Remove an administrator account - Super Admin ONLY
if ($method === 'DELETE') {
    if (!$isSuperAdmin) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden: Only the Super Admin / CEO can delete admin accounts.']);
        exit();
    }

    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_GET;
    $id = (int)($data['id'] ?? 0);

    if ($id <= 1) {
        http_response_code(403);
        echo json_encode(['error' => 'The primary Super Admin account (ID: 1) cannot be deleted.']);
        exit();
    }

    if ($id === $currentAdminId) {
        http_response_code(403);
        echo json_encode(['error' => 'You cannot delete your own logged-in admin account.']);
        exit();
    }

    try {
        $delStmt = $db->prepare("DELETE FROM admins WHERE id = ?");
        $delStmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Admin account removed.']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete admin: ' . $e->getMessage()]);
    }
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);

