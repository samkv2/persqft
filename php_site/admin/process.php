<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — CMS PROCESS BLUEPRINT MANAGEMENT
// Server-rendered CMS Portal for Process Steps & Photo Galleries
// ==========================================================
require_once __DIR__ . '/auth.php';
requireAdminAuth();

$db = getDb();
if (!$db) {
    die("Database connection failed.");
}

// ── Ensure tables & default blueprint steps exist ───────────────────────────
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
    error_log("Process init notice: " . $e->getMessage());
}

// ── Handle Actions ───────────────────────────────────────────────────────────
$action = $_POST['action'] ?? $_GET['action'] ?? 'list';

// 1. Upload Multiple Images to a Step
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'upload_images') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Security token invalid or expired.');
        header('Location: process.php');
        exit();
    }

    $stepId = (int)($_POST['step_id'] ?? 0);
    if ($stepId <= 0) {
        setFlash('error', 'Invalid process step ID.');
        header('Location: process.php');
        exit();
    }

    $files = $_FILES['images'] ?? null;
    if (!$files || empty($files['name'])) {
        setFlash('error', 'No images selected for upload.');
        header('Location: process.php');
        exit();
    }

    $count = is_array($files['name']) ? count($files['name']) : 1;
    $uploadedCount = 0;

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

        $caption = cleanInput($_POST['caption'] ?? '');
        $ins = $db->prepare("INSERT INTO process_images (step_id, image_path, caption, sort_order) VALUES (?, ?, ?, ?)");
        $ins->execute([$stepId, $savedPath, $caption, $sortOrder]);
        $uploadedCount++;
    }

    if ($uploadedCount > 0) {
        setFlash('success', "✓ Successfully uploaded {$uploadedCount} photo(s) converted to WebP.");
    } else {
        setFlash('error', "Could not process uploaded images. Ensure files are valid JPG, PNG, or WEBP under 12MB.");
    }

    header('Location: process.php#step-' . $stepId);
    exit();
}

// 2. Delete Single Image
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete_image') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Security token invalid or expired.');
        header('Location: process.php');
        exit();
    }

    $imageId = (int)($_POST['image_id'] ?? 0);
    $stepId = (int)($_POST['step_id'] ?? 0);

    if ($imageId > 0) {
        $stmt = $db->prepare("SELECT image_path FROM process_images WHERE id = ?");
        $stmt->execute([$imageId]);
        $img = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($img) {
            cleanOldUpload($img['image_path']);
            $del = $db->prepare("DELETE FROM process_images WHERE id = ?");
            $del->execute([$imageId]);
            setFlash('success', '✓ Photo removed successfully.');
        }
    }

    header('Location: process.php#step-' . $stepId);
    exit();
}

// 3. Create New Step
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create_step') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Security token invalid or expired.');
        header('Location: process.php');
        exit();
    }

    $stepNumber = (int)($_POST['step_number'] ?? 0);
    $title = cleanInput($_POST['title'] ?? '');
    $description = cleanInput($_POST['description'] ?? '');

    if (empty($title)) {
        setFlash('error', 'Step title is required.');
        header('Location: process.php');
        exit();
    }

    $sortStmt = $db->query("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM process_steps");
    $sortOrder = (int)$sortStmt->fetchColumn();

    $stmt = $db->prepare("INSERT INTO process_steps (step_number, title, description, sort_order) VALUES (?, ?, ?, ?)");
    $stmt->execute([$stepNumber, $title, $description, $sortOrder]);
    $newId = (int)$db->lastInsertId();

    setFlash('success', '✓ New process step added successfully.');
    header('Location: process.php#step-' . $newId);
    exit();
}

// 4. Update Step Metadata
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update_step') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Security token invalid or expired.');
        header('Location: process.php');
        exit();
    }

    $id = (int)($_POST['id'] ?? 0);
    $stepNumber = (int)($_POST['step_number'] ?? 0);
    $title = cleanInput($_POST['title'] ?? '');
    $description = cleanInput($_POST['description'] ?? '');

    if ($id > 0 && !empty($title)) {
        $stmt = $db->prepare("UPDATE process_steps SET step_number = ?, title = ?, description = ? WHERE id = ?");
        $stmt->execute([$stepNumber, $title, $description, $id]);
        setFlash('success', '✓ Process step updated.');
    }

    header('Location: process.php#step-' . $id);
    exit();
}

