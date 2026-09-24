<?php
// ==========================================================
// PERSQFT CONSTRUCTIONS — CMS ADMIN ROUTER
// Redirects to primary dashboard (Inquiries Panel)
// ==========================================================
require_once __DIR__ . '/auth.php';
requireAdminAuth();

header('Location: enquiries.php');
exit();
