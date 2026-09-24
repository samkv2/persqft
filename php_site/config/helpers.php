<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — SECURITY & IMAGE HELPERS
// ==========================================================

/**
 * Sanitize textual input against XSS, HTML injection, and control characters.
 */
function cleanInput($input, $stripTags = true) {
    if (is_null($input)) return '';
    $input = trim((string)$input);
    if ($stripTags) {
        $input = strip_tags($input);
    }
    return $input;
}

/**
 * Save an uploaded image, validate security, and convert to modern WebP format.
 *
 * @param array  $fileArray     $_FILES['input_name']
 * @param string $subDirectory  'projects' or 'team' or 'blueprints'
 * @param string $namePrefix    e.g. 'skyline-pinnacle' or 'tony-stark'
 * @param int    $quality       WebP compression quality (1-100, default 82)
 * @return string|false         Relative path (e.g. 'uploads/projects/...') or false on failure
 */
function saveAndConvertToWebP($fileArray, $subDirectory, $namePrefix = 'img', $quality = 82) {
    if (empty($fileArray) || !isset($fileArray['tmp_name']) || $fileArray['error'] !== UPLOAD_ERR_OK) {
        return false;
    }

    $tmpPath = $fileArray['tmp_name'];
    if (!is_uploaded_file($tmpPath)) {
        return false;
    }

    // 1. Validate File Size (max 12 MB)
    if ($fileArray['size'] > 12 * 1024 * 1024) {
        return false;
    }

    // 2. Validate Real Image via getimagesize (blocks disguised script files)
    $imageInfo = @getimagesize($tmpPath);
    if ($imageInfo === false) {
        return false;
    }

    $mimeType = $imageInfo['mime'] ?? '';
    $allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!in_array(strtolower($mimeType), $allowedMimes)) {
        return false;
    }

    // 3. Ensure Target Directory Exists
    $targetDir = realpath(__DIR__ . '/../uploads');
    if (!$targetDir) {
        $targetDir = __DIR__ . '/../uploads';
        if (!is_dir($targetDir)) {
            @mkdir($targetDir, 0755, true);
        }
    }
    
    $cleanSubDir = preg_replace('/[^a-zA-Z0-9_-]/', '', $subDirectory);
    $fullDir = rtrim($targetDir, '/\\') . '/' . $cleanSubDir . '/';
    if (!is_dir($fullDir)) {
        @mkdir($fullDir, 0755, true);
    }

    // Clean prefix
    $cleanPrefix = preg_replace('/[^a-zA-Z0-9_-]/', '', strtolower($namePrefix));
    if (empty($cleanPrefix)) {
        $cleanPrefix = 'asset';
    }
    $cleanPrefix = substr($cleanPrefix, 0, 30);

    $uniqueName = time() . '_' . substr(bin2hex(random_bytes(4)), 0, 8) . '_' . $cleanPrefix . '.webp';
    $targetFullPath = $fullDir . $uniqueName;
    $relativeWebPath = 'uploads/' . $cleanSubDir . '/' . $uniqueName;

    // 4. Convert Image to WebP using GD
    $converted = false;
    if (function_exists('imagewebp') && function_exists('imagecreatefromstring')) {
        $rawBytes = @file_get_contents($tmpPath);
        if ($rawBytes !== false) {
            $srcImg = @imagecreatefromstring($rawBytes);
            if ($srcImg !== false) {
                // Ensure truecolor and preserve alpha transparency for PNGs
                if (function_exists('imageistruecolor') && !imageistruecolor($srcImg)) {
                    if (function_exists('imagepalettetotruecolor')) {
                        imagepalettetotruecolor($srcImg);
                    }
                }
                if (function_exists('imagealphablending')) {
                    imagealphablending($srcImg, true);
                }
                if (function_exists('imagesavealpha')) {
                    imagesavealpha($srcImg, true);
                }

                // Save converted WebP with specified compression quality
                if (@imagewebp($srcImg, $targetFullPath, $quality)) {
                    @chmod($targetFullPath, 0644);
                    $converted = true;
                }
                if (function_exists('imagedestroy')) {
                    imagedestroy($srcImg);
                }
            }
        }
    }

    // 5. Graceful Fallback if WebP GD function is absent
    if (!$converted) {
        $origExt = strtolower(pathinfo($fileArray['name'] ?? '', PATHINFO_EXTENSION));
        if (!in_array($origExt, ['jpg', 'jpeg', 'png', 'webp'])) {
            $origExt = 'jpg';
        }
        $fallbackName = time() . '_' . substr(bin2hex(random_bytes(4)), 0, 8) . '_' . $cleanPrefix . '.' . $origExt;
        $targetFullPath = $fullDir . $fallbackName;
        $relativeWebPath = 'uploads/' . $cleanSubDir . '/' . $fallbackName;

        if (@move_uploaded_file($tmpPath, $targetFullPath)) {
            @chmod($targetFullPath, 0644);
            $converted = true;
        }
    }

    // Clean temp file if still present
    if (file_exists($tmpPath)) {
        @unlink($tmpPath);
    }

    return $converted ? $relativeWebPath : false;
}

/**
 * Remove an old file from the uploads directory to prevent disk bloat.
 */
function cleanOldUpload($relativePath) {
    if (empty($relativePath) || strpos($relativePath, 'http') === 0) {
        return;
    }
    $cleanPath = ltrim($relativePath, '/\\');
    if (strpos($cleanPath, 'uploads/') !== 0) {
        return;
    }
    $fullPath = realpath(__DIR__ . '/../' . $cleanPath);
    $baseUploads = realpath(__DIR__ . '/../uploads');
    if ($fullPath && $baseUploads && strpos($fullPath, $baseUploads) === 0 && file_exists($fullPath)) {
        @unlink($fullPath);
    }
}

