<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — CMS SITE SETTINGS & SECURITY (UIUX WINDOWS)
// ==========================================================
require_once __DIR__ . '/auth.php';
requireAdminAuth();

$db = getDb();
if (!$db) {
    die("Database connection failed.");
}

// Handle Settings Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_settings') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: settings.php');
        exit();
    }

    $companyName = cleanInput($_POST['company_name'] ?? '');
    $tagline     = cleanInput($_POST['tagline'] ?? '');
    $phone       = cleanInput($_POST['phone'] ?? '');
    $email       = strtolower(cleanInput($_POST['email'] ?? ''));
    $address     = cleanInput($_POST['address'] ?? '');
    $expYears    = max(0, (int)($_POST['experience_years'] ?? 10));
    $projects    = max(0, (int)($_POST['projects_executed'] ?? 150));
    $locations   = max(0, (int)($_POST['locations_covered'] ?? 25));
    $deliveryPct = max(0, min(100, (int)($_POST['on_time_delivery_percent'] ?? 100)));

    $stmt = $db->prepare("
        UPDATE site_settings SET 
            company_name = ?, tagline = ?, phone = ?, email = ?, address = ?,
            experience_years = ?, projects_executed = ?, locations_covered = ?, on_time_delivery_percent = ?
        WHERE id = 1
    ");
    $stmt->execute([$companyName, $tagline, $phone, $email, $address, $expYears, $projects, $locations, $deliveryPct]);
    setFlash('success', 'Site settings and live counters updated successfully.');
    header('Location: settings.php');
    exit();
}

// Handle Password Change
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'change_password') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: settings.php');
        exit();
    }

    $currentPass = $_POST['current_password'] ?? '';
    $newPass     = $_POST['new_password'] ?? '';
    $confirmPass = $_POST['confirm_password'] ?? '';

    $adminId = $_SESSION['admin_id'] ?? 1;
    $stmt = $db->prepare("SELECT * FROM admins WHERE id = ? LIMIT 1");
    $stmt->execute([$adminId]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($currentPass, $admin['password_hash'])) {
        setFlash('error', 'Current password is incorrect.');
    } elseif (strlen($newPass) < 8) {
        setFlash('error', 'New password must be at least 8 characters long.');
    } elseif ($newPass !== $confirmPass) {
        setFlash('error', 'New password and confirmation do not match.');
    } else {
        $newHash = password_hash($newPass, PASSWORD_BCRYPT);
        $stmt = $db->prepare("UPDATE admins SET password_hash = ? WHERE id = ?");
        $stmt->execute([$newHash, $adminId]);
        setFlash('success', 'Admin password changed successfully.');
    }

    header('Location: settings.php');
    exit();
}

$settings = getSiteSettings();

$pageTitle = 'Site Settings & Security';
$activePage = 'settings';
require_once __DIR__ . '/header.php';
?>

<!-- Tabbed Interface Section matching UIUX Windows Layout -->
<div class="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-8 space-y-6">

  <!-- Header Action Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
    <div>
      <h2 class="text-xl font-bold text-slate-800 tracking-tight font-mono">SYSTEM SETTINGS & LIVE METRICS</h2>
      <p class="text-xs text-slate-500 mt-0.5">Configure company contact credentials, live counter stats, and security.</p>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

    <!-- Left: Company Settings & Live Counters -->
    <div class="lg:col-span-8 space-y-6">
      <h3 class="text-xs font-bold font-mono text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">
        1. COMPANY INFORMATION & COUNTER STATS
      </h3>

      <form method="POST" action="settings.php" class="space-y-5">
        <input type="hidden" name="action" value="save_settings">
        <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Company Brand Name</label>
            <input 
              type="text" 
              name="company_name" 
              value="<?= htmlspecialchars($settings['company_name']) ?>" 
              required
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Tagline</label>
            <input 
              type="text" 
              name="tagline" 
              value="<?= htmlspecialchars($settings['tagline']) ?>" 
              required
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Contact Phone</label>
            <input 
              type="text" 
              name="phone" 
              value="<?= htmlspecialchars($settings['phone']) ?>" 
              required
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>

          <div>
            <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Contact Email</label>
            <input 
              type="email" 
              name="email" 
              value="<?= htmlspecialchars($settings['email']) ?>" 
              required
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
            >
          </div>
        </div>

        <div>
          <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Corporate Office Address</label>
          <textarea 
            name="address" 
            rows="2" 
            required
            class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl p-3 text-xs text-slate-800 font-mono outline-none transition-all"
          ><?= htmlspecialchars($settings['address']) ?></textarea>
        </div>

        <!-- Live Website Counter Stats -->
        <div class="pt-4 border-t border-slate-100">
          <label class="block text-xs font-mono text-[#F48033] uppercase tracking-wider font-bold mb-3">
            LIVE WEBSITE COUNTERS (Displayed on Public Frontend)
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div>
              <span class="text-slate-500 block mb-1">Years Exp:</span>
              <input 
                type="number" 
                name="experience_years" 
                value="<?= (int)$settings['experience_years'] ?>" 
                class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl p-2.5 text-slate-800 font-mono outline-none"
              >
            </div>
            <div>
              <span class="text-slate-500 block mb-1">Projects Executed:</span>
              <input 
                type="number" 
                name="projects_executed" 
                value="<?= (int)$settings['projects_executed'] ?>" 
                class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl p-2.5 text-slate-800 font-mono outline-none"
              >
            </div>
            <div>
              <span class="text-slate-500 block mb-1">Locations:</span>
              <input 
                type="number" 
                name="locations_covered" 
                value="<?= (int)$settings['locations_covered'] ?>" 
                class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl p-2.5 text-slate-800 font-mono outline-none"
              >
            </div>
            <div>
              <span class="text-slate-500 block mb-1">On-Time %:</span>
              <input 
                type="number" 
                name="on_time_delivery_percent" 
                value="<?= (int)$settings['on_time_delivery_percent'] ?>" 
                class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl p-2.5 text-slate-800 font-mono outline-none"
              >
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button 
            type="submit" 
            class="px-6 py-3 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer"
          >
            Update Settings
          </button>
        </div>
      </form>
    </div>

    <!-- Right: Change Admin Password -->
    <div class="lg:col-span-4 space-y-6">
      <h3 class="text-xs font-bold font-mono text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">
        2. CHANGE ADMIN PASSWORD
      </h3>

      <form method="POST" action="settings.php" class="space-y-4">
        <input type="hidden" name="action" value="change_password">
        <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">

        <div>
          <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Current Password</label>
          <input 
            type="password" 
            name="current_password" 
            required 
            placeholder="••••••••••••"
            class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono outline-none"
          >
        </div>

        <div>
          <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">New Password (min 8 chars)</label>
          <input 
            type="password" 
            name="new_password" 
            required 
            minlength="8"
            placeholder="••••••••••••"
            class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono outline-none"
          >
        </div>

        <div>
          <label class="block text-xs font-mono text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Confirm New Password</label>
          <input 
            type="password" 
            name="confirm_password" 
            required 
            minlength="8"
            placeholder="••••••••••••"
            class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono outline-none"
          >
        </div>

        <div class="pt-2">
          <button 
            type="submit" 
            class="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>

  </div>

</div>

<?php require_once __DIR__ . '/footer.php'; ?>
