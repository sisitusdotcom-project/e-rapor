// ==========================================
// SPA ROUTER
// ==========================================

const Router = {
  routes: {},

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    // Inisialisasi awal ditangani oleh onAuthStateChanged di Auth.js
  },

  add(path, handler) {
    this.routes[path] = handler;
  },

  async handleRoute() {
    if (!Auth.currentUser) return; // Prevent routing if not logged in

    const hash = window.location.hash || '#/dashboard';
    // Update active nav
    document.querySelectorAll('.btn-nav').forEach(el => {
      el.classList.remove('active');
      if (el.getAttribute('href') === hash) {
        el.classList.add('active');
      }
    });

    const container = document.getElementById('views-container');
    container.innerHTML = '<div class="text-center text-muted" style="padding: 40px;"><div class="loader" style="margin:0 auto 16px"></div>Memuat halaman...</div>';

    // Simple routing exact match
    // In real app, we might need param matching (e.g., #/guru/class/:id)
    // For MVP, we will extract base path and params manually
    
    const [path, ...params] = hash.split('?'); 
    
    // Find closest route (handling dynamic paths like #/guru/assess/123)
    let matchedHandler = this.routes[path];
    let routeParams = null;

    if (!matchedHandler) {
      // Very basic dynamic route matching for /path/id
      const parts = path.split('/');
      if (parts.length > 2) {
        const basePath = parts.slice(0, parts.length - 1).join('/') + '/:id';
        if (this.routes[basePath]) {
          matchedHandler = this.routes[basePath];
          routeParams = parts[parts.length - 1];
        }
      }
    }

    if (matchedHandler) {
      try {
        await matchedHandler(container, routeParams);
      } catch (e) {
        console.error("Route Error:", e);
        container.innerHTML = `<div class="card"><p class="error-text">Gagal memuat halaman: ${e.message}</p></div>`;
      }
    } else {
      container.innerHTML = `<div class="card"><div class="card-body"><h2 class="card-title">404</h2><p class="text-muted">Halaman tidak ditemukan.</p></div></div>`;
    }

    // Close mobile menu if open
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('sidebar-backdrop').classList.remove('active');
  },

  setTitle(title, subtitle) {
    document.getElementById('page-title').innerText = title;
    if (subtitle) {
      document.getElementById('page-subtitle').innerText = subtitle;
      document.getElementById('page-subtitle').classList.remove('hidden');
    } else {
      document.getElementById('page-subtitle').classList.add('hidden');
    }
  }
};
