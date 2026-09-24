    </div>
  </main>

  <script>
    if (typeof toggleSidebar === 'undefined') {
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
    }
  </script>

</body>
</html>
