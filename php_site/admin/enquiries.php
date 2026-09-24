<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — CMS ENQUIRIES PANEL (UIUX WINDOWS EDITION)
// ==========================================================
$pageTitle = 'Inquiries Panel';
$activePage = 'inquiries';
require_once __DIR__ . '/header.php';

$db = getDb();
if (!$db) {
    die("Database connection failed.");
}

// Handle Status Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_status') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: enquiries.php');
        exit();
    }

    $id = (int)($_POST['id'] ?? 0);
    $status = $_POST['status'] ?? 'PENDING';
    $validStatuses = ['PENDING', 'REVIEWED', 'CONTACTED', 'CLOSED'];

    if ($id > 0 && in_array($status, $validStatuses)) {
        $stmt = $db->prepare("UPDATE enquiries SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
        setFlash('success', "Status updated to {$status}.");
    }
    header('Location: enquiries.php' . (!empty($_GET['tab']) ? '?tab=' . urlencode($_GET['tab']) : ''));
    exit();
}

// Handle Delete
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: enquiries.php');
        exit();
    }

    $id = (int)($_POST['id'] ?? 0);
    if ($id > 0) {
        $stmtOld = $db->prepare("SELECT attachment_url FROM enquiries WHERE id = ? LIMIT 1");
        $stmtOld->execute([$id]);
        $oldAtt = $stmtOld->fetchColumn();
        if ($oldAtt) {
            cleanOldUpload($oldAtt);
        }
        $stmt = $db->prepare("DELETE FROM enquiries WHERE id = ?");
        $stmt->execute([$id]);
        setFlash('success', 'Inquiry deleted successfully.');
    }
    header('Location: enquiries.php');
    exit();
}

// Filter tab
$currentTab = $_GET['tab'] ?? 'ALL'; // ALL, IN_PROGRESS (PENDING/REVIEWED/CONTACTED), COMPLETED (CLOSED)
$searchQuery = trim($_GET['q'] ?? '');

$sql = "SELECT * FROM enquiries WHERE 1=1";
$params = [];

if ($currentTab === 'IN_PROGRESS') {
    $sql .= " AND status != 'CLOSED'";
} elseif ($currentTab === 'COMPLETED') {
    $sql .= " AND status = 'CLOSED'";
}

if (!empty($searchQuery)) {
    $sql .= " AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR reference_id LIKE ?)";
    $like = '%' . $searchQuery . '%';
    $params = array_merge($params, [$like, $like, $like, $like]);
}

$sql .= " ORDER BY created_at DESC";
$stmt = $db->prepare($sql);
$stmt->execute($params);
$enquiries = $stmt->fetchAll();
?>

