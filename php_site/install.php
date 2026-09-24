<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — 1-CLICK WEB INSTALLER FOR HOSTING
// ==========================================================
$step = $_GET['step'] ?? 'check';
$error = '';
$success = '';

// Check prerequisites
$phpVersionOk = version_compare(PHP_VERSION, '7.4.0', '>=');
$pdoMysqlOk   = extension_loaded('pdo_mysql');
$writableUploads = is_writable(__DIR__ . '/uploads') || @mkdir(__DIR__ . '/uploads', 0755, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dbHost = trim($_POST['db_host'] ?? '127.0.0.1');
    $dbPort = trim($_POST['db_port'] ?? '3306');
    $dbName = trim($_POST['db_name'] ?? 'persqft_db');
    $dbUser = trim($_POST['db_user'] ?? 'root');
    $dbPass = $_POST['db_pass'] ?? '';

    try {
        // Connect to server (without db first, in case db needs creating)
        $dsn = "mysql:host={$dbHost};port={$dbPort};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);

        // Create Database if not exists
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo->exec("USE `{$dbName}`");

        // Read and execute database.sql
        $sqlFile = __DIR__ . '/database.sql';
        if (!file_exists($sqlFile)) {
            throw new Exception("database.sql file not found in " . __DIR__);
        }

        $sqlContent = file_get_contents($sqlFile);
        $queries = array_filter(array_map('trim', explode(";\n", $sqlContent)));

        foreach ($queries as $query) {
            if (!empty($query)) {
                $pdo->exec($query);
            }
        }

        // Update config/database.php with new credentials
        $configFile = __DIR__ . '/config/database.php';
        if (file_exists($configFile) && is_writable($configFile)) {
            $configCode = file_get_contents($configFile);
            $configCode = preg_replace("/\\\$db_host = .*?;/", "\$db_host = getenv('DB_HOST') ?: '" . addslashes($dbHost) . "';", $configCode);
            $configCode = preg_replace("/\\\$db_port = .*?;/", "\$db_port = getenv('DB_PORT') ?: '" . addslashes($dbPort) . "';", $configCode);
            $configCode = preg_replace("/\\\$db_name = .*?;/", "\$db_name = getenv('DB_NAME') ?: '" . addslashes($dbName) . "';", $configCode);
            $configCode = preg_replace("/\\\$db_user = .*?;/", "\$db_user = getenv('DB_USER') ?: '" . addslashes($dbUser) . "';", $configCode);
            $configCode = preg_replace("/\\\$db_pass = .*?;/", "\$db_pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '" . addslashes($dbPass) . "';", $configCode);
            file_put_contents($configFile, $configCode);
        }

        $step = 'complete';
        $success = "Database '{$dbName}' successfully created, tables seeded, and credentials configured!";
    } catch (Exception $e) {
        $error = "Installation Failed: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PERSQFT CONSTRUCTIONS — 1-Click Hosting Installer</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Space Grotesk', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="min-h-screen bg-[#0a0c0f] text-slate-100 flex flex-col justify-center items-center p-4">

  <div class="w-full max-w-xl">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center space-x-3 mb-3">
        <div class="w-10 h-10 bg-[#F48033] text-black font-black text-xl flex items-center justify-center rounded shadow-lg font-mono">P</div>
        <h1 class="text-2xl font-bold tracking-wider text-white uppercase">PERSQFT INSTALLER</h1>
      </div>
      <p class="text-xs font-mono text-slate-400 uppercase tracking-wide">Automated Web Hosting & Database Setup Wizard</p>
    </div>

    <div class="bg-[#12151b] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">

      <?php if ($step === 'complete'): ?>
        <div class="p-4 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-200 text-xs font-mono space-y-2">
          <div class="font-bold text-sm text-emerald-300">✓ INSTALLATION COMPLETE!</div>
          <p><?= htmlspecialchars($success) ?></p>
        </div>

        <div class="space-y-3 pt-2 font-mono text-xs">
          <div class="p-4 bg-[#0a0c0f] border border-white/10 rounded-xl space-y-1">
            <span class="text-[#F48033] font-bold block mb-1">DEFAULT CMS CREDENTIALS:</span>
            <div>Email: <span class="text-white">admin@persqft.com</span></div>
            <div>Password: <span class="text-white">PersqftAdmin2026!</span></div>
          </div>

          <div class="flex items-center space-x-3 pt-4">
            <a href="admin/login.php" class="flex-1 bg-[#F48033] hover:bg-[#d96a20] text-black text-center font-bold py-3.5 rounded-xl uppercase tracking-wider">
              ENTER CMS ADMIN →
            </a>
            <a href="index.php" class="flex-1 bg-white/10 hover:bg-white/15 text-white text-center py-3.5 rounded-xl uppercase border border-white/10">
              VIEW PUBLIC SITE
            </a>
          </div>
        </div>

      <?php else: ?>

        <!-- Server Checks -->
        <div class="space-y-2 font-mono text-xs pb-4 border-b border-white/10">
          <div class="flex items-center justify-between">
            <span>PHP Version (&ge; 7.4):</span>
            <span class="<?= $phpVersionOk ? 'text-emerald-400' : 'text-red-400' ?> font-bold">
              <?= PHP_VERSION ?> <?= $phpVersionOk ? '✓' : '✗' ?>
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span>PDO MySQL Extension:</span>
            <span class="<?= $pdoMysqlOk ? 'text-emerald-400' : 'text-red-400' ?> font-bold">
              <?= $pdoMysqlOk ? 'Installed ✓' : 'Missing ✗' ?>
            </span>
          </div>
        </div>

        <?php if (!empty($error)): ?>
          <div class="p-3.5 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs font-mono">
            <?= htmlspecialchars($error) ?>
          </div>
        <?php endif; ?>

        <form method="POST" action="install.php" class="space-y-4">
          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-2">
              <label class="block text-[11px] font-mono text-slate-400 uppercase mb-1">MySQL Host</label>
              <input type="text" name="db_host" value="<?= htmlspecialchars($_POST['db_host'] ?? '127.0.0.1') ?>" required class="w-full bg-[#0a0c0f] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-[#F48033]">
            </div>
            <div>
              <label class="block text-[11px] font-mono text-slate-400 uppercase mb-1">Port</label>
              <input type="text" name="db_port" value="<?= htmlspecialchars($_POST['db_port'] ?? '3307') ?>" required class="w-full bg-[#0a0c0f] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-[#F48033]">
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-mono text-slate-400 uppercase mb-1">Database Name</label>
            <input type="text" name="db_name" value="<?= htmlspecialchars($_POST['db_name'] ?? 'persqft_db') ?>" required class="w-full bg-[#0a0c0f] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-[#F48033]">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-mono text-slate-400 uppercase mb-1">Database User</label>
              <input type="text" name="db_user" value="<?= htmlspecialchars($_POST['db_user'] ?? 'root') ?>" required class="w-full bg-[#0a0c0f] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-[#F48033]">
            </div>
            <div>
              <label class="block text-[11px] font-mono text-slate-400 uppercase mb-1">Password</label>
              <input type="password" name="db_pass" value="<?= htmlspecialchars($_POST['db_pass'] ?? '') ?>" placeholder="(empty or password)" class="w-full bg-[#0a0c0f] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-[#F48033]">
            </div>
          </div>

          <button 
            type="submit" 
            class="w-full bg-[#F48033] hover:bg-[#d96a20] text-black font-bold uppercase tracking-wider py-3.5 rounded-xl text-xs font-mono transition-all mt-4 cursor-pointer shadow-lg shadow-[#F48033]/25"
          >
            RUN 1-CLICK DATABASE SETUP →
          </button>
        </form>

      <?php endif; ?>

    </div>
  </div>

</body>
</html>

