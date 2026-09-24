<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — CMS SERVICES MANAGEMENT (SEPARATE ISOLATED TABLE)
// ==========================================================
require_once __DIR__ . '/auth.php';
requireAdminAuth();

$db = getDb();
if (!$db) {
    die("Database connection failed.");
}

// Auto-create services table if it doesn't exist yet for seamless plug-and-play isolation
try {
    $db->exec("
        CREATE TABLE IF NOT EXISTS `services` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `slug` VARCHAR(191) NOT NULL UNIQUE,
          `title` VARCHAR(255) NOT NULL,
          `tagline` VARCHAR(255) DEFAULT NULL,
          `category` VARCHAR(100) NOT NULL DEFAULT 'Design',
          `short_description` TEXT NOT NULL,
          `description` MEDIUMTEXT DEFAULT NULL,
          `image` VARCHAR(500) NOT NULL,
          `gallery` MEDIUMTEXT DEFAULT NULL,
          `icon_name` VARCHAR(50) DEFAULT 'home',
          `brochure_pdf` VARCHAR(500) DEFAULT NULL,
          `brochure_title` VARCHAR(255) DEFAULT 'Comprehensive Service Dossier & Technical Specs',
          `deliverables` VARCHAR(255) DEFAULT NULL,
          `timeline` VARCHAR(100) DEFAULT NULL,
          `inclusions` TEXT DEFAULT NULL,
          `badge` VARCHAR(50) DEFAULT NULL,
          `sort_order` INT NOT NULL DEFAULT 0,
          `published` TINYINT(1) NOT NULL DEFAULT 1,
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // Auto-migrate gallery column if table already existed without it
    try {
        $db->exec("ALTER TABLE `services` ADD COLUMN `gallery` MEDIUMTEXT DEFAULT NULL AFTER `image`;");
    } catch (Exception $e) {
        // Column already exists
    }
} catch (Exception $e) {
    error_log("Services table auto-create notice: " . $e->getMessage());
}

$action = $_GET['action'] ?? 'list';
$editId = (int)($_GET['id'] ?? 0);

// Handle AJAX Multi-Image Upload (with Live Progress Bar & Ctrl+V Clipboard Support)
if ($action === 'ajax_upload' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    if (!verifyCsrfToken($_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) {
        echo json_encode(['success' => false, 'message' => 'Security token invalid or expired.']);
        exit();
    }

    if (empty($_FILES['file']) && empty($_FILES['upload_file'])) {
        echo json_encode(['success' => false, 'message' => 'No image file received.']);
        exit();
    }

    $file = !empty($_FILES['file']) ? $_FILES['file'] : $_FILES['upload_file'];
    $slugPrefix = cleanInput($_POST['slug'] ?? 'service-img');
    if (empty($slugPrefix)) $slugPrefix = 'service-img';

    $converted = saveAndConvertToWebP($file, 'services', $slugPrefix . '-gal-' . uniqid(), 82);

    if ($converted) {
        echo json_encode([
            'success' => true,
            'url'     => $converted,
            'name'    => $file['name'],
            'size'    => $file['size']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Image conversion failed. Please verify format is JPG, PNG, or WEBP under 20MB.'
        ]);
    }
    exit();
}

// Handle Delete Service
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: services.php');
        exit();
    }

    $id = (int)($_POST['id'] ?? 0);
    if ($id > 0) {
        $stmtOld = $db->prepare("SELECT image, brochure_pdf, gallery FROM services WHERE id = ? LIMIT 1");
        $stmtOld->execute([$id]);
        $oldService = $stmtOld->fetch();
        if ($oldService) {
            if (!empty($oldService['image'])) {
                cleanOldUpload($oldService['image']);
            }
            if (!empty($oldService['brochure_pdf'])) {
                cleanOldUpload($oldService['brochure_pdf']);
            }
            if (!empty($oldService['gallery'])) {
                $gList = json_decode($oldService['gallery'], true) ?: [];
                foreach ($gList as $gImg) {
                    cleanOldUpload($gImg);
                }
            }
        }
        $stmt = $db->prepare("DELETE FROM services WHERE id = ?");
        $stmt->execute([$id]);
        setFlash('success', 'Service card, gallery images, and associated documents removed successfully.');
    }
    header('Location: services.php');
    exit();
}

