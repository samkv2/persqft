<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — PUSH ALERTS & BROADCAST MANAGER
// ==========================================================
require_once __DIR__ . '/auth.php';
requireAdminAuth();

$db = getDb();
if (!$db) {
    die("Database connection failed.");
}

// Auto-initialize tables
try {
    $db->exec("
        CREATE TABLE IF NOT EXISTS `subscribers` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `user_agent` VARCHAR(500) DEFAULT NULL,
          `ip_address` VARCHAR(45) DEFAULT NULL,
          `status` VARCHAR(50) DEFAULT 'ACTIVE',
          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS `broadcast_alerts` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `title` VARCHAR(255) NOT NULL,
          `message` TEXT NOT NULL,
          `url` VARCHAR(500) DEFAULT NULL,
          `icon` VARCHAR(500) DEFAULT NULL,
          `target_count` INT DEFAULT 0,
          `created_by` VARCHAR(100) DEFAULT 'Admin',
          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
} catch (Exception $e) {}

// Handle POST actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        setFlash('error', 'Invalid security token.');
        header('Location: notifications.php');
        exit();
    }

    // 1. Broadcast Alert to All Subscribers
    if ($action === 'broadcast') {
        $title   = cleanInput($_POST['title'] ?? '');
        $message = cleanInput($_POST['message'] ?? '');
        $url     = cleanInput($_POST['url'] ?? '', false);
        if (empty($url)) {
            $url = 'https://persqftconstructions.com/';
        }

        if (empty($title) || empty($message)) {
            setFlash('error', 'Notification Title and Message are required to dispatch an alert.');
            header('Location: notifications.php');
            exit();
        }

        $subCount = (int)$db->query("SELECT COUNT(*) FROM subscribers WHERE status = 'ACTIVE'")->fetchColumn();

        $adminUser = $_SESSION['admin_user'] ?? 'Admin';
        $stmt = $db->prepare("
            INSERT INTO broadcast_alerts (title, message, url, icon, target_count, created_by, created_at)
            VALUES (?, ?, ?, '/favicon.svg', ?, ?, NOW())
        ");
        $stmt->execute([$title, $message, $url, $subCount, $adminUser]);

        setFlash('success', "Broadcast alert dispatched successfully! Targeted {$subCount} subscribed device(s).");
        header('Location: notifications.php');
        exit();
    }

    // 2. Delete Broadcast Record
    if ($action === 'delete_alert') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            $stmt = $db->prepare("DELETE FROM broadcast_alerts WHERE id = ?");
            $stmt->execute([$id]);
            setFlash('success', 'Broadcast alert record deleted.');
        }
        header('Location: notifications.php');
        exit();
    }

    // 3. Delete Subscriber
    if ($action === 'delete_subscriber') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            $stmt = $db->prepare("DELETE FROM subscribers WHERE id = ?");
            $stmt->execute([$id]);
            setFlash('success', 'Subscriber removed.');
        }
        header('Location: notifications.php');
        exit();
    }
}

// Fetch stats
$subscribersCount = (int)$db->query("SELECT COUNT(*) FROM subscribers WHERE status = 'ACTIVE'")->fetchColumn();
$broadcastsCount  = (int)$db->query("SELECT COUNT(*) FROM broadcast_alerts")->fetchColumn();
$lastBroadcast    = $db->query("SELECT * FROM broadcast_alerts ORDER BY id DESC LIMIT 1")->fetch();

// Fetch broadcasts history
$broadcasts = $db->query("SELECT * FROM broadcast_alerts ORDER BY id DESC LIMIT 15")->fetchAll();

// Fetch subscribers
$subscribers = $db->query("SELECT * FROM subscribers ORDER BY id DESC LIMIT 25")->fetchAll();

$pageTitle = 'Push Alerts & Broadcast';
$activePage = 'notifications';
require_once __DIR__ . '/header.php';
?>

