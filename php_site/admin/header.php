<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — CMS ADMIN SHARED HEADER (UIUX WINDOWS EDITION)
// ==========================================================
require_once __DIR__ . '/auth.php';
requireAdminAuth();

$activePage = $activePage ?? 'inquiries';
$flash = getFlash();

$db = getDb();
$siteSettings = getSiteSettings();

$currentAdminId = (int)($_SESSION['admin_id'] ?? 1);
if ($currentAdminId <= 0) $currentAdminId = 1;

$totalInquiries       = 0;
$pendingInquiries     = 0;
$maxInquiryId         = 0;

$totalProjects        = 0;
$maxProjectId         = 0;

$totalServices        = 0;
$maxServiceId         = 0;

$teamCount            = 0;
$maxTeamId            = 0;

$totalSubscribers     = 0;
$maxSubscriberId      = 0;

$totalTestimonials    = 0;
$maxTestimonialId     = 0;

// Unread alert bubble counts for sidebar sections (0 means do NOT show)
$inquiriesAlertCount     = 0;
$testimonialsAlertCount  = 0;
$notificationsAlertCount = 0;
$projectsAlertCount      = 0;
$servicesAlertCount      = 0;
$teamAlertCount          = 0;

if ($db) {
    try {
        // 1. Auto-create admin_section_visits table
        $db->exec("
            CREATE TABLE IF NOT EXISTS `admin_section_visits` (
              `admin_id` INT NOT NULL,
              `section_key` VARCHAR(50) NOT NULL,
              `last_visited_at` DATETIME NOT NULL,
              `last_seen_id` INT DEFAULT 0,
              `last_seen_count` INT DEFAULT 0,
              PRIMARY KEY (`admin_id`, `section_key`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        // 2. Fetch current counts and MAX(id) for each section
        $totalInquiries    = (int)$db->query("SELECT COUNT(*) FROM enquiries")->fetchColumn();
        $pendingInquiries  = (int)$db->query("SELECT COUNT(*) FROM enquiries WHERE status = 'PENDING'")->fetchColumn();
        $maxInquiryId      = (int)$db->query("SELECT COALESCE(MAX(id), 0) FROM enquiries")->fetchColumn();

        $totalProjects     = (int)$db->query("SELECT COUNT(*) FROM projects")->fetchColumn();
        $maxProjectId      = (int)$db->query("SELECT COALESCE(MAX(id), 0) FROM projects")->fetchColumn();

        // Check if services table exists
        try {
            $totalServices    = (int)$db->query("SELECT COUNT(*) FROM services")->fetchColumn();
            $maxServiceId     = (int)$db->query("SELECT COALESCE(MAX(id), 0) FROM services")->fetchColumn();
        } catch (Exception $e) {
            $totalServices = 0;
            $maxServiceId = 0;
        }

        $teamCount         = (int)$db->query("SELECT COUNT(*) FROM team_members")->fetchColumn();
        $maxTeamId         = (int)$db->query("SELECT COALESCE(MAX(id), 0) FROM team_members")->fetchColumn();

        $totalSubscribers  = (int)$db->query("SELECT COUNT(*) FROM subscribers WHERE status = 'ACTIVE'")->fetchColumn();
        $maxSubscriberId   = (int)$db->query("SELECT COALESCE(MAX(id), 0) FROM subscribers")->fetchColumn();

        $totalTestimonials = (int)$db->query("SELECT COUNT(*) FROM testimonials WHERE published = 1")->fetchColumn();
        $maxTestimonialId  = (int)$db->query("SELECT COALESCE(MAX(id), 0) FROM testimonials")->fetchColumn();

        // 3. Mark CURRENT active section as visited right now!
        if (!empty($activePage)) {
            $curMaxId = 0;
            $curCount = 0;
            if ($activePage === 'inquiries') {
                $curMaxId = $maxInquiryId;
                $curCount = $totalInquiries;
            } elseif ($activePage === 'testimonials') {
                $curMaxId = $maxTestimonialId;
                $curCount = $totalTestimonials;
            } elseif ($activePage === 'notifications') {
                $curMaxId = $maxSubscriberId;
                $curCount = $totalSubscribers;
            } elseif ($activePage === 'projects') {
                $curMaxId = $maxProjectId;
                $curCount = $totalProjects;
            } elseif ($activePage === 'services') {
                $curMaxId = $maxServiceId;
                $curCount = $totalServices;
            } elseif ($activePage === 'team') {
                $curMaxId = $maxTeamId;
                $curCount = $teamCount;
            }

            $stmtVisit = $db->prepare("
                INSERT INTO admin_section_visits (admin_id, section_key, last_visited_at, last_seen_id, last_seen_count)
                VALUES (?, ?, NOW(), ?, ?)
                ON DUPLICATE KEY UPDATE 
                    last_visited_at = NOW(),
                    last_seen_id = VALUES(last_seen_id),
                    last_seen_count = VALUES(last_seen_count)
            ");
            $stmtVisit->execute([$currentAdminId, $activePage, $curMaxId, $curCount]);
        }

        // 4. Fetch all visit history for this admin
        $visits = [];
        $stmtGet = $db->prepare("SELECT section_key, last_seen_id, last_seen_count FROM admin_section_visits WHERE admin_id = ?");
        $stmtGet->execute([$currentAdminId]);
        while ($r = $stmtGet->fetch()) {
            $visits[$r['section_key']] = $r;
        }

        // 5. Calculate Alert Bubble Counts:
        // Note: Active section is ALWAYS 0 (never show bubble alert on current page)
        
        // Inquiries:
        if ($activePage !== 'inquiries') {
            if (isset($visits['inquiries'])) {
                $seenId = (int)$visits['inquiries']['last_seen_id'];
                $stmtNew = $db->prepare("SELECT COUNT(*) FROM enquiries WHERE id > ? AND status = 'PENDING'");
                $stmtNew->execute([$seenId]);
                $inquiriesAlertCount = (int)$stmtNew->fetchColumn();
            } else {
                $inquiriesAlertCount = $pendingInquiries;
            }
        }

        // Testimonials:
        if ($activePage !== 'testimonials') {
            if (isset($visits['testimonials'])) {
                $seenId = (int)$visits['testimonials']['last_seen_id'];
                $stmtNew = $db->prepare("SELECT COUNT(*) FROM testimonials WHERE id > ? AND published = 1");
                $stmtNew->execute([$seenId]);
                $testimonialsAlertCount = (int)$stmtNew->fetchColumn();
            } else {
                $testimonialsAlertCount = $totalTestimonials;
            }
        }

        // Push Alerts (Notifications / Subscribers):
        if ($activePage !== 'notifications') {
            if (isset($visits['notifications'])) {
                $seenId = (int)$visits['notifications']['last_seen_id'];
                $stmtNew = $db->prepare("SELECT COUNT(*) FROM subscribers WHERE id > ? AND status = 'ACTIVE'");
                $stmtNew->execute([$seenId]);
                $notificationsAlertCount = (int)$stmtNew->fetchColumn();
            } else {
                $notificationsAlertCount = $totalSubscribers;
            }
        }

        // Projects:
        if ($activePage !== 'projects') {
            if (isset($visits['projects'])) {
                $seenId = (int)$visits['projects']['last_seen_id'];
                $stmtNew = $db->prepare("SELECT COUNT(*) FROM projects WHERE id > ?");
                $stmtNew->execute([$seenId]);
                $projectsAlertCount = (int)$stmtNew->fetchColumn();
            }
        }

        // Services:
        if ($activePage !== 'services' && $totalServices > 0) {
            if (isset($visits['services'])) {
                $seenId = (int)$visits['services']['last_seen_id'];
                $stmtNew = $db->prepare("SELECT COUNT(*) FROM services WHERE id > ?");
                $stmtNew->execute([$seenId]);
                $servicesAlertCount = (int)$stmtNew->fetchColumn();
            }
        }

        // Team:
        if ($activePage !== 'team') {
            if (isset($visits['team'])) {
                $seenId = (int)$visits['team']['last_seen_id'];
                $stmtNew = $db->prepare("SELECT COUNT(*) FROM team_members WHERE id > ?");
                $stmtNew->execute([$seenId]);
                $teamAlertCount = (int)$stmtNew->fetchColumn();
            }
        }

    } catch (Exception $e) {
        error_log("CMS Section Visits error: " . $e->getMessage());
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($pageTitle ?? 'CMS Panel') ?> — PERSQFT CONSTRUCTIONS</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Poppins', 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .font-mono { font-family: 'Work Sans', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; }
    .font-heading { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(function() {});
    }
  </script>
</head>
<body class="w-screen h-screen overflow-hidden bg-[#F3F6FB] text-slate-800 flex select-none relative">

  <!-- ========================================================
       MOBILE DRAWER BACKDROP
  ======================================================== -->
  <div 
    id="sidebarBackdrop" 
    onclick="toggleSidebar()" 
    class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity duration-300 opacity-0 pointer-events-none md:hidden"
    aria-hidden="true"
  ></div>

  <!-- ========================================================
       SIDEBAR (Responsive Drawer on Mobile, Static on Desktop)
  ======================================================== -->
  <aside 
    id="sidebarMenu"
    class="fixed inset-y-0 left-0 z-50 w-72 md:w-64 h-full bg-[#1E2330] flex flex-col shrink-0 shadow-2xl transition-transform duration-300 ease-in-out -translate-x-full md:translate-x-0 md:static md:shadow-none"
  >
    
    <!-- Brand Logo Area in Logo Theme Orange Gradient -->
    <div class="h-16 md:h-20 bg-gradient-to-r from-[#FF8F3D] to-[#F48033] flex items-center justify-between px-5 md:px-7 shrink-0">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 bg-white text-black font-black text-lg flex items-center justify-center rounded-xl shadow-md font-mono">
          P
        </div>
        <div class="leading-tight">
          <span class="text-white font-black text-lg md:text-xl tracking-wider uppercase font-mono block">PERSQFT</span>
          <span class="text-[9px] font-mono text-white/80 tracking-widest uppercase block">CMS PANEL</span>
        </div>
      </div>

      <!-- Mobile Close Button -->
      <button 
        type="button" 
        onclick="toggleSidebar()" 
        class="md:hidden text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-black/15 transition-colors cursor-pointer"
        aria-label="Close Navigation Menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Navigation Menu Items -->
    <div class="flex-1 py-8 flex flex-col gap-1.5 overflow-y-auto">
      
      <!-- Inquiries Panel -->
      <div class="px-3 md:px-4">
        <a 
          href="enquiries.php"
          data-section="inquiries"
          class="w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 <?= $activePage === 'inquiries' ? 'bg-[#F48033] text-white rounded-r-full shadow-lg shadow-orange-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' : 'text-slate-400 hover:text-white rounded-xl hover:bg-white/5' ?>"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            <span class="text-[13px]">Inquiries Panel</span>
          </div>
          <?php if ($inquiriesAlertCount > 0): ?>
            <span id="badge-inquiries" class="section-badge px-2 py-0.5 bg-[#F48033] text-black font-bold text-[10px] rounded-full font-mono shadow-xs"><?= $inquiriesAlertCount ?></span>
          <?php endif; ?>
        </a>
      </div>

      <!-- Projects CMS -->
      <div class="px-3 md:px-4">
        <a 
          href="projects.php"
          data-section="projects"
          class="w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 <?= $activePage === 'projects' ? 'bg-[#F48033] text-white rounded-r-full shadow-lg shadow-orange-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' : 'text-slate-400 hover:text-white rounded-xl hover:bg-white/5' ?>"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            <span class="text-[13px]">Projects CMS</span>
          </div>
          <?php if ($projectsAlertCount > 0): ?>
            <span id="badge-projects" class="section-badge px-2 py-0.5 bg-[#F48033] text-black font-bold text-[10px] rounded-full font-mono shadow-xs"><?= $projectsAlertCount ?></span>
          <?php endif; ?>
        </a>
      </div>

      <!-- Services CMS -->
      <div class="px-3 md:px-4">
        <a 
          href="services.php"
          data-section="services"
          class="w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 <?= $activePage === 'services' ? 'bg-[#F48033] text-white rounded-r-full shadow-lg shadow-orange-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' : 'text-slate-400 hover:text-white rounded-xl hover:bg-white/5' ?>"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <span class="text-[13px]">Services CMS</span>
          </div>
          <?php if ($servicesAlertCount > 0): ?>
            <span id="badge-services" class="section-badge px-2 py-0.5 bg-[#F48033] text-black font-bold text-[10px] rounded-full font-mono shadow-xs"><?= $servicesAlertCount ?></span>
          <?php endif; ?>
        </a>
      </div>

      <!-- Our Process Blueprint CMS -->
      <div class="px-3 md:px-4">
        <a 
          href="process.php"
          data-section="process"
          class="w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 <?= $activePage === 'process' ? 'bg-[#F48033] text-white rounded-r-full shadow-lg shadow-orange-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' : 'text-slate-400 hover:text-white rounded-xl hover:bg-white/5' ?>"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            <span class="text-[13px]">Our Process</span>
          </div>
        </a>
      </div>

      <!-- Team Directory -->
      <div class="px-3 md:px-4">
        <a 
          href="team.php"
          data-section="team"
          class="w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 <?= $activePage === 'team' ? 'bg-[#F48033] text-white rounded-r-full shadow-lg shadow-orange-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' : 'text-slate-400 hover:text-white rounded-xl hover:bg-white/5' ?>"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <span class="text-[13px]">Team Directory</span>
          </div>
          <?php if ($teamAlertCount > 0): ?>
            <span id="badge-team" class="section-badge px-2 py-0.5 bg-[#F48033] text-black font-bold text-[10px] rounded-full font-mono shadow-xs"><?= $teamAlertCount ?></span>
          <?php endif; ?>
        </a>
      </div>

      <!-- Testimonials Manager -->
      <div class="px-3 md:px-4">
        <a 
          href="testimonials.php"
          data-section="testimonials"
          class="w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 <?= $activePage === 'testimonials' ? 'bg-[#F48033] text-white rounded-r-full shadow-lg shadow-orange-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' : 'text-slate-400 hover:text-white rounded-xl hover:bg-white/5' ?>"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            <span class="text-[13px]">Testimonials</span>
          </div>
          <?php if ($testimonialsAlertCount > 0): ?>
            <span id="badge-testimonials" class="section-badge px-2 py-0.5 bg-[#F48033] text-black font-bold text-[10px] rounded-full font-mono shadow-xs"><?= $testimonialsAlertCount ?></span>
          <?php endif; ?>
        </a>
      </div>

      <!-- Push Alerts & Broadcast -->
      <div class="px-3 md:px-4">
        <a 
          href="notifications.php"
          data-section="notifications"
          class="w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 <?= $activePage === 'notifications' ? 'bg-[#F48033] text-white rounded-r-full shadow-lg shadow-orange-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' : 'text-slate-400 hover:text-white rounded-xl hover:bg-white/5' ?>"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            <span class="text-[13px]">Push Alerts</span>
          </div>
          <?php if ($notificationsAlertCount > 0): ?>
            <span id="badge-notifications" class="section-badge px-2 py-0.5 bg-[#F48033] text-black font-bold text-[10px] rounded-full font-mono shadow-xs"><?= $notificationsAlertCount ?></span>
          <?php endif; ?>
        </a>
      </div>

      <!-- Admin Users (Access Control) -->
      <div class="px-3 md:px-4">
        <a 
          href="admins.php"
          data-section="admins"
          class="w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 <?= $activePage === 'admins' ? 'bg-[#F48033] text-white rounded-r-full shadow-lg shadow-orange-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' : 'text-slate-400 hover:text-white rounded-xl hover:bg-white/5' ?>"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
            <span class="text-[13px]">Admin Users</span>
          </div>
        </a>
      </div>

      <!-- System Settings -->
      <div class="px-3 md:px-4">
        <a 
          href="settings.php"
          data-section="settings"
          class="w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 <?= $activePage === 'settings' ? 'bg-[#F48033] text-white rounded-r-full shadow-lg shadow-orange-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' : 'text-slate-400 hover:text-white rounded-xl hover:bg-white/5' ?>"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span class="text-[13px]">System Settings</span>
          </div>
        </a>
      </div>

    </div>

    <!-- Bottom Actions -->
    <div class="p-6 border-t border-slate-700/50 space-y-3">
      <a href="logout.php" class="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors text-[13px]">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        <span>Logout</span>
      </a>
      <a href="../index.html" target="_blank" class="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors text-[13px]">
        <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        <span>Exit to Website</span>
      </a>
    </div>
  </aside>

  <!-- ========================================================
       MAIN RIGHT WINDOW (FULL SCREEN VIEW)
  ======================================================== -->
  <main class="w-full flex-1 flex flex-col bg-white overflow-hidden z-10 min-w-0">
    
    <!-- Top Header Bar -->
    <header class="h-16 md:h-20 flex items-center justify-between px-4 sm:px-6 md:px-10 shrink-0 border-b border-slate-100 bg-white">
      <div class="flex items-center space-x-3 min-w-0">
        <!-- Hamburger Menu Button (Mobile Only) -->
        <button 
          type="button" 
          onclick="toggleSidebar()" 
          class="md:hidden w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs border border-slate-200/60"
          aria-label="Open Navigation Menu"
        >
          <svg class="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        <div class="flex items-center space-x-2 truncate">
          <div class="w-2 h-2 rounded-full bg-[#F48033] shrink-0"></div>
          <span class="text-xs sm:text-sm font-mono font-bold text-slate-800 uppercase tracking-wider truncate">
            <?= htmlspecialchars($pageTitle ?? 'CMS Control') ?>
          </span>
        </div>
      </div>

      <div class="flex items-center space-x-3 md:space-x-5 shrink-0">
        <!-- Quick Link to Website -->
        <a 
          href="../index.html" 
          target="_blank" 
          title="View Live Website" 
          class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#F48033] font-mono text-xs font-bold transition-colors"
        >
          <span class="hidden sm:inline">Live Site</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>

        <?php 
          $currentUsername = !empty($_SESSION['admin_username']) ? $_SESSION['admin_username'] : 'Admin';
          $currentInitial = strtoupper(substr($currentUsername, 0, 1));
          $currentRole = !empty($_SESSION['admin_role']) ? $_SESSION['admin_role'] : 'Executive';
        ?>
        <div class="flex items-center space-x-2.5 sm:border-l sm:border-slate-200 sm:pl-4">
          <a href="admins.php?action=edit&id=<?= (int)($_SESSION['admin_id'] ?? 1) ?>" title="Account Profile" class="flex items-center space-x-2.5 group cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF8F3D] to-[#F48033] flex items-center justify-center text-white text-xs font-bold shadow-sm font-mono group-hover:scale-105 transition-transform">
              <?= htmlspecialchars($currentInitial) ?>
            </div>
            <div class="hidden sm:block text-left leading-tight">
              <span class="text-xs font-bold text-slate-800 group-hover:text-[#F48033] transition-colors block"><?= htmlspecialchars($currentUsername) ?></span>
              <span class="text-[10px] font-mono text-slate-400 block"><?= htmlspecialchars($currentRole) ?></span>
            </div>
          </a>
        </div>
      </div>
    </header>

    <!-- Scrollable Content Canvas -->
    <div class="flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 pb-10 pt-4 sm:pt-6">
      
      <!-- Flash Alert -->
      <?php if ($flash): ?>
        <div class="mb-5 p-3.5 sm:p-4 rounded-xl border <?= $flash['type'] === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800' ?> text-xs font-mono">
          <?= htmlspecialchars($flash['message']) ?>
        </div>
      <?php endif; ?>

      <!-- 3 Vibrant Cards Row — Fully Responsive Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        
        <!-- Card 1: Orange Brand Theme (Inquiries Log) -->
        <div class="bg-gradient-to-br from-[#FF8F3D] to-[#F48033] rounded-2xl sm:rounded-[1.5rem] p-5 sm:p-6 text-white shadow-lg sm:shadow-xl shadow-orange-500/20 relative overflow-hidden group">
          <div class="relative z-10">
            <h3 class="text-xl sm:text-2xl font-bold mb-1">Inquiries Log</h3>
            <p class="text-orange-100 text-xs mb-4 sm:mb-5 pr-12 line-clamp-2">Manage all client leads and property quote requests.</p>
            <a href="enquiries.php" class="inline-block px-4 py-1.5 border border-white/60 bg-white/10 hover:bg-white/25 rounded-lg text-xs font-semibold transition-colors">
              Detail →
            </a>
          </div>
          <div class="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 opacity-80 group-hover:scale-110 transition-transform duration-500">
            <svg class="w-16 h-16 sm:w-20 sm:h-20 text-orange-200/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
          </div>
        </div>

        <!-- Card 2: Sky Blue (Projects CMS) -->
        <div class="bg-gradient-to-br from-[#40C4FF] to-[#0096FF] rounded-2xl sm:rounded-[1.5rem] p-5 sm:p-6 text-white shadow-lg sm:shadow-xl shadow-cyan-500/20 relative overflow-hidden group">
          <div class="relative z-10">
            <h3 class="text-xl sm:text-2xl font-bold mb-1">Projects CMS</h3>
            <p class="text-cyan-100 text-xs mb-4 sm:mb-5 pr-12 line-clamp-2">Set up and manage architectural portfolio items.</p>
            <a href="projects.php" class="inline-block px-4 py-1.5 border border-white/60 bg-white/10 hover:bg-white/25 rounded-lg text-xs font-semibold transition-colors">
              Set up →
            </a>
          </div>
          <div class="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 opacity-80 group-hover:scale-110 transition-transform duration-500">
            <svg class="w-16 h-16 sm:w-20 sm:h-20 text-cyan-200/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
        </div>

        <!-- Card 3: Emerald (Site Stats) -->
        <div class="bg-gradient-to-br from-[#42E39F] to-[#12B774] rounded-2xl sm:rounded-[1.5rem] p-5 sm:p-6 text-white shadow-lg sm:shadow-xl shadow-emerald-500/20 relative overflow-hidden group sm:col-span-2 lg:col-span-1">
          <div class="relative z-10">
            <h3 class="text-xl sm:text-2xl font-bold mb-1">Site Stats</h3>
            <p class="text-emerald-100 text-xs mb-4 sm:mb-5 pr-12 line-clamp-2">Customize global settings and view database status.</p>
            <a href="settings.php" class="inline-block px-4 py-1.5 border border-white/60 bg-white/10 hover:bg-white/25 rounded-lg text-xs font-semibold transition-colors">
              Design →
            </a>
          </div>
          <div class="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 opacity-80 group-hover:scale-110 transition-transform duration-500">
            <svg class="w-16 h-16 sm:w-20 sm:h-20 text-emerald-200/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
          </div>
        </div>

      </div>

  <script>
    function toggleSidebar() {
      const sidebar = document.getElementById('sidebarMenu');
      const backdrop = document.getElementById('sidebarBackdrop');
      if (!sidebar || !backdrop) return;
      
      const isClosed = sidebar.classList.contains('-translate-x-full');
      if (isClosed) {
        sidebar.classList.remove('-translate-x-full');
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        sidebar.classList.add('-translate-x-full');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        backdrop.classList.remove('opacity-100', 'pointer-events-auto');
      }
    }

    // Zero-latency dismissal: Smoothly fade out badge immediately upon clicking segment
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('aside a[data-section]').forEach(function(link) {
        link.addEventListener('click', function() {
          var badge = this.querySelector('.section-badge');
          if (badge) {
            badge.style.transition = 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)';
            badge.style.opacity = '0';
            badge.style.transform = 'scale(0.3)';
            setTimeout(function() {
              if (badge.parentNode) badge.remove();
            }, 180);
          }
        });
      });
    });
  </script>