// Handle Save (Create or Update)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: services.php');
        exit();
    }

    $id               = (int)($_POST['id'] ?? 0);
    $title            = cleanInput($_POST['title'] ?? '');
    $rawSlug          = cleanInput($_POST['slug'] ?? '');
    $category         = cleanInput($_POST['category'] ?? 'Design');
    $tagline          = cleanInput($_POST['tagline'] ?? '');
    $shortDescription = cleanInput($_POST['short_description'] ?? '');
    $description      = cleanInput($_POST['description'] ?? '');
    $iconName         = cleanInput($_POST['icon_name'] ?? 'home');
    $deliverables     = cleanInput($_POST['deliverables'] ?? '');
    $timeline         = cleanInput($_POST['timeline'] ?? '');
    $badge            = cleanInput($_POST['badge'] ?? '');
    $sortOrder        = (int)($_POST['sort_order'] ?? 0);
    $published        = isset($_POST['published']) ? 1 : 0;
    $imageUrl         = cleanInput($_POST['image_url'] ?? '', false);
    $brochurePdf      = cleanInput($_POST['brochure_pdf'] ?? '', false);
    $brochureTitle    = cleanInput($_POST['brochure_title'] ?? 'Comprehensive Service Dossier & Technical Specs');

    if (empty($title)) {
        setFlash('error', 'Service title cannot be empty.');
        header('Location: services.php');
        exit();
    }

    // Auto-generate slug if empty
    if (!empty($rawSlug)) {
        $slug = preg_replace('/[^a-zA-Z0-9_-]/', '-', strtolower($rawSlug));
    } else {
        $slug = preg_replace('/[^a-zA-Z0-9_-]/', '-', strtolower($title));
    }
    $slug = trim(preg_replace('/-+/', '-', $slug), '-');
    if (empty($slug)) {
        $slug = 'service-' . time();
    }

    // Process Inclusions (newline-separated to JSON array)
    $inclusionsLines = array_filter(array_map('cleanInput', explode("\n", $_POST['inclusions'] ?? '')));
    $inclusionsJson = json_encode(array_values($inclusionsLines));

    // Handle Card Image File Upload (automatic WebP conversion)
    if (!empty($_FILES['image_file']['name'])) {
        $convertedImage = saveAndConvertToWebP($_FILES['image_file'], 'services', $slug, 82);
        if ($convertedImage) {
            if ($id > 0) {
                $stmtOld = $db->prepare("SELECT image FROM services WHERE id = ? LIMIT 1");
                $stmtOld->execute([$id]);
                $oldImg = $stmtOld->fetchColumn();
                if ($oldImg && $oldImg !== $convertedImage && strpos($oldImg, 'uploads/services/') === 0) {
                    cleanOldUpload($oldImg);
                }
            }
            $imageUrl = $convertedImage;
        }
    }

    // Handle PDF Brochure / Dossier Upload
    if (!empty($_FILES['brochure_file']['name'])) {
        $savedPdf = savePdfUpload($_FILES['brochure_file'], 'services', $slug . '-brochure');
        if ($savedPdf) {
            if ($id > 0) {
                $stmtOld = $db->prepare("SELECT brochure_pdf FROM services WHERE id = ? LIMIT 1");
                $stmtOld->execute([$id]);
                $oldPdf = $stmtOld->fetchColumn();
                if ($oldPdf && $oldPdf !== $savedPdf && strpos($oldPdf, 'uploads/services/') === 0) {
                    cleanOldUpload($oldPdf);
                }
            }
            $brochurePdf = $savedPdf;
        } else {
            setFlash('error', 'PDF upload failed. Please ensure the file is a valid PDF under 30MB.');
        }
    }

    // Remove PDF if explicitly requested
    if (isset($_POST['remove_brochure']) && $_POST['remove_brochure'] === '1') {
        if ($id > 0) {
            $stmtOld = $db->prepare("SELECT brochure_pdf FROM services WHERE id = ? LIMIT 1");
            $stmtOld->execute([$id]);
            $oldPdf = $stmtOld->fetchColumn();
            if ($oldPdf) {
                cleanOldUpload($oldPdf);
            }
        }
        $brochurePdf = null;
    }

    // Process Gallery Images (from AJAX uploads, clipboard pastes, and existing items)
    $galleryList = [];
    if (!empty($_POST['gallery_images']) && is_array($_POST['gallery_images'])) {
        foreach ($_POST['gallery_images'] as $gUrl) {
            $cg = cleanInput($gUrl, false);
            if (!empty($cg)) {
                $galleryList[] = $cg;
            }
        }
    }

    // Also process direct multi-file fallback uploads from $_FILES['gallery_files']
    if (!empty($_FILES['gallery_files']['name']) && is_array($_FILES['gallery_files']['name'])) {
        foreach ($_FILES['gallery_files']['name'] as $idx => $fName) {
            if (!empty($fName) && ($_FILES['gallery_files']['error'][$idx] ?? -1) === UPLOAD_ERR_OK) {
                $singleFile = [
                    'name'     => $_FILES['gallery_files']['name'][$idx],
                    'type'     => $_FILES['gallery_files']['type'][$idx],
                    'tmp_name' => $_FILES['gallery_files']['tmp_name'][$idx],
                    'error'    => $_FILES['gallery_files']['error'][$idx],
                    'size'     => $_FILES['gallery_files']['size'][$idx]
                ];
                $convertedGal = saveAndConvertToWebP($singleFile, 'services', $slug . '-gal-' . ($idx + 1), 82);
                if ($convertedGal) {
                    $galleryList[] = $convertedGal;
                }
            }
        }
    }

    $galleryJson = json_encode(array_values(array_unique($galleryList)));

    // Fallback image if still blank
    if (empty($imageUrl)) {
        $imageUrl = !empty($galleryList[0]) ? $galleryList[0] : 'uploads/services/elevation.webp';
    }

    try {
        if ($id > 0) {
            // Update
            $stmt = $db->prepare("
                UPDATE services SET
                    slug = ?,
                    title = ?,
                    tagline = ?,
                    category = ?,
                    short_description = ?,
                    description = ?,
                    image = ?,
                    gallery = ?,
                    icon_name = ?,
                    brochure_pdf = ?,
                    brochure_title = ?,
                    deliverables = ?,
                    timeline = ?,
                    inclusions = ?,
                    badge = ?,
                    sort_order = ?,
                    published = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $slug,
                $title,
                $tagline,
                $category,
                $shortDescription,
                $description,
                $imageUrl,
                $galleryJson,
                $iconName,
                $brochurePdf,
                $brochureTitle,
                $deliverables,
                $timeline,
                $inclusionsJson,
                $badge,
                $sortOrder,
                $published,
                $id
            ]);
            setFlash('success', 'Service "' . htmlspecialchars($title) . '" updated successfully.');
        } else {
            // Create
            $stmt = $db->prepare("
                INSERT INTO services (
                    slug, title, tagline, category, short_description, description,
                    image, gallery, icon_name, brochure_pdf, brochure_title, deliverables,
                    timeline, inclusions, badge, sort_order, published
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $slug,
                $title,
                $tagline,
                $category,
                $shortDescription,
                $description,
                $imageUrl,
                $galleryJson,
                $iconName,
                $brochurePdf,
                $brochureTitle,
                $deliverables,
                $timeline,
                $inclusionsJson,
                $badge,
                $sortOrder,
                $published
            ]);
            setFlash('success', 'New service card created successfully.');
        }
    } catch (Exception $e) {
        error_log("Save service error: " . $e->getMessage());
        setFlash('error', 'Error saving service: ' . $e->getMessage());
    }

    header('Location: services.php');
    exit();
}