<!-- Tabbed Interface Section matching Screenshot -->
<div class="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-8">
  
  <!-- Tabs Row -->
  <div class="flex items-center space-x-1 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
    <a 
      href="enquiries.php?tab=ALL<?= !empty($searchQuery) ? '&q=' . urlencode($searchQuery) : '' ?>"
      class="px-4 md:px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap <?= $currentTab === 'ALL' ? 'border-[#F48033] text-[#F48033]' : 'border-transparent text-slate-500 hover:text-slate-700' ?>"
    >
      All Records
    </a>
    <a 
      href="enquiries.php?tab=IN_PROGRESS<?= !empty($searchQuery) ? '&q=' . urlencode($searchQuery) : '' ?>"
      class="px-4 md:px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap <?= $currentTab === 'IN_PROGRESS' ? 'border-[#F48033] text-[#F48033]' : 'border-transparent text-slate-500 hover:text-slate-700' ?>"
    >
      In Progress
    </a>
    <a 
      href="enquiries.php?tab=COMPLETED<?= !empty($searchQuery) ? '&q=' . urlencode($searchQuery) : '' ?>"
      class="px-4 md:px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap <?= $currentTab === 'COMPLETED' ? 'border-[#F48033] text-[#F48033]' : 'border-transparent text-slate-500 hover:text-slate-700' ?>"
    >
      Completed
    </a>
  </div>

  <!-- Search & Filter Row -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <form method="GET" action="enquiries.php" class="flex items-center space-x-2">
      <input type="hidden" name="tab" value="<?= htmlspecialchars($currentTab) ?>">
      <label class="text-xs font-bold text-slate-700 shrink-0">Search</label>
      <input 
        type="text" 
        name="q"
        placeholder="Enter a keyword"
        value="<?= htmlspecialchars($searchQuery) ?>"
        class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs w-full sm:w-64 focus:outline-none focus:border-[#F48033] transition-colors"
      />
      <?php if (!empty($searchQuery)): ?>
        <a href="enquiries.php?tab=<?= urlencode($currentTab) ?>" class="text-xs text-slate-400 hover:underline">Clear</a>
      <?php endif; ?>
    </form>

    <div class="flex items-center space-x-2">
      <a href="enquiries.php?export=csv" class="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center space-x-1">
        <span>CSV Export</span>
      </a>
    </div>
  </div>

  <!-- Inquiries List Data -->
  <div class="space-y-4">
    <?php if (empty($enquiries)): ?>
      <div class="py-12 text-center text-slate-400 text-sm font-mono">
        No records found matching your query.
      </div>
    <?php else: ?>
      <?php foreach ($enquiries as $inq): ?>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow bg-white gap-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-5 flex-1 w-full">
            <!-- Brand Orange LEAD Badge -->
            <div class="w-full sm:w-36 h-12 sm:h-20 rounded-xl bg-gradient-to-r from-[#FF8F3D] to-[#F48033] flex items-center justify-center text-white shrink-0 shadow-sm">
              <span class="font-black text-sm sm:text-xl tracking-wider font-mono">LEAD</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm sm:text-[15px] font-bold text-slate-800 mb-1 truncate"><?= htmlspecialchars($inq['full_name']) ?></h4>
              <p class="text-xs text-slate-500 truncate"><?= htmlspecialchars($inq['service_required']) ?> • <?= htmlspecialchars($inq['area_sqft']) ?></p>
              <p class="text-[11px] text-slate-400 mt-1 font-mono truncate">Ref: <?= htmlspecialchars($inq['reference_id']) ?> | <?= htmlspecialchars($inq['phone']) ?></p>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3 shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <form method="POST" action="enquiries.php?tab=<?= urlencode($currentTab) ?>" class="inline-flex">
              <input type="hidden" name="action" value="update_status">
              <input type="hidden" name="id" value="<?= $inq['id'] ?>">
              <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">
              <select 
                name="status"
                onchange="this.form.submit()"
                class="px-3 sm:px-4 py-1.5 border border-[#F48033] text-[#F48033] rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors bg-white outline-none cursor-pointer"
              >
                <option value="PENDING" <?= $inq['status'] === 'PENDING' ? 'selected' : '' ?>>PENDING</option>
                <option value="REVIEWED" <?= $inq['status'] === 'REVIEWED' ? 'selected' : '' ?>>REVIEWED</option>
                <option value="CONTACTED" <?= $inq['status'] === 'CONTACTED' ? 'selected' : '' ?>>CONTACTED</option>
                <option value="CLOSED" <?= $inq['status'] === 'CLOSED' ? 'selected' : '' ?>>CLOSED</option>
              </select>
            </form>

            <form method="POST" action="enquiries.php" onsubmit="return confirm('Delete inquiry ' + <?= json_encode($inq['reference_id']) ?> + '?');">
              <input type="hidden" name="action" value="delete">
              <input type="hidden" name="id" value="<?= $inq['id'] ?>">
              <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">
              <button type="submit" class="px-3 sm:px-4 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                Delete
              </button>
            </form>
          </div>
        </div>
      <?php endforeach; ?>
    <?php endif; ?>
  </div>

</div>

<?php require_once __DIR__ . '/footer.php'; ?>
