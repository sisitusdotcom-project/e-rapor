// ==========================================
// AUTHENTICATION & SESSION MANAGEMENT
// ==========================================

const Auth = {
  currentUser: null,
  currentRole: null,
  userData: null,

  init() {
    if (!auth) return;

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User logged in, fetch role
        this.currentUser = user;
        try {
          const data = await DB.getUser(user.uid);
          if (data) {
            this.userData = data;
            this.currentRole = data.role;
            this.updateProfileUI();
            
            // Redirect to dashboard if on login view
            document.getElementById('login-view').classList.add('hidden');
            document.getElementById('app-shell').classList.remove('hidden');
            
            if (location.hash === '' || location.hash === '#/login') {
              window.location.hash = '#/dashboard';
            } else {
              Router.handleRoute(); // re-trigger route based on new auth state
            }
          } else {
            console.error("Data user tidak ditemukan di database.");
            this.logout();
          }
        } catch (e) {
          console.error("Error fetching user data:", e);
          this.logout();
        }
      } else {
        // Logged out
        this.currentUser = null;
        this.currentRole = null;
        this.userData = null;
        
        document.getElementById('app-shell').classList.add('hidden');
        document.getElementById('login-view').classList.remove('hidden');
        
        // Sembunyikan loading
        document.getElementById('app-loading').style.opacity = '0';
        setTimeout(() => document.getElementById('app-loading').classList.add('hidden'), 300);
      }
    });

    // Login Form Handler
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const pass = document.getElementById('password').value;
      const btn = document.getElementById('btn-login');
      const err = document.getElementById('login-error');
      
      btn.disabled = true;
      btn.querySelector('.btn-text').innerText = 'Loading...';
      err.classList.add('hidden');

      try {
        await auth.signInWithEmailAndPassword(email, pass);
        // onAuthStateChanged will handle the rest
      } catch (error) {
        err.innerText = "Email atau password salah.";
        err.classList.remove('hidden');
        btn.disabled = false;
        btn.querySelector('.btn-text').innerText = 'Masuk';
      }
    });

    // Toggle Password Visibility
    const toggleBtn = document.getElementById('toggle-password');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const passInput = document.getElementById('password');
        const icon = document.getElementById('toggle-password-icon');
        if (passInput.type === 'password') {
          passInput.type = 'text';
          icon.classList.remove('ph-eye');
          icon.classList.add('ph-eye-slash');
        } else {
          passInput.type = 'password';
          icon.classList.remove('ph-eye-slash');
          icon.classList.add('ph-eye');
        }
      });
    }

    // Logout Handler
    document.getElementById('btn-logout').addEventListener('click', () => {
      this.logout();
    });
  },

  async logout() {
    if (auth) await auth.signOut();
    window.location.hash = '';
  },

  updateProfileUI() {
    if (this.userData) {
      document.getElementById('current-user-name').innerText = this.userData.name;
      
      let roleLabel = this.currentRole;
      if (this.currentRole === 'admin') roleLabel = 'Administrator';
      if (this.currentRole === 'guru') roleLabel = 'Guru / Wali Kelas';
      if (this.currentRole === 'kepsek') roleLabel = 'Kepala Sekolah';
      if (this.currentRole === 'ortu') roleLabel = 'Orang Tua / Wali';
      
      document.getElementById('current-user-role').innerText = roleLabel;
      
      this.buildSidebar();
    }
  },

  buildSidebar() {
    const nav = document.getElementById('sidebar-nav');
    nav.innerHTML = ''; // clear

    const links = [];
    
    // Admin Links
    if (this.currentRole === 'admin') {
      links.push({ hash: '#/dashboard', icon: 'ph-squares-four', text: 'Dashboard' });
      links.push({ hash: '#/admin/users', icon: 'ph-users', text: 'Pengguna' });
      links.push({ hash: '#/admin/classes', icon: 'ph-books', text: 'Kelas & Siswa' });
      links.push({ hash: '#/admin/subjects', icon: 'ph-book-bookmark', text: 'Mata Pelajaran' });
      links.push({ hash: '#/admin/extracurriculars', icon: 'ph-person-simple-run', text: 'Ekstrakurikuler' });
      links.push({ hash: '#/admin/characters', icon: 'ph-star', text: 'Indikator Karakter' });
    }
    
    // Guru Links
    if (this.currentRole === 'guru') {
      links.push({ hash: '#/dashboard', icon: 'ph-squares-four', text: 'Beranda Guru' });
      links.push({ hash: '#/guru/classes', icon: 'ph-chalkboard-teacher', text: 'Kelas Saya' });
      links.push({ hash: '#/guru/academic', icon: 'ph-exam', text: 'Nilai Akademik' });
      links.push({ hash: '#/guru/additional', icon: 'ph-folder-plus', text: 'Data Tambahan Rapor' });
      links.push({ hash: '#/guru/observations', icon: 'ph-note-pencil', text: 'Riwayat Observasi' });
    }
    
    // Kepsek Links
    if (this.currentRole === 'kepsek') {
      links.push({ hash: '#/dashboard', icon: 'ph-chart-pie', text: 'Dashboard Sekolah' });
      links.push({ hash: '#/kepsek/reports', icon: 'ph-file-text', text: 'Laporan Kelas' });
    }
    
    // Ortu Links
    if (this.currentRole === 'ortu') {
      links.push({ hash: '#/ortu/dashboard', icon: 'ph-student', text: 'Perkembangan Anak' });
    }

    links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.hash;
      a.className = 'btn-nav';
      a.innerHTML = `<i class="ph ${link.icon}"></i><span>${link.text}</span>`;
      nav.appendChild(a);
    });

    // Hilangkan loading pertama
    document.getElementById('app-loading').style.opacity = '0';
    setTimeout(() => document.getElementById('app-loading').classList.add('hidden'), 300);
  }
};
