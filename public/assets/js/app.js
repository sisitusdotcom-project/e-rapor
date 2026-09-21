// ==========================================
// APP INITIALIZATION & UI HANDLERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Handlers
  const btnMenuToggle = document.getElementById('btn-menu-toggle');
  const btnMenuClose = document.getElementById('btn-menu-close');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  function toggleMenu() {
    sidebar.classList.toggle('active');
    backdrop.classList.toggle('active');
  }

  if (btnMenuToggle) btnMenuToggle.addEventListener('click', toggleMenu);
  if (btnMenuClose) btnMenuClose.addEventListener('click', toggleMenu);
  if (backdrop) backdrop.addEventListener('click', toggleMenu);

  // Initialize Router
  Router.init();
  
  // Register Routes (Delegated to role-specific files, but we set up the default here)
  Router.add('#/dashboard', async (container) => {
    const role = Auth.currentRole;
    if (role === 'admin') {
      await AdminPages.renderDashboard(container);
    } else if (role === 'guru') {
      await GuruPages.renderDashboard(container);
    } else if (role === 'kepsek') {
      await KepsekPages.renderDashboard(container);
    } else if (role === 'ortu') {
      await OrtuPages.renderDashboard(container);
    } else {
      container.innerHTML = '<p class="text-center text-muted">Role tidak valid.</p>';
    }
  });

  // Init Auth (This will trigger the first route if logged in)
  Auth.init();
});

// Helper Function: Generate random ID for mock data/new records
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