// 5. Delete Step & Images
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete_step') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Security token invalid or expired.');
        header('Location: process.php');
        exit();
    }

    $stepId = (int)($_POST['step_id'] ?? 0);
    if ($stepId > 0) {
        $imgs = $db->prepare("SELECT image_path FROM process_images WHERE step_id = ?");
        $imgs->execute([$stepId]);
        foreach ($imgs->fetchAll(PDO::FETCH_ASSOC) as $im) {
            cleanOldUpload($im['image_path']);
        }
        $del = $db->prepare("DELETE FROM process_steps WHERE id = ?");
        $del->execute([$stepId]);
        setFlash('success', '✓ Process step and all associated photos deleted.');
    }

    header('Location: process.php');
    exit();
}

// ── Fetch Steps and Images for View ─────────────────────────────────────────
$steps = $db->query("SELECT * FROM process_steps ORDER BY sort_order ASC, step_number ASC, id ASC")->fetchAll(PDO::FETCH_ASSOC);
$totalPhotos = 0;
foreach ($steps as &$step) {
    $stmt = $db->prepare("SELECT * FROM process_images WHERE step_id = ? ORDER BY sort_order ASC, id ASC");
    $stmt->execute([$step['id']]);
    $step['images'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $totalPhotos += count($step['images']);
}
unset($step);

$pageTitle = 'Our Process CMS';
$activePage = 'process';
require_once __DIR__ . '/header.php';
?>

<!-- Tabbed Interface Section matching UIUX Windows Layout -->
<div class="bg-white rounded-2xl sm:rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-4 sm:p-6 md:p-8 space-y-6">

  <!-- Header Action Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
    <div>
      <div class="flex items-center space-x-2">
        <h2 class="text-xl font-bold text-slate-800 tracking-tight font-mono">OUR PROCESS &amp; BLUEPRINT CMS</h2>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-50 text-[#F48033] border border-orange-200">
          VISUAL EXECUTION BLUEPRINT
        </span>
      </div>
      <p class="text-xs text-slate-500 mt-1">
        Manage architectural steps and upload multiple blueprint / site execution photos for each step to showcase in the website scrollreel.
      </p>
    </div>
    <div class="flex items-center space-x-3">
      <button 
        onclick="document.getElementById('modalAddStep').classList.remove('hidden')" 
        class="px-5 py-2.5 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] hover:opacity-95 text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center space-x-1.5 cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        <span>Add Step</span>
      </button>
    </div>
  </div>

  <!-- Overview Stats Pill Row -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p class="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Total Steps</p>
        <h3 class="text-2xl font-bold text-slate-800 font-mono mt-0.5"><?= count($steps) ?></h3>
      </div>
      <div class="w-10 h-10 rounded-xl bg-orange-100 text-[#F48033] flex items-center justify-center font-bold">
        #
      </div>
    </div>
    <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p class="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Total Blueprint Photos</p>
        <h3 class="text-2xl font-bold text-[#F48033] font-mono mt-0.5"><?= $totalPhotos ?></h3>
      </div>
      <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </div>
    </div>
    <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p class="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Scrollreel Mode</p>
        <h3 class="text-sm font-bold text-slate-800 font-mono mt-1">Continuous Aspect-Fit</h3>
      </div>
      <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
        ∞
      </div>
    </div>
  </div>

  <!-- Steps List Accordion / Grid -->
  <div class="space-y-6">
    <?php if (empty($steps)): ?>
      <div class="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p class="text-slate-400 text-sm font-medium">No process steps found. Click "Add Step" above to start.</p>
      </div>
    <?php endif; ?>

    <?php foreach ($steps as $s): ?>
      <div id="step-<?= $s['id'] ?>" class="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
        
        <!-- Step Header -->
        <div class="p-5 bg-gradient-to-r from-slate-50 to-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
          <div class="flex items-start sm:items-center space-x-3.5 flex-1 min-w-0">
            <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF8F3D] to-[#F48033] text-white font-mono font-black text-sm flex items-center justify-center shadow-xs shrink-0">
              <?= str_pad((string)$s['step_number'], 2, '0', STR_PAD_LEFT) ?>
            </span>
            <div class="min-w-0">
              <h3 class="text-base font-bold text-slate-800 truncate"><?= htmlspecialchars($s['title']) ?></h3>
              <p class="text-xs text-slate-500 mt-0.5 line-clamp-2"><?= htmlspecialchars($s['description'] ?: 'No description provided') ?></p>
            </div>
          </div>

          <div class="flex items-center space-x-2 shrink-0">
            <span class="px-2.5 py-1 bg-slate-100 text-slate-600 font-mono text-[11px] font-semibold rounded-lg">
              <?= count($s['images']) ?> photo<?= count($s['images']) !== 1 ? 's' : '' ?>
            </span>

            <button 
              onclick="openEditStep(<?= (int)$s['id'] ?>, <?= (int)$s['step_number'] ?>, <?= htmlspecialchars(json_encode($s['title']), ENT_QUOTES) ?>, <?= htmlspecialchars(json_encode($s['description']), ENT_QUOTES) ?>)"
              class="px-3 py-1.5 border border-slate-200 hover:border-slate-400 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Edit
            </button>

            <form method="POST" action="process.php" onsubmit="return confirm('Delete step <?= (int)$s['step_number'] ?> and ALL its uploaded photos?');" class="inline">
              <input type="hidden" name="action" value="delete_step">
              <input type="hidden" name="step_id" value="<?= $s['id'] ?>">
              <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">
              <button type="submit" class="px-3 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                Delete
              </button>
            </form>
          </div>
        </div>

        <!-- Step Body: Photos & Multiple Upload Dropzone -->
        <div class="p-5 space-y-4">
          
          <!-- Multiple Upload Box -->
          <form method="POST" action="process.php" enctype="multipart/form-data" class="bg-orange-50/50 border-2 border-dashed border-orange-200 hover:border-[#F48033] rounded-xl p-4 transition-colors">
            <input type="hidden" name="action" value="upload_images">
            <input type="hidden" name="step_id" value="<?= $s['id'] ?>">
            <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">

            <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div class="flex items-center space-x-3 w-full sm:w-auto">
                <div class="w-9 h-9 rounded-lg bg-orange-100 text-[#F48033] flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-800 block cursor-pointer">
                    Upload Photos for Step <?= $s['step_number'] ?>
                  </label>
                  <p class="text-[11px] text-slate-500">Select multiple files (JPG, PNG, WEBP — auto WebP conversion)</p>
                </div>
              </div>

              <div class="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <input 
                  type="file" 
                  name="images[]" 
                  multiple 
                  accept="image/*" 
                  required
                  class="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#F48033] file:text-white hover:file:opacity-90 cursor-pointer"
                >
                <button type="submit" class="px-4 py-1.5 bg-[#F48033] hover:bg-[#e07025] text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer shrink-0">
                  Upload Photos
                </button>
              </div>
            </div>
          </form>

          <!-- Current Photos Grid (Preserving Aspect Ratio in Fit Format) -->
          <?php if (!empty($s['images'])): ?>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <?php foreach ($s['images'] as $idx => $img): ?>
                <?php 
                  $webPath = '/' . ltrim($img['image_path'], '/'); 
                ?>
                <div class="group relative bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs flex flex-col">
                  <!-- Image thumbnail preserving aspect ratio -->
                  <div class="aspect-4/3 w-full bg-[#FAF8F5] flex items-center justify-center p-2 overflow-hidden">
                    <img 
                      src="<?= htmlspecialchars($webPath) ?>" 
                      alt="<?= htmlspecialchars($img['caption'] ?: "Photo " . ($idx + 1)) ?>" 
                      class="w-full h-full object-contain"
                      loading="lazy"
                    >
                  </div>

                  <!-- Hover overlay with delete button -->
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <form method="POST" action="process.php" onsubmit="return confirm('Delete this image?');">
                      <input type="hidden" name="action" value="delete_image">
                      <input type="hidden" name="image_id" value="<?= $img['id'] ?>">
                      <input type="hidden" name="step_id" value="<?= $s['id'] ?>">
                      <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">
                      <button type="submit" class="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-md transition-colors cursor-pointer" title="Delete Photo">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </form>
                  </div>

                  <!-- Caption footer -->
                  <div class="p-1.5 bg-white border-t border-slate-100">
                    <p class="text-[10px] font-mono text-slate-500 truncate" title="<?= htmlspecialchars($img['caption'] ?: 'Photo #' . ($idx + 1)) ?>">
                      #<?= $idx + 1 ?> <?= htmlspecialchars($img['caption'] ?: 'Photo') ?>
                    </p>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>
          <?php else: ?>
            <p class="text-xs text-slate-400 py-3 text-center italic">No photos uploaded for this step yet.</p>
          <?php endif; ?>

        </div>
      </div>
    <?php endforeach; ?>
  </div>

</div>

<!-- Modal: Add New Step -->
<div id="modalAddStep" class="hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100">
    <div class="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
      <h3 class="text-base font-bold text-slate-800 font-mono">ADD PROCESS BLUEPRINT STEP</h3>
      <button onclick="document.getElementById('modalAddStep').classList.add('hidden')" class="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
    </div>
    <form method="POST" action="process.php" class="p-5 space-y-4">
      <input type="hidden" name="action" value="create_step">
      <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">

      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-700 block mb-1">Step Number *</label>
          <input type="number" min="1" max="50" name="step_number" value="<?= count($steps) + 1 ?>" required class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#F48033]">
        </div>
        <div class="col-span-2">
          <label class="text-xs font-bold text-slate-700 block mb-1">Step Title *</label>
          <input type="text" name="title" placeholder="e.g. Concept & Space Planning" required class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#F48033]">
        </div>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 block mb-1">Description</label>
        <textarea name="description" rows="3" placeholder="Summary of what is designed or executed in this phase..." class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#F48033] resize-none"></textarea>
      </div>

      <div class="flex justify-end space-x-2 pt-2 border-t border-slate-100">
        <button type="button" onclick="document.getElementById('modalAddStep').classList.add('hidden')" class="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer">
          Cancel
        </button>
        <button type="submit" class="px-5 py-2 bg-[#F48033] hover:bg-[#e07025] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer">
          Create Step
        </button>
      </div>
    </form>
  </div>
</div>

<!-- Modal: Edit Step -->
<div id="modalEditStep" class="hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100">
    <div class="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
      <h3 class="text-base font-bold text-slate-800 font-mono">EDIT PROCESS STEP</h3>
      <button onclick="document.getElementById('modalEditStep').classList.add('hidden')" class="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
    </div>
    <form method="POST" action="process.php" class="p-5 space-y-4">
      <input type="hidden" name="action" value="update_step">
      <input type="hidden" name="id" id="editStepId">
      <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">

      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="text-xs font-bold text-slate-700 block mb-1">Step Number *</label>
          <input type="number" min="1" max="50" name="step_number" id="editStepNumber" required class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#F48033]">
        </div>
        <div class="col-span-2">
          <label class="text-xs font-bold text-slate-700 block mb-1">Step Title *</label>
          <input type="text" name="title" id="editStepTitle" required class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#F48033]">
        </div>
      </div>

      <div>
        <label class="text-xs font-bold text-slate-700 block mb-1">Description</label>
        <textarea name="description" id="editStepDescription" rows="3" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#F48033] resize-none"></textarea>
      </div>

      <div class="flex justify-end space-x-2 pt-2 border-t border-slate-100">
        <button type="button" onclick="document.getElementById('modalEditStep').classList.add('hidden')" class="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer">
          Cancel
        </button>
        <button type="submit" class="px-5 py-2 bg-[#F48033] hover:bg-[#e07025] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer">
          Save Changes
        </button>
      </div>
    </form>
  </div>
</div>

<script>
function openEditStep(id, stepNumber, title, description) {
  document.getElementById('editStepId').value = id;
  document.getElementById('editStepNumber').value = stepNumber;
  document.getElementById('editStepTitle').value = title;
  document.getElementById('editStepDescription').value = description || '';
  document.getElementById('modalEditStep').classList.remove('hidden');
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
