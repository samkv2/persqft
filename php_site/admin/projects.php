<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — CMS PROJECTS MANAGEMENT (UIUX WINDOWS)
// ==========================================================
require_once __DIR__ . '/auth.php';
requireAdminAuth();

$db = getDb();
if (!$db) {
    die("Database connection failed.");
}

$action = $_GET['action'] ?? 'list';
$editId = (int)($_GET['id'] ?? 0);

// Handle Delete Project
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: projects.php');
        exit();
    }

    $id = (int)($_POST['id'] ?? 0);
    if ($id > 0) {
        $stmtOld = $db->prepare("SELECT cover_image, gallery FROM projects WHERE id = ? LIMIT 1");
        $stmtOld->execute([$id]);
        $oldProj = $stmtOld->fetch();
        if ($oldProj) {
            cleanOldUpload($oldProj['cover_image']);
            $gal = json_decode($oldProj['gallery'] ?? '[]', true) ?: [];
            foreach ($gal as $gUrl) {
                cleanOldUpload($gUrl);
            }
        }
        $stmt = $db->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->execute([$id]);
        setFlash('success', 'Project removed from portfolio.');
    }
    header('Location: projects.php');
    exit();
}

// Handle Save (Create or Update)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: projects.php');
        exit();
    }

    $id               = (int)($_POST['id'] ?? 0);
    $title            = cleanInput($_POST['title'] ?? '');
    $rawSlug          = cleanInput($_POST['slug'] ?? '');
    $category         = cleanInput($_POST['category'] ?? 'Residential');
    $location         = cleanInput($_POST['location'] ?? '');
    $client           = cleanInput($_POST['client'] ?? 'Private Client');
    $area             = cleanInput($_POST['area'] ?? '');
    $year             = (int)($_POST['year'] ?? date('Y'));
    $status           = in_array($_POST['status'] ?? '', ['ONGOING', 'COMPLETED']) ? $_POST['status'] : 'ONGOING';
    $progress         = max(0, min(100, (int)($_POST['progress'] ?? 100)));
    $shortDescription = cleanInput($_POST['short_description'] ?? '');
    $description      = cleanInput($_POST['description'] ?? '');
    $coverImageUrl    = cleanInput($_POST['cover_image_url'] ?? '', false);
    $published        = isset($_POST['published']) ? 1 : 0;

    // Process Gallery (lines of URLs to JSON)
    $galleryLines = array_filter(array_map('trim', explode("\n", $_POST['gallery'] ?? '')));
    
    // Auto-slug if empty or format
    if (!empty($rawSlug)) {
        $slug = preg_replace('/[^a-zA-Z0-9_-]/', '-', strtolower($rawSlug));
    } else {
        $slug = preg_replace('/[^a-zA-Z0-9_-]/', '-', strtolower($title));
    }
    $slug = trim(preg_replace('/-+/', '-', $slug), '-');
    if (empty($slug)) {
        $slug = 'project-' . time();
    }

    // Handle Cover Image file upload with automatic WebP conversion
    if (!empty($_FILES['cover_image_file']['name'])) {
        $convertedCover = saveAndConvertToWebP($_FILES['cover_image_file'], 'projects', $slug, 82);
        if ($convertedCover) {
            if ($id > 0) {
                $stmtOld = $db->prepare("SELECT cover_image FROM projects WHERE id = ? LIMIT 1");
                $stmtOld->execute([$id]);
                $oldCover = $stmtOld->fetchColumn();
                if ($oldCover && $oldCover !== $convertedCover) {
                    cleanOldUpload($oldCover);
                }
            }
            $coverImageUrl = $convertedCover;
        }
    }

    // Handle Optional Multi-file Gallery Uploads with automatic WebP conversion
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
                $convertedGal = saveAndConvertToWebP($singleFile, 'projects', $slug . '-gal-' . ($idx + 1), 82);
                if ($convertedGal) {
                    $galleryLines[] = $convertedGal;
                }
            }
        }
    }

    $galleryJson = json_encode(array_values(array_unique($galleryLines)));

    // Process Features (lines to JSON)
    $featureLines = array_filter(array_map('cleanInput', explode("\n", $_POST['features'] ?? '')));
    $featuresJson = json_encode(array_values($featureLines));

    if (empty($title) || empty($coverImageUrl)) {
        setFlash('error', 'Title and Cover Image are required.');
        header('Location: projects.php' . ($id > 0 ? "?action=edit&id={$id}" : '?action=new'));
        exit();
    }

    if ($id > 0) {
        // Update existing project
        $stmt = $db->prepare("
            UPDATE projects SET 
                title = ?, slug = ?, category = ?, location = ?, client = ?, area = ?, year = ?, 
                status = ?, progress = ?, cover_image = ?, gallery = ?, features = ?, 
                short_description = ?, description = ?, published = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $title, $slug, $category, $location, $client, $area, $year,
            $status, $progress, $coverImageUrl, $galleryJson, $featuresJson,
            $shortDescription, $description, $published, $id
        ]);
        setFlash('success', 'Project updated successfully with automated WebP conversion.');
    } else {
        // Create new project
        $stmt = $db->prepare("
            INSERT INTO projects (
                title, slug, category, location, client, area, year, 
                status, progress, cover_image, gallery, features, 
                short_description, description, published
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $title, $slug, $category, $location, $client, $area, $year,
            $status, $progress, $coverImageUrl, $galleryJson, $featuresJson,
            $shortDescription, $description, $published
        ]);
        setFlash('success', 'New project added to portfolio.');
    }

    header('Location: projects.php');
    exit();
}

