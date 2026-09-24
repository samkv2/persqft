<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — CMS ADMIN LOGIN (UIUX WINDOWS EDITION)
// ==========================================================
require_once __DIR__ . '/auth.php';

// If already logged in, redirect to enquiries dashboard
if (!empty($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: enquiries.php');
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $emailOrUser = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($emailOrUser) || empty($password)) {
        $error = 'Please enter your email/username and password.';
    } else {
        $db = getDb();
        if (!$db) {
            $error = 'Database connection failed. Please verify MySQL configuration.';
        } else {
            try {
                $stmt = $db->prepare("SELECT * FROM admins WHERE email = ? OR username = ? LIMIT 1");
                $stmt->execute([$emailOrUser, $emailOrUser]);
                $admin = $stmt->fetch();

                if ($admin && password_verify($password, $admin['password_hash'])) {
                    // Login successful
                    session_regenerate_id(true);
                    $_SESSION['admin_logged_in'] = true;
                    $_SESSION['admin_id'] = $admin['id'];
                    $_SESSION['admin_username'] = $admin['username'];
                    $_SESSION['admin_email'] = $admin['email'];
                    $_SESSION['admin_role'] = $admin['role'] ?? 'Admin';

                    header('Location: enquiries.php');
                    exit();
                } else {
                    $error = 'Invalid credentials. Please verify email and password.';
                }
            } catch (Exception $e) {
                error_log('PERSQFT Login error: ' . $e->getMessage());
                $error = 'An error occurred. Please try again.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CMS Executive Portal — PERSQFT CONSTRUCTIONS</title>
  <link rel="icon" type="image/svg+xml" href="../favicon.svg">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Poppins', 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .font-heading { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .font-mono { font-family: 'Work Sans', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; }
    .bg-grid-pattern {
      background-size: 32px 32px;
      background-image: 
        linear-gradient(to right, rgba(226, 232, 240, 0.6) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(226, 232, 240, 0.6) 1px, transparent 1px);
    }
  </style>
</head>
<body class="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-[#F48033] selection:text-white relative overflow-hidden bg-grid-pattern">
  
  <!-- Warm Ambient Glow Orbs -->
  <div class="absolute -top-32 -left-32 w-96 h-96 bg-orange-400/15 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-slate-400/15 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

  <div class="w-full max-w-md relative z-10">
    
    <!-- Brand Header & Logo -->
    <div class="text-center mb-7 sm:mb-8">
      <a href="../index.html" class="inline-block transition-transform duration-300 hover:scale-105 mb-3" title="Go to Website">
        <img src="../assets/perSqftLogo-BRNiHUcl.png" alt="PERSQFT CONSTRUCTIONS" class="h-12 sm:h-14 w-auto object-contain mx-auto drop-shadow-sm" onerror="this.onerror=null; this.src='../favicon.svg'; this.className='h-12 w-12 mx-auto';">
      </a>
      
      <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 mb-2 shadow-2xs">
        <span class="w-2 h-2 rounded-full bg-[#F48033] animate-pulse"></span>
        <span class="font-mono text-[11px] font-bold text-[#F48033] uppercase tracking-wider">CMS CONTROL PORTAL</span>
      </div>
      
      <p class="text-xs text-slate-500 font-medium">Executive Site Management &amp; Inquiries</p>
    </div>

    <!-- Login Glass Card -->
    <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-200/90 relative overflow-hidden">
      
      <!-- Top Subtle Orange Accent Bar -->
      <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F48033] via-[#FF8C42] to-[#F48033]"></div>

      <div class="mb-6">
        <h2 class="font-heading text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Admin Sign In
        </h2>
        <p class="text-xs text-slate-500 mt-1">
          Enter your authorized credentials to access management controls.
        </p>
      </div>

      <?php if (!empty($error)): ?>
        <div class="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-medium flex items-start space-x-2.5 animate-fadeIn">
          <svg class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="leading-relaxed"><?= htmlspecialchars($error) ?></span>
        </div>
      <?php endif; ?>

      <form method="POST" action="login.php" class="space-y-4 sm:space-y-5">
        
        <!-- Email / Username Field -->
        <div>
          <label class="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5" for="email">
            Admin Email or Username
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <input 
              type="text" 
              id="email" 
              name="email" 
              value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" 
              required 
              placeholder="Enter your email or username" 
              autocomplete="username"
              class="w-full bg-slate-50/80 border border-slate-200/90 focus:border-[#F48033] focus:bg-white focus:ring-2 focus:ring-[#F48033]/20 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
            >
          </div>
        </div>

        <!-- Password Field with Show/Hide Toggle -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider" for="password">
              Password
            </label>
          </div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              placeholder="••••••••••••" 
              autocomplete="current-password"
              class="w-full bg-slate-50/80 border border-slate-200/90 focus:border-[#F48033] focus:bg-white focus:ring-2 focus:ring-[#F48033]/20 rounded-xl pl-10 pr-11 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
            >
            <button 
              type="button" 
              id="togglePasswordBtn"
              onclick="togglePassword()"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Toggle password visibility"
              aria-label="Toggle password visibility"
            >
              <!-- Eye open icon -->
              <svg id="eyeOpenIcon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <!-- Eye closed icon -->
              <svg id="eyeClosedIcon" class="w-4 h-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="w-full bg-gradient-to-r from-[#F48033] to-[#FF8C42] hover:from-[#e06e22] hover:to-[#f07b30] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider py-3.5 px-5 rounded-xl transition-all duration-200 transform active:scale-[0.99] shadow-md hover:shadow-lg shadow-orange-500/20 cursor-pointer flex items-center justify-center space-x-2 mt-2"
        >
          <span>Sign In to Dashboard</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      </form>

      <!-- Card Footer Links -->
      <div class="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <a href="../index.html" class="hover:text-[#F48033] transition-colors flex items-center space-x-1 font-medium">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back to Website</span>
        </a>
        <div class="flex items-center space-x-1 text-emerald-600 font-mono text-[11px] font-semibold">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>SSL Secured</span>
        </div>
      </div>
    </div>
    
    <!-- Bottom Copyright -->
    <div class="text-center mt-6 text-slate-400 text-xs font-mono">
      &copy; <?= date('Y') ?> PERSQFT CONSTRUCTIONS. All rights reserved.
    </div>

  </div>

  <script>
    function togglePassword() {
      const pwdInput = document.getElementById('password');
      const eyeOpen = document.getElementById('eyeOpenIcon');
      const eyeClosed = document.getElementById('eyeClosedIcon');
      
      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        eyeOpen.classList.add('hidden');
        eyeClosed.classList.remove('hidden');
      } else {
        pwdInput.type = 'password';
        eyeOpen.classList.remove('hidden');
        eyeClosed.classList.add('hidden');
      }
    }
  </script>

</body>
</html>
