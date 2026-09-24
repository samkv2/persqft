<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — CMS ADMIN USERS MANAGEMENT (UIUX WINDOWS)
// ==========================================================
require_once __DIR__ . '/auth.php';
requireAdminAuth();

$db = getDb();
if (!$db) {
    die("Database connection failed.");
}

$action = $_GET['action'] ?? 'list';
$editId = (int)($_GET['id'] ?? 0);
$currentAdminId = (int)($_SESSION['admin_id'] ?? 0);
$currentAdminRole = (string)($_SESSION['admin_role'] ?? '');
$isSuperAdmin = ($currentAdminId === 1)
    || (stripos($currentAdminRole, 'HEAD') !== false)
    || (stripos($currentAdminRole, 'CEO') !== false)
    || (stripos($currentAdminRole, 'Super') !== false)
    || (stripos($currentAdminRole, 'Owner') !== false);

// Handle Delete Admin
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: admins.php');
        exit();
    }

    if (!$isSuperAdmin) {
        setFlash('error', 'Access Denied: Only the Super Admin / CEO can delete admin accounts.');
        header('Location: admins.php');
        exit();
    }

    $id = (int)($_POST['id'] ?? 0);
    if ($id <= 1) {
        setFlash('error', 'The primary Owner account (PERSQFT HEAD/CEO, ID: 1) cannot be deleted.');
    } elseif ($id === $currentAdminId) {
        setFlash('error', 'You cannot delete your own logged-in admin account.');
    } else {
        $stmt = $db->prepare("DELETE FROM admins WHERE id = ?");
        $stmt->execute([$id]);
        setFlash('success', 'Admin account removed successfully.');
    }
    header('Location: admins.php');
    exit();
}

// Handle Update Admin Details & Password
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: admins.php');
        exit();
    }

    $id              = (int)($_POST['id'] ?? 0);
    $rawUsername     = trim(strip_tags($_POST['username'] ?? ''));
    $rawEmail        = trim($_POST['email'] ?? '');
    $rawRole         = trim(strip_tags($_POST['role'] ?? 'Data Entry Admin'));
    $password        = trim($_POST['password'] ?? '');
    $confirmPassword = trim($_POST['confirm_password'] ?? '');

    // Non-super admins can ONLY edit their own profile
    if (!$isSuperAdmin && $id !== $currentAdminId) {
        setFlash('error', 'Access Denied: You are only permitted to edit your own account information.');
        header('Location: admins.php');
        exit();
    }

    // Verify target admin exists
    $existingStmt = $db->prepare("SELECT * FROM admins WHERE id = ? LIMIT 1");
    $existingStmt->execute([$id]);
    $existingAdmin = $existingStmt->fetch();
    if (!$existingAdmin) {
        setFlash('error', 'Admin account not found.');
        header('Location: admins.php');
        exit();
    }

    // Sanitization
    $username = preg_replace('/[^\w\s\-\.\/]/u', '', $rawUsername);
    $email    = strtolower(filter_var($rawEmail, FILTER_SANITIZE_EMAIL));
    
    // Role Lock: Role can ONLY be modified by the Super Admin / CEO
    if (!$isSuperAdmin) {
        $role = $existingAdmin['role'];
    } else {
        $role = preg_replace('/[^\w\s\-\.\/]/u', '', $rawRole);
        if (empty($role)) {
            $role = $existingAdmin['role'];
        }
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        setFlash('error', 'Please provide a valid email address.');
        header("Location: admins.php?action=edit&id={$id}");
        exit();
    }

    if (empty($username) || strlen($username) < 2) {
        setFlash('error', 'Display name/username must be at least 2 characters.');
        header("Location: admins.php?action=edit&id={$id}");
        exit();
    }

    // Check duplicate email or username among other accounts
    $checkStmt = $db->prepare("SELECT id FROM admins WHERE (email = ? OR username = ?) AND id != ? LIMIT 1");
    $checkStmt->execute([$email, $username, $id]);
    if ($checkStmt->fetch()) {
        setFlash('error', 'Another admin account is already using that email address or username.');
        header("Location: admins.php?action=edit&id={$id}");
        exit();
    }

    if (!empty($password)) {
        if (strlen($password) < 6) {
            setFlash('error', 'Password must be at least 6 characters.');
            header("Location: admins.php?action=edit&id={$id}");
            exit();
        }
        if ($password !== $confirmPassword) {
            setFlash('error', 'New password and confirmation do not match.');
            header("Location: admins.php?action=edit&id={$id}");
            exit();
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $db->prepare("UPDATE admins SET username = ?, email = ?, role = ?, password_hash = ? WHERE id = ?");
        $stmt->execute([$username, $email, $role, $passwordHash, $id]);
    } else {
        $stmt = $db->prepare("UPDATE admins SET username = ?, email = ?, role = ? WHERE id = ?");
        $stmt->execute([$username, $email, $role, $id]);
    }

    // Update session if currently logged in user updated their own account
    if ($id === $currentAdminId) {
        $_SESSION['admin_username'] = $username;
        $_SESSION['admin_email'] = $email;
        if ($isSuperAdmin) {
            $_SESSION['admin_role'] = $role;
        }
    }

    setFlash('success', "Details and credentials for '{$username}' updated successfully.");
    header('Location: admins.php');
    exit();
}