<div class="space-y-6">

  <!-- Top Hero Bar -->
  <div class="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
      <div>
        <div class="flex items-center space-x-2 mb-1">
          <span class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-50 text-[#F48033] border border-orange-200 uppercase">
            <span class="w-1.5 h-1.5 rounded-full bg-[#F48033] animate-pulse"></span>
            <span>Push Notification Engine</span>
          </span>
        </div>
        <h2 class="text-xl font-bold text-slate-800 tracking-tight font-mono">PUSH ALERTS & BROADCAST CONSOLE</h2>
        <p class="text-xs text-slate-500 mt-0.5">Send real-time alerts, project updates, and hyperlinks directly to subscribed phones & desktop browsers.</p>
      </div>

      <button 
        type="button" 
        onclick="testBrowserNotification()" 
        class="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
      >
        <svg class="w-4 h-4 text-[#F48033]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        <span>Test Push on My Device</span>
      </button>
    </div>

    <!-- Live Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
      
      <!-- Card 1: Subscribed Persons -->
      <div class="p-5 rounded-2xl bg-gradient-to-br from-orange-50/60 to-white border border-orange-100 flex items-center justify-between">
        <div>
          <span class="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">Subscribed Persons</span>
          <div class="flex items-baseline space-x-2">
            <span class="text-3xl font-black text-slate-800 font-mono"><?= number_format($subscribersCount) ?></span>
            <span class="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
          </div>
          <span class="text-[10px] text-slate-400 mt-1 block">Ready to receive alerts</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-[#F48033]/15 text-[#F48033] flex items-center justify-center font-mono text-xl shrink-0">
          🔔
        </div>
      </div>

      <!-- Card 2: Total Broadcasts -->
      <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
        <div>
          <span class="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">Campaigns Broadcasted</span>
          <span class="text-3xl font-black text-slate-800 font-mono"><?= number_format($broadcastsCount) ?></span>
          <span class="text-[10px] text-slate-400 mt-1 block">Total push alerts launched</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-mono text-xl shrink-0">
          📡
        </div>
      </div>

      <!-- Card 3: Last Dispatched -->
      <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
        <div>
          <span class="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">Last Broadcast</span>
          <span class="text-sm font-bold text-slate-800 font-mono block truncate max-w-[180px]">
            <?= $lastBroadcast ? htmlspecialchars($lastBroadcast['title']) : 'None Yet' ?>
          </span>
          <span class="text-[10px] text-slate-400 mt-0.5 block font-mono">
            <?= $lastBroadcast ? htmlspecialchars(substr($lastBroadcast['created_at'], 0, 16)) : 'No history' ?>
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-mono text-xl shrink-0">
          ⚡
        </div>
      </div>

    </div>
  </div>

  <!-- Broadcast Form & Live Device Preview Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

    <!-- Left: Broadcast Composer -->
    <div class="lg:col-span-7 bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-8 space-y-5">
      <div class="flex items-center space-x-2 pb-3 border-b border-slate-100">
        <svg class="w-4 h-4 text-[#F48033]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
        <h3 class="text-sm font-bold font-mono text-slate-800 uppercase tracking-wider">COMPOSE & BROADCAST ALERT</h3>
      </div>

      <form method="POST" action="notifications.php" onsubmit="return confirmBroadcast();" class="space-y-4">
        <input type="hidden" name="action" value="broadcast">
        <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">

        <!-- Alert Title -->
        <div>
          <label class="block text-xs font-mono text-slate-700 uppercase tracking-wider mb-1.5 font-bold">
            Alert Title *
          </label>
          <input 
            type="text" 
            id="inputTitle"
            name="title" 
            required 
            placeholder="e.g. Exclusive Villa Launch: Sultanpur Expressway" 
            oninput="updateLivePreview()"
            class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
          >
          <span class="text-[10px] text-slate-400 mt-1 block">Catchy, bold headline displayed at the top of the browser notification.</span>
        </div>

        <!-- Target Hyperlink -->
        <div>
          <label class="block text-xs font-mono text-slate-700 uppercase tracking-wider mb-1.5 font-bold">
            Target Hyperlink / URL (Click Destination) *
          </label>
          <input 
            type="url" 
            id="inputUrl"
            name="url" 
            required
            value="https://persqftconstructions.com/#projects"
            placeholder="https://persqftconstructions.com/#projects" 
            oninput="updateLivePreview()"
            class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 font-mono outline-none transition-all"
          >
          <span class="text-[10px] text-slate-400 mt-1 block">When the subscriber clicks the alert notification on their phone/PC, they land here.</span>
        </div>

        <!-- Alert Message Body -->
        <div>
          <label class="block text-xs font-mono text-slate-700 uppercase tracking-wider mb-1.5 font-bold">
            Alert Message Content *
          </label>
          <textarea 
            id="inputMessage"
            name="message" 
            rows="3" 
            required
            placeholder="e.g. Pre-launch booking open for 4,500 SQFT luxury turnkey duplex villas with seismic RCC foundation. Tap to view specifications." 
            oninput="updateLivePreview()"
            class="w-full bg-slate-50 border border-slate-200 focus:border-[#F48033] focus:bg-white rounded-xl p-4 text-xs text-slate-800 font-mono outline-none transition-all"
          ></textarea>
          <span class="text-[10px] text-slate-400 mt-1 block">Keep it concise and compelling (1-2 sentences recommended).</span>
        </div>

        <!-- Submit Button -->
        <div class="pt-2">
          <button 
            type="submit" 
            class="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] hover:from-[#f37f2e] hover:to-[#e07028] text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/25 flex items-center justify-center space-x-2.5 cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <svg class="w-4 h-4 text-white fill-current" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
            <span>Broadcast Alert <?= $subscribersCount > 0 ? "to {$subscribersCount} Subscriber(s)" : "to Subscribers" ?></span>
          </button>
        </div>
      </form>
    </div>

    <!-- Right: Live Notification Mockup Preview -->
    <div class="lg:col-span-5 bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-8 space-y-4 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="text-xs font-bold font-mono text-slate-700 uppercase tracking-wider">LIVE DEVICE PREVIEW</h3>
          <span class="text-[10px] font-mono text-slate-400">Windows / Android Banner</span>
        </div>

        <p class="text-xs text-slate-500 mt-3 mb-4">
          This is exactly how your subscribers will see the alert appear on their phone notification tray and desktop screen:
        </p>

        <!-- Mockup Toast Container -->
        <div class="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 space-y-3 relative overflow-hidden">
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400"></div>

          <!-- Header Bar of Notification -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-5 h-5 rounded-md bg-gradient-to-tr from-[#FF8F3D] to-[#F48033] flex items-center justify-center text-[10px] font-black text-white font-mono">
                P
              </div>
              <span class="text-[11px] font-mono font-bold text-slate-200">PERSQFT CONSTRUCTIONS</span>
            </div>
            <span class="text-[9px] font-mono text-slate-400">just now</span>
          </div>

          <!-- Body -->
          <div class="space-y-1">
            <h5 id="previewTitle" class="text-xs font-bold text-white font-mono leading-tight">
              Exclusive Villa Launch: Sultanpur Expressway
            </h5>
            <p id="previewMessage" class="text-[11px] text-slate-300 font-sans leading-relaxed">
              Pre-launch booking open for 4,500 SQFT luxury turnkey duplex villas with seismic RCC foundation. Tap to view specifications.
            </p>
          </div>

          <!-- Link Footer -->
          <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span id="previewUrl" class="truncate max-w-[200px] text-[#F48033]">
              persqftconstructions.com/#projects
            </span>
            <span class="text-[9px] px-1.5 py-0.5 bg-white/10 rounded text-slate-300">Tap to open</span>
          </div>
        </div>
      </div>

      <!-- Helper Tip -->
      <div class="p-4 rounded-xl bg-orange-50/70 border border-orange-100 text-[11px] text-slate-600 space-y-1">
        <span class="font-bold text-[#F48033] block">💡 Pro-Tip for High Engagement:</span>
        <p>Keep your headline under 45 characters. Subscribers can click anywhere on the banner to immediately navigate to your target link.</p>
      </div>
    </div>

  </div>

  <!-- Broadcast History Table -->
  <div class="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-8 space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <div>
        <h3 class="text-sm font-bold font-mono text-slate-800 uppercase tracking-wider">DISPATCHED BROADCAST HISTORY</h3>
        <p class="text-xs text-slate-500 mt-0.5">Log of all notifications sent to subscribers via the CMS.</p>
      </div>
      <span class="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
        <?= count($broadcasts) ?> Logged
      </span>
    </div>

    <?php if (empty($broadcasts)): ?>
      <div class="py-12 text-center text-slate-400 text-xs font-mono">
        No broadcast alerts sent yet. Use the form above to launch your first push notification campaign.
      </div>
    <?php else: ?>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 font-mono text-[11px] text-slate-500 uppercase">
              <th class="py-3 px-3">ID</th>
              <th class="py-3 px-3">Alert Title & Content</th>
              <th class="py-3 px-3">Destination Link</th>
              <th class="py-3 px-3">Targeted</th>
              <th class="py-3 px-3">Date Dispatched</th>
              <th class="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <?php foreach ($broadcasts as $b): ?>
              <tr class="hover:bg-slate-50/70 transition-colors">
                <td class="py-3.5 px-3 font-mono text-slate-400">#<?= $b['id'] ?></td>
                <td class="py-3.5 px-3 max-w-xs">
                  <span class="font-bold text-slate-800 block leading-tight"><?= htmlspecialchars($b['title']) ?></span>
                  <span class="text-[11px] text-slate-500 line-clamp-1 mt-0.5"><?= htmlspecialchars($b['message']) ?></span>
                </td>
                <td class="py-3.5 px-3">
                  <a href="<?= htmlspecialchars($b['url']) ?>" target="_blank" class="font-mono text-[#F48033] hover:underline truncate block max-w-[180px]">
                    <?= htmlspecialchars($b['url']) ?>
                  </a>
                </td>
                <td class="py-3.5 px-3">
                  <span class="px-2 py-0.5 bg-orange-50 text-[#F48033] border border-orange-200 rounded-full font-mono text-[10px] font-bold">
                    <?= (int)$b['target_count'] ?> Devices
                  </span>
                </td>
                <td class="py-3.5 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                  <?= htmlspecialchars(substr($b['created_at'], 0, 16)) ?>
                </td>
                <td class="py-3.5 px-3 text-right">
                  <form method="POST" action="notifications.php" onsubmit="return confirm('Delete this broadcast log?');" class="inline">
                    <input type="hidden" name="action" value="delete_alert">
                    <input type="hidden" name="id" value="<?= $b['id'] ?>">
                    <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">
                    <button type="submit" class="px-3 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs transition-colors cursor-pointer">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    <?php endif; ?>
  </div>

  <!-- Subscribed Devices / Persons Table -->
  <div class="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-8 space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <div>
        <h3 class="text-sm font-bold font-mono text-slate-800 uppercase tracking-wider">SUBSCRIBED PERSONS & DEVICES</h3>
        <p class="text-xs text-slate-500 mt-0.5">Users who clicked "Enable Now" on the floating subscription prompt.</p>
      </div>
      <span class="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
        <?= $subscribersCount ?> Active Subscribers
      </span>
    </div>

    <?php if (empty($subscribers)): ?>
      <div class="py-12 text-center text-slate-400 text-xs font-mono">
        No subscribers recorded yet. When users click "Enable Now" on your website, their device tokens will appear here.
      </div>
    <?php else: ?>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 font-mono text-[11px] text-slate-500 uppercase">
              <th class="py-3 px-3">Subscriber ID</th>
              <th class="py-3 px-3">Device / Platform</th>
              <th class="py-3 px-3">IP Address</th>
              <th class="py-3 px-3">Subscribed Date</th>
              <th class="py-3 px-3">Status</th>
              <th class="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <?php foreach ($subscribers as $s): ?>
              <?php 
                $ua = $s['user_agent'] ?? '';
                $deviceType = 'Desktop Browser';
                if (stripos($ua, 'Mobile') !== false || stripos($ua, 'Android') !== false || stripos($ua, 'iPhone') !== false) {
                    $deviceType = 'Mobile Phone';
                }
              ?>
              <tr class="hover:bg-slate-50/70 transition-colors">
                <td class="py-3.5 px-3 font-mono font-bold text-slate-700">#SUB-<?= str_pad($s['id'], 4, '0', STR_PAD_LEFT) ?></td>
                <td class="py-3.5 px-3">
                  <div class="flex items-center space-x-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold <?= $deviceType === 'Mobile Phone' ? 'bg-purple-50 text-purple-600 border border-purple-200' : 'bg-slate-100 text-slate-700' ?>">
                      <?= $deviceType ?>
                    </span>
                    <span class="text-slate-400 text-[10px] font-mono truncate max-w-[200px]"><?= htmlspecialchars(substr($ua, 0, 50)) ?>...</span>
                  </div>
                </td>
                <td class="py-3.5 px-3 font-mono text-slate-600 text-[11px]"><?= htmlspecialchars($s['ip_address'] ?? 'Anonymous') ?></td>
                <td class="py-3.5 px-3 font-mono text-slate-500 text-[11px]"><?= htmlspecialchars(substr($s['created_at'], 0, 16)) ?></td>
                <td class="py-3.5 px-3">
                  <span class="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full font-mono text-[10px] font-bold">
                    <?= htmlspecialchars($s['status']) ?>
                  </span>
                </td>
                <td class="py-3.5 px-3 text-right">
                  <form method="POST" action="notifications.php" onsubmit="return confirm('Remove this subscriber?');" class="inline">
                    <input type="hidden" name="action" value="delete_subscriber">
                    <input type="hidden" name="id" value="<?= $s['id'] ?>">
                    <input type="hidden" name="csrf_token" value="<?= getCsrfToken() ?>">
                    <button type="submit" class="px-3 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs transition-colors cursor-pointer">
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    <?php endif; ?>
  </div>

</div>

<script>
function updateLivePreview() {
  const title = document.getElementById('inputTitle').value.trim() || 'Exclusive Villa Launch: Sultanpur Expressway';
  const url = document.getElementById('inputUrl').value.trim() || 'persqftconstructions.com/#projects';
  const message = document.getElementById('inputMessage').value.trim() || 'Pre-launch booking open for 4,500 SQFT luxury turnkey duplex villas with seismic RCC foundation. Tap to view specifications.';

  document.getElementById('previewTitle').textContent = title;
  document.getElementById('previewUrl').textContent = url.replace(/^https?:\/\//, '');
  document.getElementById('previewMessage').textContent = message;
}

function confirmBroadcast() {
  const count = <?= (int)$subscribersCount ?>;
  const promptText = count > 0 
    ? `Launch broadcast push notification to all ${count} subscribed device(s) right now?` 
    : `Launch broadcast push notification? It will be delivered to current active visitors and future subscribers.`;
  return confirm(promptText);
}

async function testBrowserNotification() {
  if (!('Notification' in window)) {
    alert('Your browser does not support the Web Notifications API.');
    return;
  }

  const title = document.getElementById('inputTitle').value.trim() || 'PERSQFT CONSTRUCTIONS';
  const message = document.getElementById('inputMessage').value.trim() || 'Test Push Notification: Real-time project & turnkey cost alert.';
  const url = document.getElementById('inputUrl').value.trim() || 'https://persqftconstructions.com/';

  let permission = Notification.permission;
  if (permission !== 'granted') {
    permission = await Notification.requestPermission();
  }

  if (permission === 'granted') {
    // 1. Service Worker showNotification (Strictly required for Android Chrome)
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        if (reg && reg.showNotification) {
          await reg.showNotification(title, {
            body: message,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            vibrate: [150, 50, 150],
            data: { url: url }
          });
          return;
        }
      } catch (e) {
        console.warn('SW notification error:', e);
      }
    }

    // 2. Desktop fallback
    try {
      const notif = new Notification(title, {
        body: message,
        icon: '/favicon.svg',
        badge: '/favicon.svg'
      });
      notif.onclick = () => {
        window.focus();
        window.open(url, '_blank');
      };
    } catch (err) {
      console.warn('Notification constructor error:', err);
    }
  } else {
    alert('Notification permission was ' + permission + '. Please enable notifications in your browser settings to test.');
  }
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>