// Fetch single service for editing
$editService = null;
if ($action === 'edit' && $editId > 0) {
    $stmt = $db->prepare("SELECT * FROM services WHERE id = ? LIMIT 1");
    $stmt->execute([$editId]);
    $editService = $stmt->fetch();
    if (!$editService) {
        setFlash('error', 'Service not found.');
        header('Location: services.php');
        exit();
    }
}

$pageTitle = 'Manage Services';
$activePage = 'services';
require_once __DIR__ . '/header.php';
?>

<!-- Tabbed Interface Section matching UIUX Windows Layout -->
<div class="bg-white rounded-2xl sm:rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-4 sm:p-6 md:p-8 space-y-6">

  <!-- Header Action Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
    <div>
      <div class="flex items-center space-x-2">
        <h2 class="text-xl font-bold text-slate-800 tracking-tight font-mono">SERVICES &amp; SOLUTIONS CMS</h2>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-50 text-[#F48033] border border-orange-200">
          ISOLATED TABLE: `services`
        </span>
      </div>
      <p class="text-xs text-slate-500 mt-1">
        Manage service cards, upload high-res images, configure deliverables, and attach technical PDF brochures.
      </p>
    </div>
    <div class="flex items-center space-x-3">
      <?php if ($action === 'list'): ?>
        <a href="services.php?action=new" class="px-5 py-2.5 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] hover:opacity-95 text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center space-x-1.5 cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span>Add New Service Card</span>
        </a>
      <?php else: ?>
        <a href="services.php" class="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-mono text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer">
          ← Back to Services List
        </a>
      <?php endif; ?>
    </div>
  </div>

  <?php if ($action === 'new' || $action === 'edit'): ?>
    <!-- Add / Edit Service Form -->
    <div class="max-w-4xl">
      <h3 class="text-sm font-bold font-mono text-slate-700 uppercase tracking-wider mb-6 flex items-center space-x-2">
        <span><?= $action === 'edit' ? 'Edit Service: ' . htmlspecialchars($editService['title']) : 'Create New Service Card' ?></span>
      </h3>

      <form method="POST" action="services.php" enctype="multipart/form-data" class="space-y-6">
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" value="<?= $editService['id'] ?? 0 ?>">
        <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Title -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Service Title *</label>
            <input 
              type="text" 
              name="title" 
              value="<?= htmlspecialchars($editService['title'] ?? '') ?>" 
              required 
              placeholder="e.g. 3D Elevation Design"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <!-- Slug -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">URL Slug (Auto-generated if empty)</label>
            <input 
              type="text" 
              name="slug" 
              value="<?= htmlspecialchars($editService['slug'] ?? '') ?>" 
              placeholder="e.g. elevation-design"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <!-- Category -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Category *</label>
            <select name="category" class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all">
              <?php foreach (['Design', 'Planning', 'Construction', 'Interior', 'Architecture', 'Turnkey'] as $cat): ?>
                <option value="<?= $cat ?>" <?= ($editService['category'] ?? 'Design') === $cat ? 'selected' : '' ?>><?= $cat ?></option>
              <?php endforeach; ?>
            </select>
          </div>

          <!-- Tagline / Subtitle -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Tagline / Subtitle</label>
            <input 
              type="text" 
              name="tagline" 
              value="<?= htmlspecialchars($editService['tagline'] ?? '') ?>" 
              placeholder="e.g. Modern, Aesthetic &amp; Distinctive Facades"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <!-- Icon Selection -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Service Icon</label>
            <select name="icon_name" class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all">
              <option value="home" <?= ($editService['icon_name'] ?? 'home') === 'home' ? 'selected' : '' ?>>🏠 Home / Facade / Elevation</option>
              <option value="palette" <?= ($editService['icon_name'] ?? '') === 'palette' ? 'selected' : '' ?>>🎨 Palette / Interior Design</option>
              <option value="compass" <?= ($editService['icon_name'] ?? '') === 'compass' ? 'selected' : '' ?>>🧭 Compass / Floor Planning &amp; Vastu</option>
              <option value="ruler" <?= ($editService['icon_name'] ?? '') === 'ruler' ? 'selected' : '' ?>>📐 Ruler / Structural Drawings</option>
              <option value="building" <?= ($editService['icon_name'] ?? '') === 'building' ? 'selected' : '' ?>>🏢 Building / Turnkey Construction</option>
              <option value="layers" <?= ($editService['icon_name'] ?? '') === 'layers' ? 'selected' : '' ?>>🏗️ Layers / Commercial Complexes</option>
              <option value="wrench" <?= ($editService['icon_name'] ?? '') === 'wrench' ? 'selected' : '' ?>>🔧 Wrench / Renovation &amp; Remodeling</option>
            </select>
          </div>

          <!-- Highlight Badge -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Card Highlight Badge (Optional)</label>
            <input 
              type="text" 
              name="badge" 
              value="<?= htmlspecialchars($editService['badge'] ?? '') ?>" 
              placeholder="e.g. Popular, Featured, High Demand (leave blank if none)"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <!-- Deliverables -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Output Deliverables</label>
            <input 
              type="text" 
              name="deliverables" 
              value="<?= htmlspecialchars($editService['deliverables'] ?? '') ?>" 
              placeholder="e.g. 3D High-Res Renders + Color Code Schedule"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <!-- Estimated Timeline -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Turnaround Timeline</label>
            <input 
              type="text" 
              name="timeline" 
              value="<?= htmlspecialchars($editService['timeline'] ?? '') ?>" 
              placeholder="e.g. 3 - 5 Working Days"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>
        </div>

        <!-- Card Image Upload & URL -->
        <div class="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-[#F48033]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <label class="text-xs font-mono text-slate-800 uppercase tracking-wider font-bold">Service Card Image (WebP Auto-Conversion)</label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label class="block text-[11px] font-mono text-slate-500 mb-1 font-medium">Upload Image File (JPG, PNG, WebP — auto-converted to lightweight WebP):</label>
              <input 
                type="file" 
                name="image_file" 
                accept="image/*"
                class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-mono file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:font-bold file:bg-[#F48033] file:text-white hover:file:opacity-90 cursor-pointer"
              >
            </div>
            <div>
              <label class="block text-[11px] font-mono text-slate-500 mb-1 font-medium">Or Direct Image URL / Relative Path:</label>
              <input 
                type="text" 
                name="image_url" 
                value="<?= htmlspecialchars($editService['image'] ?? '') ?>" 
                placeholder="uploads/services/... or https://..."
                class="w-full bg-white border border-slate-200 focus:border-[#F48033] rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono outline-none"
              >
            </div>
          </div>

          <?php if (!empty($editService['image'])): ?>
            <div class="pt-2 flex items-center space-x-3">
              <span class="text-[11px] font-mono text-slate-500">Current Image Preview:</span>
              <?php $cImg = (strpos($editService['image'], 'http') === 0) ? $editService['image'] : '../' . $editService['image']; ?>
              <img src="<?= htmlspecialchars($cImg) ?>" alt="" class="w-16 h-12 rounded-lg object-cover border border-slate-200 shadow-2xs">
              <span class="text-[11px] font-mono text-slate-600 truncate max-w-xs"><?= htmlspecialchars($editService['image']) ?></span>
            </div>
          <?php endif; ?>
        </div>

        <!-- ========================================================
             MULTI-IMAGE GALLERY & LIVE PROGRESS (DRAG & DROP, CTRL+V)
        ======================================================== -->
        <div class="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-[#F48033]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <div>
                <label class="text-xs font-mono text-slate-800 uppercase tracking-wider font-bold block">
                  Service Showcase Gallery (Multiple Images)
                </label>
                <span class="text-[11px] text-slate-500">
                  Upload multiple photos to power the smooth slider &amp; Full View Gallery modal
                </span>
              </div>
            </div>

            <!-- Ctrl+V Clipboard Hint Badge -->
            <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-mono font-bold shadow-2xs">
              <span>📋 Press <strong>Ctrl + V</strong> anywhere to paste from clipboard</span>
            </div>
          </div>

          <!-- Drag and Drop & Browse Zone -->
          <div 
            id="galleryDropzone"
            class="border-2 border-dashed border-slate-300 hover:border-[#F48033] bg-white rounded-2xl p-6 text-center transition-all cursor-pointer group"
          >
            <input 
              type="file" 
              id="galleryFileInput" 
              name="gallery_files[]" 
              multiple 
              accept="image/*" 
              class="hidden"
            >
            <div class="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <div class="w-12 h-12 rounded-xl bg-orange-50 text-[#F48033] flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              </div>
              <p class="text-xs font-mono font-bold text-slate-700">
                <span class="text-[#F48033] underline">Click to browse multiple images</span> or drag &amp; drop files here
              </p>
              <p class="text-[11px] font-mono text-slate-400">
                Supports JPG, PNG, WEBP • Automatically converted to lightweight WebP
              </p>
            </div>
          </div>

          <!-- Live Upload Progress Bar Container -->
          <div id="uploadProgressContainer" class="hidden bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-2xs">
            <div class="flex items-center justify-between text-xs font-mono">
              <div class="flex items-center gap-2">
                <span id="uploadProgressSpinner" class="w-2.5 h-2.5 rounded-full bg-[#F48033] animate-ping"></span>
                <span id="uploadProgressStatus" class="font-bold text-slate-800">Uploading image...</span>
              </div>
              <span id="uploadProgressPercent" class="font-bold text-[#F48033]">0%</span>
            </div>

            <!-- Progress Track -->
            <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
              <div 
                id="uploadProgressBar" 
                class="h-full bg-gradient-to-r from-[#F48033] to-[#E85B1E] rounded-full transition-all duration-150" 
                style="width: 0%"
              ></div>
            </div>

            <div id="uploadProgressDetails" class="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span id="uploadProgressFile">Preparing file...</span>
              <span id="uploadProgressBytes">0 KB / 0 KB</span>
            </div>
          </div>

          <!-- Uploaded Gallery Thumbnails Grid (with Remove Button for each image) -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                Current Gallery Images (<span id="galleryCount">0</span>)
              </span>
              <span class="text-[11px] font-mono text-slate-400">Click ✕ to remove any image</span>
            </div>

            <?php
              $existingGallery = [];
              if (!empty($editService['gallery'])) {
                  $dec = json_decode($editService['gallery'], true);
                  $existingGallery = is_array($dec) ? $dec : array_filter(array_map('trim', explode("\n", $editService['gallery'])));
              }
            ?>

            <div id="galleryThumbnailsGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <?php foreach ($existingGallery as $gUrl): ?>
                <?php $fullG = (strpos($gUrl, 'http') === 0) ? $gUrl : '../' . $gUrl; ?>
                <div class="gallery-item relative group rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs aspect-[4/3]">
                  <img src="<?= htmlspecialchars($fullG) ?>" alt="" class="w-full h-full object-cover">
                  <input type="hidden" name="gallery_images[]" value="<?= htmlspecialchars($gUrl) ?>">
                  <button 
                    type="button" 
                    onclick="removeGalleryItem(this)"
                    class="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-xs shadow-md transition-all cursor-pointer opacity-90 hover:opacity-100" 
                    title="Remove this image"
                  >
                    ✕
                  </button>
                  <div class="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-[10px] text-white p-1 truncate">
                    <?= htmlspecialchars(basename($gUrl)) ?>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>

            <div id="emptyGalleryNotice" class="<?= empty($existingGallery) ? '' : 'hidden' ?> py-6 text-center border border-dashed border-slate-200 rounded-xl bg-white text-slate-400 text-xs font-mono">
              No gallery images added yet. Upload files or paste with Ctrl+V above.
            </div>
          </div>
        </div>

        <!-- ========================================================
             PDF BROCHURE / DOSSIER UPLOAD SECTION
        ======================================================== -->
        <div class="p-5 rounded-2xl bg-orange-50/40 border border-orange-200/60 space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-[#F48033]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              <div>
                <label class="text-xs font-mono text-slate-800 uppercase tracking-wider font-bold block">Service Technical Brochure / Dossier (PDF)</label>
                <span class="text-[11px] text-slate-500">Uploaded brochure opens in a new browser tab with native PDF reader</span>
              </div>
            </div>

            <?php if (!empty($editService['brochure_pdf'])): ?>
              <?php 
                $pdfUrl = (strpos($editService['brochure_pdf'], 'http') === 0) ? $editService['brochure_pdf'] : '../' . $editService['brochure_pdf'];
              ?>
              <a 
                href="<?= htmlspecialchars($pdfUrl) ?>" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#F48033] hover:bg-orange-50 text-[#F48033] rounded-lg text-xs font-bold font-mono shadow-2xs transition-all cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                <span>View Current PDF (New Tab)</span>
              </a>
            <?php endif; ?>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label class="block text-[11px] font-mono text-slate-600 mb-1 font-medium">Upload PDF File (Max 30MB):</label>
              <input 
                type="file" 
                name="brochure_file" 
                accept="application/pdf,.pdf"
                class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-mono file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:font-bold file:bg-[#1E2330] file:text-white hover:file:opacity-90 cursor-pointer"
              >
            </div>
            <div>
              <label class="block text-[11px] font-mono text-slate-600 mb-1 font-medium">Brochure Action Label / Title:</label>
              <input 
                type="text" 
                name="brochure_title" 
                value="<?= htmlspecialchars($editService['brochure_title'] ?? 'Comprehensive Service Dossier & Technical Specs') ?>" 
                placeholder="e.g. Complete Elevation Design Dossier (PDF)"
                class="w-full bg-white border border-slate-200 focus:border-[#F48033] rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono outline-none"
              >
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-mono text-slate-600 mb-1 font-medium">Or Existing PDF File Path / URL:</label>
            <input 
              type="text" 
              name="brochure_pdf" 
              value="<?= htmlspecialchars($editService['brochure_pdf'] ?? '') ?>" 
              placeholder="e.g. uploads/services/... or https://..."
              class="w-full bg-white border border-slate-200 focus:border-[#F48033] rounded-xl px-4 py-2 text-xs text-slate-800 font-mono outline-none"
            >
          </div>

          <?php if (!empty($editService['brochure_pdf'])): ?>
            <div class="flex items-center space-x-2 pt-1">
              <input type="checkbox" id="remove_brochure" name="remove_brochure" value="1" class="w-4 h-4 rounded text-rose-600 border-slate-300 focus:ring-rose-500">
              <label for="remove_brochure" class="text-xs font-mono text-rose-600 cursor-pointer font-bold">Remove this brochure PDF from service</label>
            </div>
          <?php endif; ?>
        </div>

        <!-- Scope & Inclusions (Textarea lines to JSON) -->
        <div>
          <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">
            Scope / Key Inclusions (One feature per line)
          </label>
          <?php 
            $incArr = [];
            if (!empty($editService['inclusions'])) {
                $decoded = json_decode($editService['inclusions'], true);
                $incArr = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode("\n", $editService['inclusions'])));
            }
            $incText = implode("\n", $incArr);
          ?>
          <textarea 
            name="inclusions" 
            rows="4" 
            placeholder="Photorealistic Day &amp; Night 3D Views&#10;Complete Exterior Material &amp; Texture Matrix&#10;Boundary Wall &amp; Main Gate Coordinated CAD&#10;Exterior LED Lighting &amp; Facade Fixtures Plan"
            class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl p-3 text-xs text-slate-800 font-mono outline-none"
          ><?= htmlspecialchars($incText) ?></textarea>
        </div>

        <!-- Descriptions -->
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Short Card Description *</label>
            <input 
              type="text" 
              name="short_description" 
              value="<?= htmlspecialchars($editService['short_description'] ?? '') ?>" 
              required
              placeholder="e.g. Modern, aesthetic and functional elevations that make a lasting impression."
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none"
            >
          </div>
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Full Detailed Narrative</label>
            <textarea 
              name="description" 
              rows="4" 
              placeholder="Detailed architectural scope, materials, and engineering methodology..."
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl p-3 text-xs text-slate-800 font-mono outline-none"
            ><?= htmlspecialchars($editService['description'] ?? '') ?></textarea>
          </div>
        </div>

        <!-- Settings: Sort Order & Published -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Sort Order (Lower numbers appear first)</label>
            <input 
              type="number" 
              name="sort_order" 
              value="<?= (int)($editService['sort_order'] ?? 0) ?>" 
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none"
            >
          </div>
          <div class="flex items-center pt-6">
            <input 
              type="checkbox" 
              id="published" 
              name="published" 
              value="1" 
              <?= ($editService['published'] ?? 1) ? 'checked' : '' ?>
              class="w-4 h-4 rounded text-[#F48033] border-slate-300 focus:ring-[#F48033]"
            >
            <label for="published" class="ml-2 text-xs font-mono text-slate-700 cursor-pointer font-bold uppercase">Publish service card live on website</label>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center space-x-4">
          <button 
            type="submit" 
            class="px-6 py-3 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <?= $action === 'edit' ? 'Save Service Changes' : 'Create Service Card' ?>
          </button>
          <a href="services.php" class="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-mono text-xs uppercase tracking-wider rounded-xl cursor-pointer">
            Cancel
          </a>
        </div>
      </form>
    </div>

  <?php else: ?>
    <!-- Services Cards / Table List in Clean UIUX Layout -->
    <?php 
      $services = $db->query("SELECT * FROM services ORDER BY sort_order ASC, id ASC")->fetchAll();
    ?>

    <div class="space-y-4">
      <?php if (empty($services)): ?>
        <div class="py-12 text-center text-slate-400 text-sm font-mono bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p class="mb-2">No service cards currently in the database.</p>
          <a href="services.php?action=new" class="inline-block px-4 py-2 bg-[#F48033] text-white text-xs font-bold font-mono rounded-lg">
            + Create First Service Card
          </a>
        </div>
      <?php else: ?>
        <div class="grid grid-cols-1 gap-3.5">
          <?php foreach ($services as $srv): ?>
            <?php 
              $imgSrc = (strpos($srv['image'], 'http') === 0) ? $srv['image'] : '../' . $srv['image'];
              $pdfSrc = !empty($srv['brochure_pdf']) ? ((strpos($srv['brochure_pdf'], 'http') === 0) ? $srv['brochure_pdf'] : '../' . $srv['brochure_pdf']) : null;
            ?>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow bg-white gap-3.5 sm:gap-4 w-full overflow-hidden">
              <div class="flex items-start sm:items-center gap-3.5 sm:gap-4 w-full min-w-0 flex-1">
                <!-- Thumbnail with category pill -->
                <div class="w-20 h-20 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-2xs border border-slate-100 relative group">
                  <img src="<?= htmlspecialchars($imgSrc) ?>" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                  <span class="absolute bottom-1 right-1 text-[8px] sm:text-[9px] font-mono px-1 sm:px-1.5 py-0.5 rounded bg-black/75 text-white font-bold">
                    <?= htmlspecialchars($srv['category']) ?>
                  </span>
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-1.5 mb-1">
                    <h4 class="text-sm sm:text-[15px] font-bold text-slate-800 truncate"><?= htmlspecialchars($srv['title']) ?></h4>
                    
                    <?php if (!empty($srv['badge'])): ?>
                      <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-orange-50 text-[#F48033] border border-orange-200">
                        <?= htmlspecialchars($srv['badge']) ?>
                      </span>
                    <?php endif; ?>

                    <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold <?= (int)$srv['published'] === 1 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500' ?>">
                      <?= (int)$srv['published'] === 1 ? 'PUBLISHED' : 'DRAFT' ?>
                    </span>

                    <span class="text-[10px] font-mono text-slate-400">Order: <?= (int)$srv['sort_order'] ?></span>
                  </div>

                  <p class="text-xs text-slate-500 line-clamp-1 mb-1.5"><?= htmlspecialchars($srv['short_description']) ?></p>

                  <div class="flex flex-wrap items-center gap-2">
                    <?php if ($pdfSrc): ?>
                      <a 
                        href="<?= htmlspecialchars($pdfSrc) ?>" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono font-bold hover:bg-rose-100 transition-colors"
                        title="Click to view brochure PDF in new browser tab"
                      >
                        <svg class="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <span>View Brochure PDF (New Tab)</span>
                      </a>
                    <?php else: ?>
                      <span class="text-[10px] font-mono text-slate-400 italic">No PDF brochure attached</span>
                    <?php endif; ?>

                    <?php if (!empty($srv['timeline'])): ?>
                      <span class="text-[10px] font-mono text-slate-400">⏳ <?= htmlspecialchars($srv['timeline']) ?></span>
                    <?php endif; ?>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-end space-x-2 shrink-0 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <a href="services.php?action=edit&id=<?= $srv['id'] ?>" class="px-4 py-1.5 border border-[#F48033] text-[#F48033] rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors cursor-pointer">
                  Edit Card
                </a>
                <form method="POST" action="services.php" onsubmit="return confirm('Delete service ' + <?= json_encode($srv['title']) ?> + ' and its uploaded files?');" class="inline">
                  <input type="hidden" name="action" value="delete">
                  <input type="hidden" name="id" value="<?= $srv['id'] ?>">
                  <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">
                  <button type="submit" class="px-4 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
    </div>

  <?php endif; ?>

</div>

<!-- JavaScript for Live Multi-Image Upload, Ctrl+V Clipboard Paste & Dynamic Progress Bar -->
<script>
(function() {
  const dropzone = document.getElementById('galleryDropzone');
  const fileInput = document.getElementById('galleryFileInput');
  const progressContainer = document.getElementById('uploadProgressContainer');
  const progressBar = document.getElementById('uploadProgressBar');
  const progressPercent = document.getElementById('uploadProgressPercent');
  const progressStatus = document.getElementById('uploadProgressStatus');
  const progressFile = document.getElementById('uploadProgressFile');
  const progressBytes = document.getElementById('uploadProgressBytes');
  const galleryGrid = document.getElementById('galleryThumbnailsGrid');
  const galleryCount = document.getElementById('galleryCount');
  const emptyNotice = document.getElementById('emptyGalleryNotice');
  const csrfToken = document.querySelector('input[name="csrf_token"]')?.value || '';

  function getSlug() {
    const slugInput = document.querySelector('input[name="slug"]')?.value;
    const titleInput = document.querySelector('input[name="title"]')?.value;
    return (slugInput || titleInput || 'service').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  }

  function updateCount() {
    if (!galleryGrid || !galleryCount) return;
    const items = galleryGrid.querySelectorAll('.gallery-item');
    galleryCount.textContent = items.length;
    if (emptyNotice) {
      emptyNotice.classList.toggle('hidden', items.length > 0);
    }
  }
  updateCount();

  window.removeGalleryItem = function(btn) {
    const item = btn.closest('.gallery-item');
    if (item) {
      item.remove();
      updateCount();
    }
  };

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function addThumbnail(url, name) {
    if (!galleryGrid) return;
    const fullUrl = url.startsWith('http') ? url : '../' + url.replace(/^\/+/, '');
    const div = document.createElement('div');
    div.className = 'gallery-item relative group rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs aspect-[4/3]';
    div.innerHTML = `
      <img src="${fullUrl}" alt="${name}" class="w-full h-full object-cover">
      <input type="hidden" name="gallery_images[]" value="${url}">
      <button 
        type="button" 
        onclick="removeGalleryItem(this)"
        class="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-xs shadow-md transition-all cursor-pointer opacity-90 hover:opacity-100" 
        title="Remove this image"
      >
        ✕
      </button>
      <div class="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-[10px] text-white p-1 truncate">
        ${name || 'Image'}
      </div>
    `;
    galleryGrid.appendChild(div);
    updateCount();
  }

  function uploadSingleFile(file, customName) {
    return new Promise((resolve, reject) => {
      if (!progressContainer) return reject(new Error('Progress container missing'));
      
      progressContainer.classList.remove('hidden');
      progressBar.style.width = '0%';
      progressPercent.textContent = '0%';
      progressStatus.innerHTML = '<span class="text-[#F48033]">Uploading:</span> ' + (customName || file.name);
      progressFile.textContent = customName || file.name;
      progressBytes.textContent = '0 KB / ' + formatBytes(file.size);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('csrf_token', csrfToken);
      formData.append('slug', getSlug());

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'services.php?action=ajax_upload', true);

      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          progressBar.style.width = percent + '%';
          progressPercent.textContent = percent + '%';
          progressBytes.textContent = formatBytes(e.loaded) + ' / ' + formatBytes(e.total);
          if (percent >= 100) {
            progressStatus.textContent = 'Converting to WebP & saving...';
          }
        }
      };

      xhr.onload = function() {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.success && data.url) {
              progressBar.style.width = '100%';
              progressPercent.textContent = '100%';
              progressStatus.innerHTML = '<span class="text-emerald-600 font-bold">✓ Upload Completed!</span>';
              addThumbnail(data.url, customName || file.name);
              setTimeout(() => {
                progressContainer.classList.add('hidden');
              }, 2200);
              resolve(data);
            } else {
              progressStatus.innerHTML = '<span class="text-rose-600 font-bold">✕ Error: ' + (data.message || 'Upload failed') + '</span>';
              reject(new Error(data.message));
            }
          } catch (err) {
            progressStatus.innerHTML = '<span class="text-rose-600 font-bold">✕ Server error parsing response</span>';
            reject(err);
          }
        } else {
          progressStatus.innerHTML = '<span class="text-rose-600 font-bold">✕ Upload failed (HTTP ' + xhr.status + ')</span>';
          reject(new Error('HTTP ' + xhr.status));
        }
      };

      xhr.onerror = function() {
        progressStatus.innerHTML = '<span class="text-rose-600 font-bold">✕ Network error during upload</span>';
        reject(new Error('Network error'));
      };

      xhr.send(formData);
    });
  }

  async function handleFiles(files) {
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          await uploadSingleFile(file);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  // Click dropzone to browse
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      handleFiles(fileInput.files);
      fileInput.value = '';
    });

    // Drag and drop handlers
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('border-[#F48033]', 'bg-orange-50/20');
    });
    dropzone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-[#F48033]', 'bg-orange-50/20');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-[#F48033]', 'bg-orange-50/20');
      if (e.dataTransfer && e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    });
  }

  // Global Ctrl+V Clipboard Paste Listener
  window.addEventListener('paste', function(e) {
    if (!e.clipboardData || !e.clipboardData.items) return;
    const items = e.clipboardData.items;
    let found = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          found = true;
          e.preventDefault();
          const pasteName = 'Pasted_Image_' + new Date().toLocaleTimeString().replace(/:/g, '-') + '.png';
          uploadSingleFile(file, pasteName);
        }
      }
    }
    if (found && dropzone) {
      dropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

})();
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