// Handle Create Admin
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: admins.php');
        exit();
    }

    if (!$isSuperAdmin) {
        setFlash('error', 'Access Denied: Only the Super Admin / CEO can release new admin accounts.');
        header('Location: admins.php');
        exit();
    }

    $rawUsername = trim(strip_tags($_POST['username'] ?? ''));
    $rawEmail    = trim($_POST['email'] ?? '');
    $rawRole     = trim(strip_tags($_POST['role'] ?? 'Data Entry Admin'));
    $password    = trim($_POST['password'] ?? '');

    // Sanitization
    $username = preg_replace('/[^\w\s\-\.\/]/u', '', $rawUsername);
    $email    = strtolower(filter_var($rawEmail, FILTER_SANITIZE_EMAIL));
    $role     = preg_replace('/[^\w\s\-\.\/]/u', '', $rawRole);

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        setFlash('error', 'Please provide a valid email address.');
        header('Location: admins.php?action=new');
        exit();
    }

    if (empty($password) || strlen($password) < 6) {
        setFlash('error', 'Password must be at least 6 characters.');
        header('Location: admins.php?action=new');
        exit();
    }

    if (empty($username)) {
        $username = explode('@', $email)[0];
    }

    // Check duplicate
    $checkStmt = $db->prepare("SELECT id FROM admins WHERE email = ? OR username = ? LIMIT 1");
    $checkStmt->execute([$email, $username]);
    if ($checkStmt->fetch()) {
        setFlash('error', 'An admin with this email address or username already exists.');
        header('Location: admins.php?action=new');
        exit();
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $db->prepare("
        INSERT INTO admins (username, email, role, password_hash, created_at)
        VALUES (?, ?, ?, ?, NOW())
    ");
    $stmt->execute([$username, $email, $role, $passwordHash]);

    setFlash('success', "New admin account ({$email}) created! They can now log into the CMS panel.");
    header('Location: admins.php');
    exit();
}

// Fetch admin for editing
$editAdmin = null;
if ($action === 'edit' && $editId > 0) {
    if (!$isSuperAdmin && $editId !== $currentAdminId) {
        setFlash('error', 'Access Denied: You can only edit your own admin profile.');
        header('Location: admins.php');
        exit();
    }
    $stmt = $db->prepare("SELECT id, username, email, role, created_at FROM admins WHERE id = ? LIMIT 1");
    $stmt->execute([$editId]);
    $editAdmin = $stmt->fetch();
    if (!$editAdmin) {
        setFlash('error', 'Admin user not found.');
        header('Location: admins.php');
        exit();
    }
} elseif ($action === 'new') {
    if (!$isSuperAdmin) {
        setFlash('error', 'Access Denied: Only the Super Admin / CEO can release new admin accounts.');
        header('Location: admins.php');
        exit();
    }
}

$pageTitle = 'Admin Users & Access Control';
$activePage = 'admins';
require_once __DIR__ . '/header.php';

// Filter tabs
$currentTab = $_GET['tab'] ?? 'ALL'; // ALL, DATA_ENTRY, SUPER_ADMIN
$searchQuery = trim($_GET['q'] ?? '');

$sql = "SELECT * FROM admins WHERE 1=1";
$params = [];

if ($currentTab === 'DATA_ENTRY') {
    $sql .= " AND role LIKE '%Data Entry%'";
} elseif ($currentTab === 'SUPER_ADMIN') {
    $sql .= " AND (role LIKE '%Super%' OR role LIKE '%Owner%' OR role LIKE '%HEAD%' OR role LIKE '%CEO%')";
}

if (!empty($searchQuery)) {
    $sql .= " AND (username LIKE ? OR email LIKE ? OR role LIKE ?)";
    $like = '%' . $searchQuery . '%';
    $params = array_merge($params, [$like, $like, $like]);
}

$sql .= " ORDER BY id ASC";
$stmt = $db->prepare($sql);
$stmt->execute($params);
$admins = $stmt->fetchAll();
?>

<!-- Tabbed Interface Section matching UIUX Windows Layout from Screenshot -->
<div class="bg-white rounded-2xl sm:rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-4 sm:p-6 md:p-8 space-y-6">

  <!-- Header Action Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
    <div>
      <h2 class="text-xl font-bold text-slate-800 tracking-tight font-mono">ADMIN USERS & DATA ENTRY ACCESS</h2>
      <p class="text-xs text-slate-500 mt-0.5">Manage operator logins, passwords, roles, and executive CEO credentials.</p>
    </div>
    <div class="flex items-center space-x-3">
      <?php if ($action === 'list'): ?>
        <?php if ($isSuperAdmin): ?>
          <a href="admins.php?action=new" class="px-5 py-2.5 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] hover:opacity-95 text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center space-x-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span>+ Release Admin</span>
          </a>
        <?php endif; ?>
      <?php else: ?>
        <a href="admins.php" class="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-mono text-xs uppercase tracking-wider rounded-xl transition-all">
          ← Back to List
        </a>
      <?php endif; ?>
    </div>
  </div>

  <?php if ($action === 'edit' && $editAdmin): ?>
    <!-- Edit Admin Form -->
    <div class="max-w-2xl bg-slate-50/60 p-6 sm:p-8 rounded-2xl border border-slate-200/80">
      <div class="mb-6 pb-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold font-mono text-slate-800 uppercase tracking-wider">
            Edit Admin Account & Password
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            Update account details, role, or reset password for <strong class="text-slate-800"><?= htmlspecialchars($editAdmin['username']) ?></strong>.
          </p>
        </div>
        <span class="text-xs font-mono px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold">
          ID: #<?= $editAdmin['id'] ?>
        </span>
      </div>

      <form method="POST" action="admins.php" class="space-y-5">
        <input type="hidden" name="action" value="update">
        <input type="hidden" name="id" value="<?= $editAdmin['id'] ?>">
        <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">User / Display Name *</label>
            <input 
              type="text" 
              name="username" 
              required 
              value="<?= htmlspecialchars($editAdmin['username']) ?>"
              placeholder="e.g. PERSQFT HEAD/CEO or rohit_entry"
              class="w-full bg-white border border-slate-200 focus:border-[#F48033] rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Role Assignment</label>
            <?php if ($isSuperAdmin): ?>
              <select name="role" class="w-full bg-white border border-slate-200 focus:border-[#F48033] rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all">
                <?php if ($editAdmin['id'] == 1): ?>
                  <option value="PERSQFT HEAD/CEO" <?= $editAdmin['role'] === 'PERSQFT HEAD/CEO' ? 'selected' : '' ?>>PERSQFT HEAD/CEO (Primary Executive)</option>
                  <option value="Owner / Super Admin" <?= $editAdmin['role'] === 'Owner / Super Admin' ? 'selected' : '' ?>>Owner / Super Admin</option>
                <?php endif; ?>
                <option value="Data Entry Admin" <?= $editAdmin['role'] === 'Data Entry Admin' ? 'selected' : '' ?>>Data Entry Admin (Content & Quotes)</option>
                <option value="Site Manager" <?= $editAdmin['role'] === 'Site Manager' ? 'selected' : '' ?>>Site Manager (Portfolio & Projects)</option>
                <option value="Co-Admin" <?= $editAdmin['role'] === 'Co-Admin' ? 'selected' : '' ?>>Co-Admin (Full Access)</option>
              </select>
            <?php else: ?>
              <div class="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 font-mono flex items-center justify-between">
                <span class="font-bold"><?= htmlspecialchars($editAdmin['role']) ?></span>
                <span class="text-[10px] text-slate-400 italic">(Locked — Editable only by CEO)</span>
              </div>
              <input type="hidden" name="role" value="<?= htmlspecialchars($editAdmin['role']) ?>">
            <?php endif; ?>
          </div>
        </div>

        <div>
          <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Login Email ID *</label>
          <input 
            type="email" 
            name="email" 
            required 
            value="<?= htmlspecialchars($editAdmin['email']) ?>"
            placeholder="e.g. admin@persqft.com"
            class="w-full bg-white border border-slate-200 focus:border-[#F48033] rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
          >
          <span class="text-[11px] font-mono text-slate-400 mt-1 block">The address used to sign in to the CMS panel.</span>
        </div>

        <!-- Password Change Section (Optional) -->
        <div class="p-5 bg-white border border-slate-200 rounded-xl space-y-4">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-mono text-[#F48033] uppercase tracking-wider font-bold">Reset / Change Password (Optional)</label>
            <span class="text-[10px] font-mono text-slate-400">Leave blank to keep existing password</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span class="text-[11px] font-mono text-slate-500 block mb-1">New Password (min 6 chars):</span>
              <input 
                type="password" 
                name="password" 
                minlength="6"
                placeholder="••••••••••••"
                class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono outline-none transition-all"
              >
            </div>
            <div>
              <span class="text-[11px] font-mono text-slate-500 block mb-1">Confirm New Password:</span>
              <input 
                type="password" 
                name="confirm_password" 
                minlength="6"
                placeholder="••••••••••••"
                class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono outline-none transition-all"
              >
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-200 flex items-center space-x-4">
          <button 
            type="submit" 
            class="px-6 py-3 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer"
          >
            Save Changes
          </button>
          <a href="admins.php" class="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-mono text-xs uppercase tracking-wider rounded-xl">
            Cancel
          </a>
        </div>
      </form>
    </div>

  <?php elseif ($action === 'new'): ?>
    <!-- Create New Admin Form -->
    <div class="max-w-2xl bg-slate-50/60 p-6 sm:p-8 rounded-2xl border border-slate-200/80">
      <div class="mb-6 pb-4 border-b border-slate-200">
        <h3 class="text-sm font-bold font-mono text-slate-800 uppercase tracking-wider">
          Create New CMS Admin / Data Entry Operator
        </h3>
        <p class="text-xs text-slate-500 mt-1">
          The new user will use this Email ID and Password to authenticate at <code class="text-[#F48033] font-bold">/admin/login.php</code>.
        </p>
      </div>

      <form method="POST" action="admins.php" class="space-y-5">
        <input type="hidden" name="action" value="create">
        <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">User / Display Name *</label>
            <input 
              type="text" 
              name="username" 
              required 
              placeholder="e.g. rohit_entry"
              class="w-full bg-white border border-slate-200 focus:border-[#F48033] rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Role Assignment</label>
            <select name="role" class="w-full bg-white border border-slate-200 focus:border-[#F48033] rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all">
              <option value="Data Entry Admin">Data Entry Admin (Content & Quotes)</option>
              <option value="Site Manager">Site Manager (Portfolio & Projects)</option>
              <option value="Co-Admin">Co-Admin (Full Access)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Login Email ID *</label>
          <input 
            type="email" 
            name="email" 
            required 
            placeholder="e.g. dataentry@persqft.com"
            class="w-full bg-white border border-slate-200 focus:border-[#F48033] rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
          >
          <span class="text-[11px] font-mono text-slate-400 mt-1 block">Used by the user on the CMS sign-in screen.</span>
        </div>

        <div>
          <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Login Password * (min 6 characters)</label>
          <input 
            type="password" 
            name="password" 
            required 
            minlength="6"
            placeholder="••••••••••••"
            class="w-full bg-white border border-slate-200 focus:border-[#F48033] rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
          >
        </div>

        <div class="pt-4 border-t border-slate-200 flex items-center space-x-4">
          <button 
            type="submit" 
            class="px-6 py-3 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer"
          >
            Create Admin Account
          </button>
          <a href="admins.php" class="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-mono text-xs uppercase tracking-wider rounded-xl">
            Cancel
          </a>
        </div>
      </form>
    </div>

  <?php else: ?>
    <!-- Tabbed Filters matching Screenshot -->
    <div class="flex items-center space-x-1 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
      <a 
        href="admins.php?tab=ALL<?= !empty($searchQuery) ? '&q=' . urlencode($searchQuery) : '' ?>"
        class="px-4 md:px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap <?= $currentTab === 'ALL' ? 'border-[#F48033] text-[#F48033]' : 'border-transparent text-slate-500 hover:text-slate-700' ?>"
      >
        All Records
      </a>
      <a 
        href="admins.php?tab=DATA_ENTRY<?= !empty($searchQuery) ? '&q=' . urlencode($searchQuery) : '' ?>"
        class="px-4 md:px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap <?= $currentTab === 'DATA_ENTRY' ? 'border-[#F48033] text-[#F48033]' : 'border-transparent text-slate-500 hover:text-slate-700' ?>"
      >
        In Progress
      </a>
      <a 
        href="admins.php?tab=SUPER_ADMIN<?= !empty($searchQuery) ? '&q=' . urlencode($searchQuery) : '' ?>"
        class="px-4 md:px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap <?= $currentTab === 'SUPER_ADMIN' ? 'border-[#F48033] text-[#F48033]' : 'border-transparent text-slate-500 hover:text-slate-700' ?>"
      >
        Completed
      </a>
    </div>

    <!-- Search Row matching Screenshot -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <form method="GET" action="admins.php" class="flex items-center space-x-2">
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
          <a href="admins.php?tab=<?= urlencode($currentTab) ?>" class="text-xs text-slate-400 hover:underline">Clear</a>
        <?php endif; ?>
      </form>
    </div>

    <!-- Admins List Data (matching exact Screenshot card shape) -->
    <div class="space-y-4">
      <?php if (empty($admins)): ?>
        <div class="py-12 text-center text-slate-400 text-sm font-mono">
          No admin records found. Click "+ Release Admin" above to create an operator.
        </div>
      <?php else: ?>
        <?php foreach ($admins as $adm): ?>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow bg-white gap-3.5 sm:gap-4 w-full overflow-hidden">
            <div class="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 w-full min-w-0">
              <!-- Avatar Circle matching screenshot -->
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-black text-base sm:text-lg font-mono shrink-0 shadow-sm border-2 border-slate-100">
                <?= strtoupper(substr($adm['username'], 0, 1)) ?>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-1.5 mb-0.5">
                  <h4 class="text-sm sm:text-[15px] font-bold text-slate-800 truncate"><?= htmlspecialchars($adm['username']) ?></h4>
                  <span class="text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold font-mono <?= $adm['id'] == 1 ? 'bg-orange-50 text-[#F48033] border border-orange-200' : 'bg-blue-50 text-blue-600 border border-blue-200' ?>">
                    <?= htmlspecialchars($adm['role'] ?? 'Data Entry Admin') ?>
                  </span>
                </div>
                <p class="text-xs text-slate-500 truncate">Email: <span class="font-mono text-slate-700 font-semibold"><?= htmlspecialchars($adm['email']) ?></span></p>
                <p class="text-[11px] text-slate-400 mt-0.5 font-mono truncate">ID: #<?= $adm['id'] ?> • <?= htmlspecialchars(substr($adm['created_at'], 0, 10)) ?></p>
              </div>
            </div>

            <!-- Action Buttons: Edit and Delete -->
            <div class="flex items-center justify-end space-x-2 shrink-0 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <?php 
                $isOwnCard = ($adm['id'] == $currentAdminId);
                $canEditCard = $isSuperAdmin || $isOwnCard;
                $canDeleteCard = $isSuperAdmin && ($adm['id'] > 1) && !$isOwnCard;
              ?>

              <?php if ($canEditCard): ?>
                <a href="admins.php?action=edit&id=<?= $adm['id'] ?>" class="px-4 py-1.5 border border-[#F48033] text-[#F48033] rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors">
                  Edit <?= $isOwnCard ? '(You)' : '' ?>
                </a>
              <?php endif; ?>

              <?php if ($canDeleteCard): ?>
                <form method="POST" action="admins.php" onsubmit="return confirm('Delete admin ' + <?= json_encode($adm['email']) ?> + '? They will no longer be able to log in.');" class="inline">
                  <input type="hidden" name="action" value="delete">
                  <input type="hidden" name="id" value="<?= $adm['id'] ?>">
                  <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">
                  <button type="submit" class="px-4 py-1.5 border border-rose-300 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-50 transition-colors cursor-pointer">
                    Delete
                  </button>
                </form>
              <?php elseif ($adm['id'] == 1): ?>
                <span class="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[11px] font-mono font-bold">
                  Primary Owner
                </span>
              <?php elseif (!$canEditCard): ?>
                <span class="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-400 rounded-lg text-[11px] font-mono">
                  Protected
                </span>
              <?php endif; ?>
            </div>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>

  <?php endif; ?>

</div>

<?php require_once __DIR__ . '/footer.php'; ?>
