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
} catch (Exception $e) {
    error_log("Services table auto-create notice: " . $e->getMessage());
}

$action = $_GET['action'] ?? 'list';
$editId = (int)($_GET['id'] ?? 0);

// Handle Delete Service
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: services.php');
        exit();
    }

    $id = (int)($_POST['id'] ?? 0);
    if ($id > 0) {
        $stmtOld = $db->prepare("SELECT image, brochure_pdf FROM services WHERE id = ? LIMIT 1");
        $stmtOld->execute([$id]);
        $oldService = $stmtOld->fetch();
        if ($oldService) {
            if (!empty($oldService['image'])) {
                cleanOldUpload($oldService['image']);
            }
            if (!empty($oldService['brochure_pdf'])) {
                cleanOldUpload($oldService['brochure_pdf']);
            }
        }
        $stmt = $db->prepare("DELETE FROM services WHERE id = ?");
        $stmt->execute([$id]);
        setFlash('success', 'Service card and associated documents removed successfully.');
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

    // Fallback image if still blank
    if (empty($imageUrl)) {
        $imageUrl = 'uploads/services/elevation.webp';
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
                    image, icon_name, brochure_pdf, brochure_title, deliverables,
                    timeline, inclusions, badge, sort_order, published
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $slug,
                $title,
                $tagline,
                $category,
                $shortDescription,
                $description,
                $imageUrl,
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

<?php require_once __DIR__ . '/footer.php'; ?>
