<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — CMS TESTIMONIALS MANAGER (UIUX WINDOWS)
// ==========================================================
require_once __DIR__ . '/auth.php';
requireAdminAuth();

$db = getDb();
if (!$db) {
    die("Database connection failed.");
}

// Auto-initialize table if needed
try {
    $db->exec("
        CREATE TABLE IF NOT EXISTS `testimonials` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `name` VARCHAR(255) NOT NULL,
          `role` VARCHAR(255) NOT NULL,
          `location` VARCHAR(255) DEFAULT 'Lucknow, UP',
          `project_type` VARCHAR(255) DEFAULT 'Luxury Villa Construction',
          `quote` TEXT NOT NULL,
          `rating` INT DEFAULT 5,
          `gender` VARCHAR(10) DEFAULT 'male',
          `photo` VARCHAR(500) DEFAULT NULL,
          `sort_order` INT DEFAULT 0,
          `published` TINYINT(1) DEFAULT 1,
          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
} catch (Exception $e) {}

$action = $_GET['action'] ?? 'list';
$editId = (int)($_GET['id'] ?? 0);

// 1. Handle Delete Action
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: testimonials.php');
        exit();
    }

    $id = (int)($_POST['id'] ?? 0);
    if ($id > 0) {
        $stmtOld = $db->prepare("SELECT photo FROM testimonials WHERE id = ? LIMIT 1");
        $stmtOld->execute([$id]);
        $oldPhoto = $stmtOld->fetchColumn();
        if ($oldPhoto) {
            cleanOldUpload($oldPhoto);
        }
        $stmt = $db->prepare("DELETE FROM testimonials WHERE id = ?");
        $stmt->execute([$id]);
        setFlash('success', 'Testimonial deleted successfully.');
    }
    header('Location: testimonials.php');
    exit();
}

// 2. Handle Save (Create or Edit)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: testimonials.php');
        exit();
    }

    $id          = (int)($_POST['id'] ?? 0);
    $name        = cleanInput($_POST['name'] ?? '');
    $role        = cleanInput($_POST['role'] ?? '');
    $location    = cleanInput($_POST['location'] ?? '') ?: 'Lucknow, UP';
    $projectType = cleanInput($_POST['project_type'] ?? '') ?: 'Turnkey Project';
    $quote       = cleanInput($_POST['quote'] ?? '');
    $rating      = (int)($_POST['rating'] ?? 5);
    if ($rating < 1 || $rating > 5) $rating = 5;
    $gender      = in_array($_POST['gender'] ?? '', ['male', 'female']) ? $_POST['gender'] : 'male';
    $photoUrl    = cleanInput($_POST['photo_url'] ?? '', false);
    $sortOrder   = (int)($_POST['sort_order'] ?? 0);
    $published   = isset($_POST['published']) ? 1 : 0;

    // Handle photo file upload with WebP conversion
    if (!empty($_FILES['photo_file']['name'])) {
        $nameSlug = preg_replace('/[^a-zA-Z0-9_-]/', '-', strtolower($name));
        $converted = saveAndConvertToWebP($_FILES['photo_file'], 'testimonials', $nameSlug, 82);
        if ($converted) {
            if ($id > 0) {
                $stmtOld = $db->prepare("SELECT photo FROM testimonials WHERE id = ? LIMIT 1");
                $stmtOld->execute([$id]);
                $oldPhoto = $stmtOld->fetchColumn();
                if ($oldPhoto && $oldPhoto !== $converted) {
                    cleanOldUpload($oldPhoto);
                }
            }
            $photoUrl = $converted;
        }
    }

    if (empty($name) || empty($role) || empty($quote)) {
        setFlash('error', 'Client Name, Role/Designation, and Testimonial Quote are required.');
        header('Location: testimonials.php' . ($id > 0 ? "?action=edit&id={$id}" : '?action=new'));
        exit();
    }

    if ($id > 0) {
        $stmt = $db->prepare("
            UPDATE testimonials SET 
                name = ?, role = ?, location = ?, project_type = ?, 
                quote = ?, rating = ?, gender = ?, photo = ?, sort_order = ?, published = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $name, $role, $location, $projectType,
            $quote, $rating, $gender, $photoUrl ?: null, $sortOrder, $published, $id
        ]);
        setFlash('success', 'Testimonial updated successfully.');
    } else {
        $stmt = $db->prepare("
            INSERT INTO testimonials (name, role, location, project_type, quote, rating, gender, photo, sort_order, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $name, $role, $location, $projectType,
            $quote, $rating, $gender, $photoUrl ?: null, $sortOrder, $published
        ]);
        setFlash('success', 'New client testimonial published successfully.');
    }

    header('Location: testimonials.php');
    exit();
}