// Fetch project for editing
$editProject = null;
if (($action === 'edit') && $editId > 0) {
    $stmt = $db->prepare("SELECT * FROM projects WHERE id = ? LIMIT 1");
    $stmt->execute([$editId]);
    $editProject = $stmt->fetch();
}

$pageTitle = 'Manage Projects';
$activePage = 'projects';
require_once __DIR__ . '/header.php';
?>

<!-- Tabbed Interface Section matching UIUX Windows Layout -->
<div class="bg-white rounded-2xl sm:rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-4 sm:p-6 md:p-8 space-y-6">

  <!-- Header Action Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
    <div>
      <h2 class="text-xl font-bold text-slate-800 tracking-tight font-mono">PORTFOLIO PROJECTS CMS</h2>
      <p class="text-xs text-slate-500 mt-0.5">Add, update specs, architectural renders, and construction status.</p>
    </div>
    <div class="flex items-center space-x-3">
      <?php if ($action === 'list'): ?>
        <a href="projects.php?action=new" class="px-5 py-2.5 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] hover:opacity-95 text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center space-x-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span>Release Project</span>
        </a>
      <?php else: ?>
        <a href="projects.php" class="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-mono text-xs uppercase tracking-wider rounded-xl transition-all">
          ← Back to List
        </a>
      <?php endif; ?>
    </div>
  </div>

  <?php if ($action === 'new' || $action === 'edit'): ?>
    <!-- Add / Edit Project Form in Clean Modern UIUX Styling -->
    <div class="max-w-4xl">
      <h3 class="text-sm font-bold font-mono text-slate-700 uppercase tracking-wider mb-6">
        <?= $action === 'edit' ? 'Edit Project: ' . htmlspecialchars($editProject['title']) : 'Create New Portfolio Project' ?>
      </h3>

      <form method="POST" action="projects.php" enctype="multipart/form-data" class="space-y-6">
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" value="<?= $editProject['id'] ?? 0 ?>">
        <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Title -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Project Title *</label>
            <input 
              type="text" 
              name="title" 
              value="<?= htmlspecialchars($editProject['title'] ?? '') ?>" 
              required 
              placeholder="e.g. Skyline Pinnacle Commercial Tower"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <!-- Slug -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">URL Slug (Auto-generated if empty)</label>
            <input 
              type="text" 
              name="slug" 
              value="<?= htmlspecialchars($editProject['slug'] ?? '') ?>" 
              placeholder="e.g. skyline-pinnacle-tower"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <!-- Category -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Category *</label>
            <select name="category" class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all">
              <?php foreach (['Residential', 'Commercial', 'Architecture', 'Interior', 'Turnkey'] as $cat): ?>
                <option value="<?= $cat ?>" <?= ($editProject['category'] ?? '') === $cat ? 'selected' : '' ?>><?= $cat ?></option>
              <?php endforeach; ?>
            </select>
          </div>

          <!-- Location -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Location *</label>
            <input 
              type="text" 
              name="location" 
              value="<?= htmlspecialchars($editProject['location'] ?? '') ?>" 
              required 
              placeholder="e.g. Gomti Nagar Extension, Lucknow"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <!-- Area SQFT -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Area Built-Up</label>
            <input 
              type="text" 
              name="area" 
              value="<?= htmlspecialchars($editProject['area'] ?? '') ?>" 
              placeholder="e.g. 125,000 SQFT"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <!-- Client -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Client / Developer</label>
            <input 
              type="text" 
              name="client" 
              value="<?= htmlspecialchars($editProject['client'] ?? 'Private Client') ?>" 
              placeholder="e.g. Apex Global Enterprises"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <!-- Status & Progress -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Status</label>
              <select name="status" class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-3 py-3 text-xs text-slate-800 font-mono outline-none">
                <option value="ONGOING" <?= ($editProject['status'] ?? '') === 'ONGOING' ? 'selected' : '' ?>>ONGOING</option>
                <option value="COMPLETED" <?= ($editProject['status'] ?? '') === 'COMPLETED' ? 'selected' : '' ?>>COMPLETED</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Progress %</label>
              <input 
                type="number" 
                name="progress" 
                min="0" 
                max="100" 
                value="<?= htmlspecialchars($editProject['progress'] ?? 100) ?>" 
                class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-3 py-3 text-xs text-slate-800 font-mono outline-none"
              >
            </div>
          </div>

          <!-- Year -->
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Completion Year</label>
            <input 
              type="number" 
              name="year" 
              value="<?= htmlspecialchars($editProject['year'] ?? date('Y')) ?>" 
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none"
            >
          </div>
        </div>

        <!-- Cover Image -->
        <div class="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
          <label class="block text-xs font-mono text-[#F48033] uppercase tracking-wider font-bold">Cover Image (Direct URL or File Upload)</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span class="text-[11px] font-mono text-slate-500 block mb-1">Image URL (Unsplash or direct link):</span>
              <input 
                type="text" 
                name="cover_image_url" 
                value="<?= htmlspecialchars($editProject['cover_image'] ?? '') ?>" 
                placeholder="https://images.unsplash.com/..."
                class="w-full bg-white border border-slate-200 focus:border-[#F48033] rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono outline-none"
              >
            </div>
            <div>
              <span class="text-[11px] font-mono text-slate-500 block mb-1">Or Upload Image File (JPG, PNG, WebP):</span>
              <input 
                type="file" 
                name="cover_image_file" 
                accept="image/*"
                class="w-full text-xs font-mono text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-orange-50 file:text-[#F48033] hover:file:bg-orange-100"
              >
            </div>
          </div>
          <?php if (!empty($editProject['cover_image'])): ?>
            <div class="flex items-center space-x-3 pt-2">
              <span class="text-xs font-mono text-slate-500">Current Preview:</span>
              <img src="<?= (strpos($editProject['cover_image'], 'http') === 0 ? '' : '../') . htmlspecialchars($editProject['cover_image']) ?>" class="w-20 h-14 object-cover rounded-xl border border-slate-200 shadow-sm">
            </div>
          <?php endif; ?>
        </div>

        <!-- Gallery URLs & File Uploads -->
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Gallery Image URLs (One URL per line)</label>
            <?php 
              $galleryArr = json_decode($editProject['gallery'] ?? '[]', true) ?: [];
              $galleryText = implode("\n", $galleryArr);
            ?>
            <textarea 
              name="gallery" 
              rows="3" 
              placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl p-3 text-xs text-slate-800 font-mono outline-none"
            ><?= htmlspecialchars($galleryText) ?></textarea>
          </div>
          <div>
            <label class="block text-xs font-mono text-[#F48033] uppercase tracking-wider mb-1 font-bold">Or Upload Additional Gallery Photos (Auto-Converted to WebP)</label>
            <input 
              type="file" 
              name="gallery_files[]" 
              multiple 
              accept="image/*"
              class="w-full text-xs font-mono text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-orange-50 file:text-[#F48033] hover:file:bg-orange-100"
            >
          </div>
        </div>

        <!-- Technical Specifications / Features -->
        <div>
          <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Technical Specifications (One item per line)</label>
          <?php 
            $featuresArr = json_decode($editProject['features'] ?? '[]', true) ?: [];
            $featuresText = implode("\n", $featuresArr);
          ?>
          <textarea 
            name="features" 
            rows="3" 
            placeholder="Post-Tensioned Structural Concrete Core&#10;Double-Glazed Low-E Curtain Wall&#10;High-Speed Regenerative Elevators"
            class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl p-3 text-xs text-slate-800 font-mono outline-none"
          ><?= htmlspecialchars($featuresText) ?></textarea>
        </div>

        <!-- Descriptions -->
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Short Teaser Description</label>
            <input 
              type="text" 
              name="short_description" 
              value="<?= htmlspecialchars($editProject['short_description'] ?? '') ?>" 
              placeholder="Brief summary displayed on cards"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none"
            >
          </div>
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Full Project Narrative *</label>
            <textarea 
              name="description" 
              rows="4" 
              required
              placeholder="Detailed architectural and structural engineering narrative..."
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl p-3 text-xs text-slate-800 font-mono outline-none"
            ><?= htmlspecialchars($editProject['description'] ?? '') ?></textarea>
          </div>
        </div>

        <!-- Published Flag -->
        <div class="flex items-center space-x-3">
          <input 
            type="checkbox" 
            id="published" 
            name="published" 
            value="1" 
            <?= ($editProject['published'] ?? 1) ? 'checked' : '' ?>
            class="w-4 h-4 rounded text-[#F48033] border-slate-300 focus:ring-[#F48033]"
          >
          <label for="published" class="text-xs font-mono text-slate-700 cursor-pointer font-bold uppercase">Publish live on public portfolio</label>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center space-x-4">
          <button 
            type="submit" 
            class="px-6 py-3 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <?= $action === 'edit' ? 'Save Changes' : 'Publish Project' ?>
          </button>
          <a href="projects.php" class="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-mono text-xs uppercase tracking-wider rounded-xl">
            Cancel
          </a>
        </div>
      </form>
    </div>

  <?php else: ?>
    <!-- Projects Cards / Table List in Clean UIUX Layout -->
    <?php 
      $projects = $db->query("SELECT * FROM projects ORDER BY sort_order ASC, id DESC")->fetchAll();
    ?>

    <div class="space-y-4">
      <?php if (empty($projects)): ?>
        <div class="py-12 text-center text-slate-400 text-sm font-mono">
          No projects found in database. Click "+ Release Project" above to create one.
        </div>
      <?php else: ?>
        <?php foreach ($projects as $proj): ?>
          <?php 
            $imgSrc = (strpos($proj['cover_image'], 'http') === 0) ? $proj['cover_image'] : '../' . $proj['cover_image'];
          ?>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow bg-white gap-3.5 sm:gap-4 w-full overflow-hidden">
            <div class="flex items-start sm:items-center gap-3.5 sm:gap-4 w-full min-w-0 flex-1">
              <!-- Thumbnail with cover (Square on mobile, rectangular on desktop) -->
              <div class="w-20 h-20 sm:w-36 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-2xs border border-slate-100 relative group">
                <img src="<?= htmlspecialchars($imgSrc) ?>" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <span class="absolute bottom-1 right-1 text-[8px] sm:text-[9px] font-mono px-1 sm:px-1.5 py-0.5 rounded bg-black/70 text-white font-bold">
                  <?= htmlspecialchars($proj['category']) ?>
                </span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-1.5 mb-0.5">
                  <h4 class="text-sm sm:text-[15px] font-bold text-slate-800 truncate"><?= htmlspecialchars($proj['title']) ?></h4>
                  <span class="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold <?= $proj['status'] === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-orange-50 text-[#F48033] border border-orange-200' ?>">
                    <?= htmlspecialchars($proj['status']) ?>
                  </span>
                </div>
                <p class="text-xs text-slate-500 truncate"><?= htmlspecialchars($proj['location']) ?> • <?= htmlspecialchars($proj['area'] ?: 'Custom SQFT') ?></p>
                
                <!-- Progress bar snippet -->
                <div class="flex items-center space-x-2 mt-1.5">
                  <div class="w-20 sm:w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-[#F48033] h-full" style="width: <?= (int)$proj['progress'] ?>%"></div>
                  </div>
                  <span class="text-[10px] font-mono text-slate-400"><?= (int)$proj['progress'] ?>% Complete</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end space-x-2 shrink-0 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <a href="projects.php?action=edit&id=<?= $proj['id'] ?>" class="px-4 py-1.5 border border-[#F48033] text-[#F48033] rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors">
                Edit
              </a>
              <form method="POST" action="projects.php" onsubmit="return confirm('Delete project ' + <?= json_encode($proj['title']) ?> + '?');" class="inline">
                <input type="hidden" name="action" value="delete">
                <input type="hidden" name="id" value="<?= $proj['id'] ?>">
                <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">
                <button type="submit" class="px-4 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                  Delete
                </button>
              </form>
            </div>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>

  <?php endif; ?>

</div>

<?php require_once __DIR__ . '/footer.php'; ?>
