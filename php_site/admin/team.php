<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — CMS TEAM MEMBERS MANAGEMENT (UIUX WINDOWS)
// ==========================================================
require_once __DIR__ . '/auth.php';
requireAdminAuth();

$db = getDb();
if (!$db) {
    die("Database connection failed.");
}

$action = $_GET['action'] ?? 'list';
$editId = (int)($_GET['id'] ?? 0);

// Handle Delete Team Member
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: team.php');
        exit();
    }

    $id = (int)($_POST['id'] ?? 0);
    if ($id > 0) {
        $stmtOld = $db->prepare("SELECT image FROM team_members WHERE id = ? LIMIT 1");
        $stmtOld->execute([$id]);
        $oldImg = $stmtOld->fetchColumn();
        if ($oldImg) {
            cleanOldUpload($oldImg);
        }
        $stmt = $db->prepare("DELETE FROM team_members WHERE id = ?");
        $stmt->execute([$id]);
        setFlash('success', 'Team member deleted.');
    }
    header('Location: team.php');
    exit();
}

// Handle Save (Create or Update)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: team.php');
        exit();
    }

    $id             = (int)($_POST['id'] ?? 0);
    $name           = cleanInput($_POST['name'] ?? '');
    $role           = cleanInput($_POST['role'] ?? '');
    $category       = in_array($_POST['category'] ?? '', ['MANAGEMENT', 'EMPLOYEE']) ? $_POST['category'] : 'EMPLOYEE';
    $highlightBadge = cleanInput($_POST['highlight_badge'] ?? '') ?: null;
    $tagline        = cleanInput($_POST['tagline'] ?? '') ?: null;
    $imageUrl       = cleanInput($_POST['image_url'] ?? '', false);
    $sortOrder      = (int)($_POST['sort_order'] ?? 0);
    $published      = isset($_POST['published']) ? 1 : 0;

    // Handle Image file upload with automated WebP conversion
    if (!empty($_FILES['image_file']['name'])) {
        $nameSlug = preg_replace('/[^a-zA-Z0-9_-]/', '-', strtolower($name));
        $convertedImage = saveAndConvertToWebP($_FILES['image_file'], 'team', $nameSlug, 82);
        if ($convertedImage) {
            if ($id > 0) {
                $stmtOld = $db->prepare("SELECT image FROM team_members WHERE id = ? LIMIT 1");
                $stmtOld->execute([$id]);
                $oldImg = $stmtOld->fetchColumn();
                if ($oldImg && $oldImg !== $convertedImage) {
                    cleanOldUpload($oldImg);
                }
            }
            $imageUrl = $convertedImage;
        }
    }

    if (empty($name) || empty($role) || empty($imageUrl)) {
        setFlash('error', 'Name, Role, and Profile Photo are required.');
        header('Location: team.php' . ($id > 0 ? "?action=edit&id={$id}" : '?action=new'));
        exit();
    }

    if ($id > 0) {
        $stmt = $db->prepare("
            UPDATE team_members SET 
                name = ?, role = ?, category = ?, image = ?, 
                highlight_badge = ?, tagline = ?, sort_order = ?, published = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $name, $role, $category, $imageUrl,
            $highlightBadge, $tagline, $sortOrder, $published, $id
        ]);
        setFlash('success', 'Team member updated successfully with WebP conversion.');
    } else {
        $stmt = $db->prepare("
            INSERT INTO team_members (name, role, category, image, highlight_badge, tagline, sort_order, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $name, $role, $category, $imageUrl,
            $highlightBadge, $tagline, $sortOrder, $published
        ]);
        setFlash('success', 'New team member added.');
    }

    header('Location: team.php');
    exit();
}

// Fetch member for editing
$editMember = null;
if (($action === 'edit') && $editId > 0) {
    $stmt = $db->prepare("SELECT * FROM team_members WHERE id = ? LIMIT 1");
    $stmt->execute([$editId]);
    $editMember = $stmt->fetch();
}

$pageTitle = 'Manage Team Members';
$activePage = 'team';
require_once __DIR__ . '/header.php';
?>