// 3. Load record if editing
$editItem = null;
if ($action === 'edit' && $editId > 0) {
    $stmt = $db->prepare("SELECT * FROM testimonials WHERE id = ? LIMIT 1");
    $stmt->execute([$editId]);
    $editItem = $stmt->fetch();
    if (!$editItem) {
        setFlash('error', 'Testimonial not found.');
        header('Location: testimonials.php');
        exit();
    }
}

// 4. Fetch metrics and testimonials list
$totalCount = (int)$db->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
$fiveStars  = (int)$db->query("SELECT COUNT(*) FROM testimonials WHERE rating = 5")->fetchColumn();
$publishedCount = (int)$db->query("SELECT COUNT(*) FROM testimonials WHERE published = 1")->fetchColumn();
$avgRating  = $db->query("SELECT ROUND(AVG(rating), 1) FROM testimonials")->fetchColumn() ?: 5.0;

$testimonials = $db->query("SELECT * FROM testimonials ORDER BY sort_order ASC, id ASC")->fetchAll();

$pageTitle = 'Testimonials Manager';
$activePage = 'testimonials';
require_once __DIR__ . '/header.php';
?>

<div class="space-y-6">

  <?php if ($action === 'new' || $action === 'edit'): ?>
    <!-- ========================================================
         CREATE / EDIT FORM VIEW
    ======================================================== -->
    <div class="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-8 space-y-6">
      
      <div class="flex items-center justify-between pb-5 border-b border-slate-100">
        <div>
          <a href="testimonials.php" class="inline-flex items-center text-xs font-mono text-slate-500 hover:text-[#F48033] mb-1.5 transition-colors">
            ← Back to Testimonials List
          </a>
          <h2 class="text-xl font-bold text-slate-800 tracking-tight font-mono uppercase">
            <?= $action === 'edit' ? 'EDIT CLIENT TESTIMONIAL' : 'ADD NEW CLIENT TESTIMONIAL' ?>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">Showcase real client experiences, villa feedback, and project reviews on the live website.</p>
        </div>
      </div>

      <form method="POST" action="testimonials.php" enctype="multipart/form-data" class="space-y-6">
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" value="<?= (int)($editItem['id'] ?? 0) ?>">
        <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <!-- Left Fields Column -->
          <div class="lg:col-span-8 space-y-5">
            
            <!-- Client Name & Role Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-mono text-slate-700 uppercase tracking-wider mb-1.5 font-bold">
                  Client Full Name *
                </label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value="<?= htmlspecialchars($editItem['name'] ?? '') ?>"
                  placeholder="e.g. Mr. Anoop Shukla"
                  id="inputName"
                  oninput="updatePreview()"
                  class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
                >
              </div>

              <div>
                <label class="block text-xs font-mono text-slate-700 uppercase tracking-wider mb-1.5 font-bold">
                  Role / Designation *
                </label>
                <input 
                  type="text" 
                  name="role" 
                  required 
                  value="<?= htmlspecialchars($editItem['role'] ?? '') ?>"
                  placeholder="e.g. Employed at Secretariat Lucknow"
                  id="inputRole"
                  oninput="updatePreview()"
                  class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
                >
              </div>
            </div>

            <!-- Location & Project Type Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-mono text-slate-700 uppercase tracking-wider mb-1.5 font-bold">
                  City / Location
                </label>
                <input 
                  type="text" 
                  name="location" 
                  value="<?= htmlspecialchars($editItem['location'] ?? 'Lucknow, UP') ?>"
                  placeholder="e.g. Lucknow, UP or Sultanpur"
                  class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
                >
              </div>

              <div>
                <label class="block text-xs font-mono text-slate-700 uppercase tracking-wider mb-1.5 font-bold">
                  Project Type / Tag
                </label>
                <input 
                  type="text" 
                  name="project_type" 
                  value="<?= htmlspecialchars($editItem['project_type'] ?? 'Luxury Villa Construction') ?>"
                  placeholder="e.g. Luxury Villa, Turnkey Residential"
                  id="inputProjType"
                  oninput="updatePreview()"
                  class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
                >
              </div>
            </div>

            <!-- Star Rating & Gender Avatar Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-mono text-slate-700 uppercase tracking-wider mb-1.5 font-bold">
                  Star Rating (1 to 5) *
                </label>
                <select 
                  name="rating" 
                  id="inputRating"
                  onchange="updatePreview()"
                  class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all cursor-pointer"
                >
                  <?php $curRating = (int)($editItem['rating'] ?? 5); ?>
                  <option value="5" <?= $curRating === 5 ? 'selected' : '' ?>>⭐⭐⭐⭐⭐ (5 Stars - Exceptional)</option>
                  <option value="4" <?= $curRating === 4 ? 'selected' : '' ?>>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                  <option value="3" <?= $curRating === 3 ? 'selected' : '' ?>>⭐⭐⭐ (3 Stars - Good)</option>
                  <option value="2" <?= $curRating === 2 ? 'selected' : '' ?>>⭐⭐ (2 Stars - Fair)</option>
                  <option value="1" <?= $curRating === 1 ? 'selected' : '' ?>>⭐ (1 Star)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-mono text-slate-700 uppercase tracking-wider mb-1.5 font-bold">
                  Avatar Gender Theme
                </label>
                <div class="flex items-center space-x-3 pt-1">
                  <?php $curGender = $editItem['gender'] ?? 'male'; ?>
                  <label class="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input type="radio" name="gender" value="male" <?= $curGender === 'male' ? 'checked' : '' ?> onchange="updatePreview()" class="text-[#F48033] focus:ring-[#F48033]">
                    <span class="text-xs font-mono font-bold text-slate-700">👨 Male Avatar</span>
                  </label>

                  <label class="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input type="radio" name="gender" value="female" <?= $curGender === 'female' ? 'checked' : '' ?> onchange="updatePreview()" class="text-[#F48033] focus:ring-[#F48033]">
                    <span class="text-xs font-mono font-bold text-slate-700">👩 Female Avatar</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Testimonial Quote -->
            <div>
              <label class="block text-xs font-mono text-slate-700 uppercase tracking-wider mb-1.5 font-bold">
                Testimonial Quote / Review Text *
              </label>
              <textarea 
                name="quote" 
                rows="4" 
                required 
                id="inputQuote"
                oninput="updatePreview()"
                placeholder="Describe the client's feedback regarding structural precision, on-time delivery, finishing quality..."
                class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl p-4 text-xs text-slate-800 font-mono outline-none transition-all"
              ><?= htmlspecialchars($editItem['quote'] ?? '') ?></textarea>
              <span class="text-[10px] text-slate-400 mt-1 block">Aim for 2–4 sentences describing their experience with PERSQFT.</span>
            </div>

            <!-- Client Photo Upload (Optional) -->
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <label class="block text-xs font-mono text-slate-700 uppercase tracking-wider font-bold">
                Client Photo / Headshot (Optional)
              </label>
              <p class="text-[11px] text-slate-500">
                If omitted, the luxury male/female vector avatar matching the site design will be displayed automatically.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span class="text-[10px] font-mono text-slate-400 block mb-1">Upload Photo (Auto WebP Conversion):</span>
                  <input 
                    type="file" 
                    name="photo_file" 
                    accept="image/*"
                    class="text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-white file:text-slate-700 hover:file:bg-slate-100 cursor-pointer border border-slate-200 rounded-lg w-full bg-white p-1"
                  >
                </div>

                <div>
                  <span class="text-[10px] font-mono text-slate-400 block mb-1">Or Existing Image URL:</span>
                  <input 
                    type="text" 
                    name="photo_url" 
                    value="<?= htmlspecialchars($editItem['photo'] ?? '') ?>"
                    placeholder="https://... or uploads/testimonials/..."
                    class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono outline-none"
                  >
                </div>
              </div>
            </div>

            <!-- Sort Order & Published -->
            <div class="flex items-center space-x-6 pt-2">
              <div class="w-32">
                <label class="block text-xs font-mono text-slate-700 uppercase tracking-wider mb-1 font-bold">
                  Display Order
                </label>
                <input 
                  type="number" 
                  name="sort_order" 
                  value="<?= (int)($editItem['sort_order'] ?? 0) ?>"
                  class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] rounded-xl px-3 py-2.5 text-xs text-slate-800 font-mono"
                >
              </div>

              <div class="pt-5">
                <label class="flex items-center space-x-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="published" 
                    value="1" 
                    <?= (!isset($editItem) || !empty($editItem['published'])) ? 'checked' : '' ?>
                    class="w-4 h-4 rounded text-[#F48033] focus:ring-[#F48033]"
                  >
                  <span class="text-xs font-mono font-bold text-slate-800">Publish on Live Website</span>
                </label>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex items-center space-x-4 pt-4 border-t border-slate-100">
              <button 
                type="submit" 
                class="px-7 py-3 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] hover:from-[#f37f2e] hover:to-[#e07028] text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/25 cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <?= $action === 'edit' ? 'Update Testimonial' : 'Save & Publish Testimonial' ?>
              </button>

              <a 
                href="testimonials.php" 
                class="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-mono text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </a>
            </div>

          </div>

          <!-- Right Live Card Preview Column -->
          <div class="lg:col-span-4 space-y-3">
            <span class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Live Card Mockup Preview
            </span>

            <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
              <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#FF8F3D] to-[#F48033]"></div>

              <div>
                <!-- Rating and Project Tag -->
                <div class="flex items-center justify-between mb-4">
                  <div id="previewStars" class="flex items-center space-x-1 text-[#F48033] text-sm">
                    ★★★★★
                  </div>

                  <span id="previewTag" class="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60 truncate max-w-[120px]">
                    <?= htmlspecialchars($editItem['project_type'] ?? 'Luxury Villa Construction') ?>
                  </span>
                </div>

                <!-- Quote Text -->
                <p id="previewQuote" class="text-slate-700 text-xs leading-relaxed font-sans italic mb-6">
                  "<?= htmlspecialchars($editItem['quote'] ?? 'PERSQFT Construction delivered with pristine craftsmanship. We highly recommend them.') ?>"
                </p>
              </div>

              <!-- Client Info Footer -->
              <div class="flex items-center space-x-3 pt-3 border-t border-slate-100">
                <div id="previewAvatarBox" class="w-10 h-10 rounded-full bg-gradient-to-br from-[#080E1A] to-[#1E293B] text-white flex items-center justify-center border-2 border-[#F48033]/40 shadow-xs shrink-0 font-bold text-xs font-mono">
                  👨
                </div>
                <div class="overflow-hidden">
                  <h5 id="previewClientName" class="font-heading text-xs font-bold text-slate-900 truncate">
                    <?= htmlspecialchars($editItem['name'] ?? 'Mr. Anoop Shukla') ?>
                  </h5>
                  <p id="previewClientRole" class="text-slate-500 text-[11px] font-normal truncate">
                    <?= htmlspecialchars($editItem['role'] ?? 'Employed at Secretariat Lucknow') ?>
                  </p>
                </div>
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-orange-50 border border-orange-100 text-[11px] text-slate-600 space-y-1">
              <span class="font-bold text-[#F48033] block">💡 Tip:</span>
              <p>Testimonials are automatically arranged in an infinite carousel slider on the homepage. Top priority is given to the display order number.</p>
            </div>
          </div>

        </div>
      </form>
    </div>

    <script>
    function updatePreview() {
      const name = document.getElementById('inputName').value.trim() || 'Client Name';
      const role = document.getElementById('inputRole').value.trim() || 'Client Role / City';
      const proj = document.getElementById('inputProjType').value.trim() || 'Turnkey Project';
      const quote = document.getElementById('inputQuote').value.trim() || 'Testimonial quote content will appear here...';
      const rating = parseInt(document.getElementById('inputRating').value) || 5;

      const isFemale = document.querySelector('input[name="gender"]:checked')?.value === 'female';

      document.getElementById('previewClientName').textContent = name;
      document.getElementById('previewClientRole').textContent = role;
      document.getElementById('previewTag').textContent = proj;
      document.getElementById('previewQuote').textContent = `"${quote}"`;
      document.getElementById('previewStars').textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);

      const avatarBox = document.getElementById('previewAvatarBox');
      if (isFemale) {
        avatarBox.className = "w-10 h-10 rounded-full bg-gradient-to-br from-[#F48033] to-[#d96a20] text-white flex items-center justify-center border-2 border-orange-300/60 shadow-xs shrink-0 font-bold text-xs font-mono";
        avatarBox.textContent = '👩';
      } else {
        avatarBox.className = "w-10 h-10 rounded-full bg-gradient-to-br from-[#080E1A] to-[#1E293B] text-white flex items-center justify-center border-2 border-[#F48033]/40 shadow-xs shrink-0 font-bold text-xs font-mono";
        avatarBox.textContent = '👨';
      }
    }
    </script>

  <?php else: ?>
    <!-- ========================================================
         LIST VIEW: METRIC CARDS & TESTIMONIALS ROSTER
    ======================================================== -->
    <div class="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-8">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div class="flex items-center space-x-2 mb-1">
            <span class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-50 text-[#F48033] border border-orange-200 uppercase">
              <span class="w-1.5 h-1.5 rounded-full bg-[#F48033] animate-pulse"></span>
              <span>Client Feedback Engine</span>
            </span>
          </div>
          <h2 class="text-xl font-bold text-slate-800 tracking-tight font-mono uppercase">CLIENT TESTIMONIALS & REVIEWS</h2>
          <p class="text-xs text-slate-500 mt-0.5">Manage verified reviews, client ratings, and architectural feedback displayed in the website carousel.</p>
        </div>

        <a 
          href="testimonials.php?action=new" 
          class="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] hover:from-[#f37f2e] hover:to-[#e07028] text-white font-mono text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer shrink-0 transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span>Add New Testimonial</span>
        </a>
      </div>

      <!-- Live Metric Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
        
        <!-- Total Reviews -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <span class="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Reviews</span>
            <span class="text-2xl sm:text-3xl font-black text-slate-800 font-mono"><?= $totalCount ?></span>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-mono text-lg sm:text-xl shrink-0">
            💬
          </div>
        </div>

        <!-- 5-Star Reviews -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <span class="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">5-Star Reviews</span>
            <span class="text-2xl sm:text-3xl font-black text-slate-800 font-mono"><?= $fiveStars ?></span>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-mono text-lg sm:text-xl shrink-0">
            ⭐
          </div>
        </div>

        <!-- Average Rating -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <span class="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">Avg Rating</span>
            <span class="text-2xl sm:text-3xl font-black text-[#F48033] font-mono"><?= $avgRating ?> / 5</span>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-50 text-[#F48033] flex items-center justify-center font-mono text-lg sm:text-xl shrink-0">
            🏆
          </div>
        </div>

        <!-- Published Live -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <span class="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">Active on Site</span>
            <span class="text-2xl sm:text-3xl font-black text-emerald-600 font-mono"><?= $publishedCount ?></span>
          </div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-mono text-lg sm:text-xl shrink-0">
            ✅
          </div>
        </div>

      </div>
    </div>

    <!-- Testimonials List Cards -->
    <div class="space-y-3">
      <?php if (empty($testimonials)): ?>
        <div class="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs font-mono border border-slate-100">
          No testimonials created yet. Click "+ Add New Testimonial" above to add your first client review.
        </div>
      <?php else: ?>
        <?php foreach ($testimonials as $t): ?>
          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <!-- Left Info Block -->
            <div class="flex items-start space-x-3.5 flex-1 min-w-0">
              
              <!-- Avatar / Photo -->
              <div class="relative shrink-0 mt-0.5">
                <?php if (!empty($t['photo'])): ?>
                  <img 
                    src="/<?= htmlspecialchars(ltrim($t['photo'], '/')) ?>" 
                    alt="<?= htmlspecialchars($t['name']) ?>" 
                    class="w-12 h-12 rounded-full object-cover border-2 border-orange-300 shadow-xs"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                  >
                  <div class="hidden w-12 h-12 rounded-full bg-slate-800 text-white items-center justify-center font-bold text-sm">
                    <?= htmlspecialchars(substr($t['name'], 0, 1)) ?>
                  </div>
                <?php elseif ($t['gender'] === 'female'): ?>
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#F48033] to-[#d96a20] text-white flex items-center justify-center border-2 border-orange-300 shadow-xs text-lg">
                    👩
                  </div>
                <?php else: ?>
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#080E1A] to-[#1E293B] text-white flex items-center justify-center border-2 border-[#F48033]/40 shadow-xs text-lg">
                    👨
                  </div>
                <?php endif; ?>
              </div>

              <!-- Text Details -->
              <div class="space-y-1 min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="font-heading font-bold text-sm text-slate-800 tracking-tight">
                    <?= htmlspecialchars($t['name']) ?>
                  </h4>
                  <span class="text-[10px] font-mono text-[#F48033] font-bold">
                    <?= str_repeat('★', (int)$t['rating']) ?>
                  </span>
                  <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-mono border border-slate-200/60">
                    <?= htmlspecialchars($t['project_type']) ?>
                  </span>
                  <?php if (!empty($t['published'])): ?>
                    <span class="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-mono font-bold border border-emerald-200">
                      Live
                    </span>
                  <?php else: ?>
                    <span class="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full text-[10px] font-mono">
                      Hidden
                    </span>
                  <?php endif; ?>
                </div>

                <p class="text-xs text-slate-500 font-mono leading-tight">
                  <?= htmlspecialchars($t['role']) ?> • <span class="text-slate-400"><?= htmlspecialchars($t['location']) ?></span>
                </p>

                <p class="text-xs text-slate-700 font-sans italic line-clamp-2 pt-0.5">
                  "<?= htmlspecialchars($t['quote']) ?>"
                </p>
              </div>

            </div>

            <!-- Right Action Buttons -->
            <div class="flex items-center space-x-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
              <a 
                href="testimonials.php?action=edit&id=<?= $t['id'] ?>"
                class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#F48033] hover:text-white text-slate-700 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                Edit
              </a>

              <form method="POST" action="testimonials.php" onsubmit="return confirm('Delete this review permanently?');" class="inline">
                <input type="hidden" name="action" value="delete">
                <input type="hidden" name="id" value="<?= $t['id'] ?>">
                <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">
                <button 
                  type="submit"
                  class="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-mono text-xs font-bold transition-all cursor-pointer"
                >
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
