<?php
require_once __DIR__ . '/db.php';

if (!$pdo) {
    // If DB is offline, return sample JSON response
    echo json_encode(['success' => true, 'source' => 'static', 'projects' => []]);
    exit();
}

try {
    $stmt = $pdo->query("SELECT * FROM projects WHERE published = 1 ORDER BY created_at DESC");
    $projects = $stmt->fetchAll();

    foreach ($projects as &$p) {
        $media_stmt = $pdo->prepare("SELECT file_path FROM project_media WHERE project_id = ? ORDER BY sort_order ASC");
        $media_stmt->execute([$p['id']]);
        $p['gallery'] = $media_stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    echo json_encode(['success' => true, 'projects' => $projects]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