<!-- Tabbed Interface Section matching UIUX Windows Layout -->
<div class="bg-white rounded-2xl sm:rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-4 sm:p-6 md:p-8 space-y-6">

  <!-- Header Action Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
    <div>
      <h2 class="text-xl font-bold text-slate-800 tracking-tight font-mono">TEAM DIRECTORY CMS</h2>
      <p class="text-xs text-slate-500 mt-0.5">Manage executive leadership and site engineering personnel profiles.</p>
    </div>
    <div class="flex items-center space-x-3">
      <?php if ($action === 'list'): ?>
        <a href="team.php?action=new" class="px-5 py-2.5 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] hover:opacity-95 text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center space-x-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span>Add Member</span>
        </a>
      <?php else: ?>
        <a href="team.php" class="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-mono text-xs uppercase tracking-wider rounded-xl transition-all">
          ← Back to List
        </a>
      <?php endif; ?>
    </div>
  </div>

  <?php if ($action === 'new' || $action === 'edit'): ?>
    <!-- Add / Edit Member Form -->
    <div class="max-w-3xl">
      <h3 class="text-sm font-bold font-mono text-slate-700 uppercase tracking-wider mb-6">
        <?= $action === 'edit' ? 'Edit Member: ' . htmlspecialchars($editMember['name']) : 'Add New Team Member' ?>
      </h3>

      <form method="POST" action="team.php" enctype="multipart/form-data" class="space-y-6">
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="id" value="<?= $editMember['id'] ?? 0 ?>">
        <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Full Name *</label>
            <input 
              type="text" 
              name="name" 
              value="<?= htmlspecialchars($editMember['name'] ?? '') ?>" 
              required 
              placeholder="e.g. Tony Stark"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Designation / Role *</label>
            <input 
              type="text" 
              name="role" 
              value="<?= htmlspecialchars($editMember['role'] ?? '') ?>" 
              required 
              placeholder="e.g. Founder & CEO or Lead Structural Engineer"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Category *</label>
            <select name="category" class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all">
              <option value="MANAGEMENT" <?= ($editMember['category'] ?? '') === 'MANAGEMENT' ? 'selected' : '' ?>>MANAGEMENT (Executive Leadership)</option>
              <option value="EMPLOYEE" <?= ($editMember['category'] ?? 'EMPLOYEE') === 'EMPLOYEE' ? 'selected' : '' ?>>EMPLOYEE (Engineering & Staff)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Highlight Badge (Optional)</label>
            <input 
              type="text" 
              name="highlight_badge" 
              value="<?= htmlspecialchars($editMember['highlight_badge'] ?? '') ?>" 
              placeholder="e.g. FOUNDER & CEO, CO-FOUNDER"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Display Sort Order</label>
            <input 
              type="number" 
              name="sort_order" 
              value="<?= htmlspecialchars($editMember['sort_order'] ?? 0) ?>" 
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>
        </div>

        <!-- Photo Section -->
        <div class="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
          <label class="block text-xs font-mono text-[#F48033] uppercase tracking-wider font-bold">Profile Photo (Direct URL or File Upload)</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span class="text-[11px] font-mono text-slate-500 block mb-1">Image URL (Direct link):</span>
              <input 
                type="text" 
                name="image_url" 
                value="<?= htmlspecialchars($editMember['image'] ?? '') ?>" 
                placeholder="https://images.unsplash.com/..."
                class="w-full bg-white border border-slate-200 focus:border-[#F48033] rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono outline-none"
              >
            </div>
            <div>
              <span class="text-[11px] font-mono text-slate-500 block mb-1">Or Upload Photo File:</span>
              <input 
                type="file" 
                name="image_file" 
                accept="image/*"
                class="w-full text-xs font-mono text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-orange-50 file:text-[#F48033] hover:file:bg-orange-100"
              >
            </div>
          </div>
          <?php if (!empty($editMember['image'])): ?>
            <div class="flex items-center space-x-3 pt-2">
              <span class="text-xs font-mono text-slate-500">Current Preview:</span>
              <img src="<?= (strpos($editMember['image'], 'http') === 0 ? '' : '../') . htmlspecialchars($editMember['image']) ?>" class="w-12 h-12 object-cover rounded-full border border-slate-200 shadow-sm">
            </div>
          <?php endif; ?>
        </div>

        <!-- Tagline / Bio -->
        <div>
          <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Tagline / Narrative</label>
          <textarea 
            name="tagline" 
            rows="3" 
            placeholder="Specialist in heavy RCC foundations, seismic engineering, and architectural design..."
            class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl p-3 text-xs text-slate-800 font-mono outline-none"
          ><?= htmlspecialchars($editMember['tagline'] ?? '') ?></textarea>
        </div>

        <!-- Published -->
        <div class="flex items-center space-x-3">
          <input 
            type="checkbox" 
            id="published" 
            name="published" 
            value="1" 
            <?= ($editMember['published'] ?? 1) ? 'checked' : '' ?>
            class="w-4 h-4 rounded text-[#F48033] border-slate-300 focus:ring-[#F48033]"
          >
          <label for="published" class="text-xs font-mono text-slate-700 cursor-pointer font-bold uppercase">Visible on public Team section</label>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center space-x-4">
          <button 
            type="submit" 
            class="px-6 py-3 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <?= $action === 'edit' ? 'Save Changes' : 'Create Member' ?>
          </button>
          <a href="team.php" class="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-mono text-xs uppercase tracking-wider rounded-xl">
            Cancel
          </a>
        </div>
      </form>
    </div>

  <?php else: ?>
    <!-- Team Members List in Clean UIUX Layout -->
    <?php 
      $members = $db->query("SELECT * FROM team_members ORDER BY category ASC, sort_order ASC, id ASC")->fetchAll();
    ?>

    <div class="space-y-4">
      <?php if (empty($members)): ?>
        <div class="py-12 text-center text-slate-400 text-sm font-mono">
          No team members configured yet. Click "+ Add Member" above to create one.
        </div>
      <?php else: ?>
        <?php foreach ($members as $m): ?>
          <?php 
            $imgSrc = (strpos($m['image'], 'http') === 0) ? $m['image'] : '../' . $m['image'];
          ?>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow bg-white gap-3.5 sm:gap-4 w-full overflow-hidden">
            <div class="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 w-full min-w-0">
              <!-- Avatar Circle -->
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-slate-100 shrink-0 shadow-2xs border border-slate-200 relative">
                <img src="<?= htmlspecialchars($imgSrc) ?>" alt="" class="w-full h-full object-cover">
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-1.5 mb-0.5">
                  <h4 class="text-sm sm:text-[15px] font-bold text-slate-800 truncate"><?= htmlspecialchars($m['name']) ?></h4>
                  <?php if (!empty($m['highlight_badge'])): ?>
                    <span class="text-[8px] sm:text-[9px] bg-orange-50 text-[#F48033] border border-orange-200 px-2 py-0.5 rounded-full uppercase font-bold font-mono"><?= htmlspecialchars($m['highlight_badge']) ?></span>
                  <?php endif; ?>
                </div>
                <p class="text-xs text-slate-500 truncate"><?= htmlspecialchars($m['role']) ?> • <span class="uppercase font-mono text-[10px] <?= $m['category'] === 'MANAGEMENT' ? 'text-amber-600 font-bold' : 'text-blue-600' ?>"><?= htmlspecialchars($m['category']) ?></span></p>
                <?php if (!empty($m['tagline'])): ?>
                  <p class="text-[11px] text-slate-400 mt-1 italic truncate"><?= htmlspecialchars($m['tagline']) ?></p>
                <?php endif; ?>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end space-x-2 shrink-0 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <a href="team.php?action=edit&id=<?= $m['id'] ?>" class="px-4 py-1.5 border border-[#F48033] text-[#F48033] rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors">
                Edit
              </a>
              <form method="POST" action="team.php" onsubmit="return confirm('Delete ' + <?= json_encode($m['name']) ?> + '?');" class="inline">
                <input type="hidden" name="action" value="delete">
                <input type="hidden" name="id" value="<?= $m['id'] ?>">
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
