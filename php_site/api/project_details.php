<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — PROJECT DETAILS JSON API
// ==========================================================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../config/database.php';

$idOrSlug = $_GET['id'] ?? $_GET['slug'] ?? null;

if (!$idOrSlug) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing project id or slug']);
    exit();
}

$project = getProject($idOrSlug);

if (!$project) {
    http_response_code(404);
    echo json_encode(['error' => 'Project not found']);
    exit();
}

// Decode JSON fields for gallery and features
$project['gallery'] = json_decode($project['gallery'] ?: '[]', true);
$project['features'] = json_decode($project['features'] ?: '[]', true);

echo json_encode($project);

