// admin.js — Modul Admin: dashboard ringkasan, CRUD pengguna, kelas, siswa,
// indikator karakter, dan pengaturan tahun ajaran/semester.
const AdminPages = {
  // ========== DASHBOARD ==========
  async renderDashboard(container) {
    Router.setTitle('Dashboard admin', 'Ringkasan data dan pengaturan sistem.');
    const [settings, users, classes, chars, students] = await Promise.all([
      DB.getSettings(),
      DB.getAllUsers(),
      DB.getClasses(),
      DB.getCharacters(),
      DB.getAllStudents()
    ]);
    const userArr = DB.toArray(users);
    const classArr = DB.toArray(classes);
    const charArr = DB.toArray(chars);
    const studentArr = DB.toArray(students);
    const guruCount = userArr.filter(u => u.role === 'guru').length;
    const ortuCount = userArr.filter(u => u.role === 'ortu').length;
    container.innerHTML = `
      <section class="card-grid" style="margin-bottom:24px">
        <div class="card stat-card">
          <div class="stat-icon" style="background:var(--primary-light);color:var(--primary)"><i class="ph ph-student"></i></div>
          <div><p class="stat-value">${studentArr.length}</p><p class="stat-label text-muted">Siswa terdaftar</p></div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon" style="background:var(--success-bg);color:var(--success)"><i class="ph ph-chalkboard-teacher"></i></div>
          <div><p class="stat-value">${guruCount}</p><p class="stat-label text-muted">Guru aktif</p></div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon" style="background:var(--warning-bg);color:var(--warning)"><i class="ph ph-books"></i></div>
          <div><p class="stat-value">${classArr.length}</p><p class="stat-label text-muted">Kelas</p></div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon" style="background:var(--danger-bg);color:var(--danger-text)"><i class="ph ph-users"></i></div>
          <div><p class="stat-value">${ortuCount}</p><p class="stat-label text-muted">Orang tua/wali</p></div>
        </div>
      </section>

      <section class="card" style="margin-bottom:24px">
        <div class="card-header">
          <h3 class="card-title">Pengaturan tahun ajaran</h3>
        </div>
        <form id="form-settings" class="inline-form">
          <div class="form-group" style="margin-bottom:12px">
            <label>Tahun ajaran aktif</label>
            <input id="set-year" value="${settings.currentAcademicYear}" placeholder="Contoh: 2026/2027">
          </div>
          <div class="form-group" style="margin-bottom:12px">
            <label>Semester</label>
            <select id="set-sem">
              <option value="1" ${settings.currentSemester === '1' ? 'selected' : ''}>Semester 1</option>
              <option value="2" ${settings.currentSemester === '2' ? 'selected' : ''}>Semester 2</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary"><i class="ph ph-floppy-disk"></i> Simpan</button>
        </form>
      </section>

      <section class="card">
        <div class="card-header">
          <h3 class="card-title">Indikator karakter aktif</h3>
          <span class="badge badge-primary">${charArr.filter(c => c.active !== false).length} aktif</span>
        </div>
        <p class="text-muted" style="font-size:13px">Kelola di menu <strong>Indikator Karakter</strong> pada sidebar.</p>
      </section>
    `;
    document.getElementById('form-settings').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      btn.disabled = true;
      btn.innerHTML = '<i class="ph ph-spinner"></i> Menyimpan...';
      await DB.updateSettings({
        currentAcademicYear: document.getElementById('set-year').value.trim(),
        currentSemester: document.getElementById('set-sem').value
      });
      btn.disabled = false;
      btn.innerHTML = '<i class="ph ph-check"></i> Tersimpan';
      setTimeout(() => {
        btn.innerHTML = '<i class="ph ph-floppy-disk"></i> Simpan';
      }, 1500);
    });
  },
  // ========== INDIKATOR KARAKTER ==========
  async renderCharacters(container) {
    Router.setTitle('Indikator karakter', 'Aspek karakter yang dinilai guru.');
    const chars = await DB.getCharacters();
    const charArr = DB.toArray(chars).sort((a, b) => (a.order || 0) - (b.order || 0));
    const rows = charArr.length ? charArr.map(c => `
      <tr>
        <td>${c.order || '-'}</td>
        <td><strong>${c.name}</strong></td>
        <td><span class="badge ${c.active !== false ? 'badge-success' : 'badge-danger'}">${c.active !== false ? 'Aktif' : 'Nonaktif'}</span></td>
        <td class="action-cell">
          <button class="btn btn-outline btn-sm" data-edit-char="${c.id}"><i class="ph ph-pencil-simple"></i></button>
          <button class="btn btn-danger btn-sm" data-del-char="${c.id}"><i class="ph ph-trash"></i></button>
        </td>
      </tr>
    `).join('') : '<tr><td colspan="4" class="text-center text-muted">Belum ada indikator. Klik "Tambah" untuk memulai.</td></tr>';
    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Daftar aspek karakter</h3>
          <button class="btn btn-primary" id="btn-add-char"><i class="ph ph-plus"></i> Tambah</button>
        </div>
        <div class="table-responsive">
          <table class="table"><thead><tr><th style="width:50px">No</th><th>Nama</th><th>Status</th><th style="width:100px">Aksi</th></tr></thead>
          <tbody>${rows}</tbody></table>
        </div>
      </div>
      ${this._charModal()}
    `;
    // event: tambah
    document.getElementById('btn-add-char').onclick = () => this._openCharModal(null, charArr.length + 1);
    // event: edit
    container.querySelectorAll('[data-edit-char]').forEach(btn => {
      btn.onclick = () => {
        const c = charArr.find(x => x.id === btn.dataset.editChar);
        if (c) this._openCharModal(c);
      };
    });
    // event: hapus
    container.querySelectorAll('[data-del-char]').forEach(btn => {
      btn.onclick = async () => {
        if (!confirm('Yakin hapus indikator ini?')) return;
        await DB.deleteCharacter(btn.dataset.delChar);
        this.renderCharacters(container);
      };
    });
    // event: simpan modal
    document.getElementById('form-char').onsubmit = async (e) => {
      e.preventDefault();
      const id = document.getElementById('char-id').value || null;
      await DB.saveCharacter(id, {
        name: document.getElementById('char-name').value.trim(),
        order: parseInt(document.getElementById('char-order').value) || 1,
        active: document.getElementById('char-active').value === 'true'
      });
      this._closeModal('modal-char');
      this.renderCharacters(container);
    };
  },
  _charModal() {
    return `
    <div class="modal-overlay" id="modal-char">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title" id="char-modal-title">Tambah indikator</h3>
          <button class="btn-icon" onclick="AdminPages._closeModal('modal-char')"><i class="ph ph-x"></i></button>
        </div>
        <form id="form-char">
          <div class="modal-body">
            <input type="hidden" id="char-id">
            <div class="form-group">
              <label>Nama karakter</label>
              <input id="char-name" required placeholder="Contoh: Disiplin">
            </div>
            <div class="form-group">
              <label>Urutan tampil</label>
              <input id="char-order" type="number" min="1" value="1">
            </div>
            <div class="form-group">
              <label>Status</label>
              <select id="char-active"><option value="true">Aktif</option><option value="false">Nonaktif</option></select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="AdminPages._closeModal('modal-char')">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>`;
  },
  _openCharModal(existing, nextOrder) {
    document.getElementById('char-modal-title').innerText = existing ? 'Edit indikator' : 'Tambah indikator';
    document.getElementById('char-id').value = existing ? existing.id : '';
    document.getElementById('char-name').value = existing ? existing.name : '';
    document.getElementById('char-order').value = existing ? existing.order : (nextOrder || 1);
    document.getElementById('char-active').value = existing ? String(existing.active !== false) : 'true';
    document.getElementById('modal-char').classList.add('active');
  },
  // ========== MANAJEMEN PENGGUNA ==========
  async renderUsers(container) {
    Router.setTitle('Manajemen pengguna', 'Kelola akun guru, kepala sekolah, dan orang tua.');
    const users = await DB.getAllUsers();
    const userArr = DB.toArray(users);
    const roleLabel = {
      admin: 'Admin',
      guru: 'Guru',
      kepsek: 'Kepala Sekolah',
      ortu: 'Orang Tua'
    };
    const roleBadge = {
      admin: 'badge-primary',
      guru: 'badge-success',
      kepsek: 'badge-warning',
      ortu: 'badge-danger'
    };
    const rows = userArr.length ? userArr.map(u => `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.email || '-'}</td>
        <td><span class="badge ${roleBadge[u.role] || 'badge-primary'}">${roleLabel[u.role] || u.role}</span></td>
        <td class="action-cell">
          <button class="btn btn-outline btn-sm" data-edit-user="${u.id}"><i class="ph ph-pencil-simple"></i></button>
        </td>
      </tr>
    `).join('') : '<tr><td colspan="4" class="text-center text-muted">Belum ada pengguna. Buat akun melalui Firebase Auth Console, lalu tambahkan datanya di sini.</td></tr>';
    container.innerHTML = `
      <div class="card" style="margin-bottom:16px">
        <p class="text-muted" style="font-size:13px">Untuk <strong>membuat akun baru</strong>, buat user di Firebase Authentication Console terlebih dahulu, lalu daftarkan UID-nya di form di bawah. Langkah ini menjaga keamanan agar password tidak transit melalui frontend.</p>
      </div>
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Daftar pengguna</h3>
          <button class="btn btn-primary" id="btn-add-user"><i class="ph ph-plus"></i> Daftarkan</button>
        </div>
        <div class="table-responsive">
          <table class="table"><thead><tr><th>Nama</th><th>Email</th><th>Role</th><th style="width:80px">Aksi</th></tr></thead>
          <tbody>${rows}</tbody></table>
        </div>
      </div>
      ${this._userModal()}
    `;
    document.getElementById('btn-add-user').onclick = () => this._openUserModal(null);
    container.querySelectorAll('[data-edit-user]').forEach(btn => {
      btn.onclick = () => {
        const u = userArr.find(x => x.id === btn.dataset.editUser);
        if (u) this._openUserModal(u);
      };
    });
    document.getElementById('form-user').onsubmit = async (e) => {
      e.preventDefault();
      const uid = document.getElementById('user-uid').value.trim();
      if (!uid) {
        alert('UID tidak boleh kosong.');
        return;
      }
      await DB.saveUser(uid, {
        name: document.getElementById('user-name').value.trim(),
        email: document.getElementById('user-email').value.trim(),
        role: document.getElementById('user-role').value
      });
      this._closeModal('modal-user');
      this.renderUsers(container);
    };
  },
  _userModal() {
    return `
    <div class="modal-overlay" id="modal-user">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title" id="user-modal-title">Daftarkan pengguna</h3>
          <button class="btn-icon" onclick="AdminPages._closeModal('modal-user')"><i class="ph ph-x"></i></button>
        </div>
        <form id="form-user">
          <div class="modal-body">
            <div class="form-group">
              <label>UID Firebase Auth</label>
              <input id="user-uid" required placeholder="Paste UID dari Firebase Console">
            </div>
            <div class="form-group">
              <label>Nama lengkap</label>
              <input id="user-name" required placeholder="Contoh: Bu Siti Nurjanah">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input id="user-email" type="email" placeholder="contoh: siti@sekolah.id">
            </div>
            <div class="form-group">
              <label>Role</label>
              <select id="user-role">
                <option value="guru">Guru / Wali Kelas</option>
                <option value="kepsek">Kepala Sekolah</option>
                <option value="ortu">Orang Tua / Wali</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="AdminPages._closeModal('modal-user')">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>`;
  },
  _openUserModal(existing) {
    document.getElementById('user-modal-title').innerText = existing ? 'Edit pengguna' : 'Daftarkan pengguna';
    const uidField = document.getElementById('user-uid');
    uidField.value = existing ? existing.id : '';
    uidField.readOnly = !!existing; // prevent changing UID on edit
    document.getElementById('user-name').value = existing ? existing.name : '';
    document.getElementById('user-email').value = existing ? (existing.email || '') : '';
    document.getElementById('user-role').value = existing ? existing.role : 'guru';
    document.getElementById('modal-user').classList.add('active');
  },
  // ========== DATA KELAS ==========
  async renderClasses(container) {
    Router.setTitle('Data kelas', 'Kelola kelas dan penugasan wali kelas.');
    const [classes, users, students] = await Promise.all([
      DB.getClasses(),
      DB.getAllUsers(),
      DB.getAllStudents()
    ]);
    const classArr = DB.toArray(classes);
    const guruArr = DB.toArray(users).filter(u => u.role === 'guru');
    const studentArr = DB.toArray(students);
    const rows = classArr.length ? classArr.map(c => {
      const teacher = guruArr.find(g => g.id === c.teacherId);
      const count = studentArr.filter(s => s.classId === c.id).length;
      return `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td>${teacher ? teacher.name : '<span class="text-muted">Belum ditugaskan</span>'}</td>
          <td>${count} siswa</td>
          <td class="action-cell">
            <button class="btn btn-outline btn-sm" data-edit-cls="${c.id}"><i class="ph ph-pencil-simple"></i></button>
            <button class="btn btn-outline btn-sm" data-view-cls="${c.id}"><i class="ph ph-eye"></i></button>
            <button class="btn btn-danger btn-sm" data-del-cls="${c.id}"><i class="ph ph-trash"></i></button>
          </td>
        </tr>`;
    }).join('') : '<tr><td colspan="4" class="text-center text-muted">Belum ada kelas.</td></tr>';
    const guruOptions = guruArr.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Daftar kelas</h3>
          <button class="btn btn-primary" id="btn-add-cls"><i class="ph ph-plus"></i> Tambah</button>
        </div>
        <div class="table-responsive">
          <table class="table"><thead><tr><th>Nama Kelas</th><th>Wali Kelas</th><th>Jumlah Siswa</th><th style="width:130px">Aksi</th></tr></thead>
          <tbody>${rows}</tbody></table>
        </div>
      </div>

      <div class="modal-overlay" id="modal-cls">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title" id="cls-modal-title">Tambah kelas</h3>
            <button class="btn-icon" onclick="AdminPages._closeModal('modal-cls')"><i class="ph ph-x"></i></button>
          </div>
          <form id="form-cls">
            <div class="modal-body">
              <input type="hidden" id="cls-id">
              <div class="form-group">
                <label>Nama kelas</label>
                <input id="cls-name" required placeholder="Contoh: 4A">
              </div>
              <div class="form-group">
                <label>Wali kelas</label>
                <select id="cls-teacher">
                  <option value="">— Pilih guru —</option>
                  ${guruOptions}
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="AdminPages._closeModal('modal-cls')">Batal</button>
              <button type="submit" class="btn btn-primary">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById('btn-add-cls').onclick = () => {
      document.getElementById('cls-modal-title').innerText = 'Tambah kelas';
      document.getElementById('cls-id').value = '';
      document.getElementById('cls-name').value = '';
      document.getElementById('cls-teacher').value = '';
      document.getElementById('modal-cls').classList.add('active');
    };
    container.querySelectorAll('[data-edit-cls]').forEach(btn => {
      btn.onclick = () => {
        const c = classArr.find(x => x.id === btn.dataset.editCls);
        if (!c) return;
        document.getElementById('cls-modal-title').innerText = 'Edit kelas';
        document.getElementById('cls-id').value = c.id;
        document.getElementById('cls-name').value = c.name;
        document.getElementById('cls-teacher').value = c.teacherId || '';
        document.getElementById('modal-cls').classList.add('active');
      };
    });
    container.querySelectorAll('[data-del-cls]').forEach(btn => {
      btn.onclick = async () => {
        if (!confirm('Hapus kelas ini? Siswa di kelas ini tidak akan terhapus.')) return;
        await DB.deleteClass(btn.dataset.delCls);
        this.renderClasses(container);
      };
    });
    // Klik "eye" -> navigasi ke daftar siswa kelas itu
    container.querySelectorAll('[data-view-cls]').forEach(btn => {
      btn.onclick = () => {
        window.location.hash = `#/admin/students/${btn.dataset.viewCls}`;
      };
    });
    document.getElementById('form-cls').onsubmit = async (e) => {
      e.preventDefault();
      const id = document.getElementById('cls-id').value || null;
      await DB.saveClass(id, {
        name: document.getElementById('cls-name').value.trim(),
        teacherId: document.getElementById('cls-teacher').value || null
      });
      this._closeModal('modal-cls');
      this.renderClasses(container);
    };
  },
  // ========== DATA SISWA (per kelas) ==========
  async renderStudents(container, classId) {
    const classes = await DB.getClasses();
    const cls = classes[classId];
    if (!cls) {
      container.innerHTML = '<div class="card"><p class="error-text">Kelas tidak ditemukan.</p></div>';
      return;
    }
    Router.setTitle(`Siswa kelas ${cls.name}`, 'Kelola data siswa dan hubungkan dengan akun orang tua.');
    const [studentData, users] = await Promise.all([
      DB.getStudentsByClass(classId),
      DB.getAllUsers()
    ]);
    const studentArr = DB.toArray(studentData);
    const ortuArr = DB.toArray(users).filter(u => u.role === 'ortu');
    const rows = studentArr.length ? studentArr.map(s => {
      const parent = ortuArr.find(p => p.id === s.parentId);
      return `
        <tr>
          <td>${s.nis || '-'}</td>
          <td><strong>${s.name}</strong></td>
          <td>${s.gender === 'L' ? 'Laki-laki' : s.gender === 'P' ? 'Perempuan' : '-'}</td>
          <td>${parent ? `<span class="badge badge-success"><i class="ph ph-link"></i> ${parent.name}</span>` : '<span class="badge badge-warning" style="background:#fff3cd;color:#856404"><i class="ph ph-link-break"></i> Belum ditautkan</span>'}</td>
          <td class="action-cell">
            <button class="btn btn-outline btn-sm" onclick="window.open('print.html?id=${s.id}', '_blank')" title="Cetak Rapor"><i class="ph ph-printer"></i></button>
            <button class="btn btn-outline btn-sm" data-edit-stu="${s.id}"><i class="ph ph-pencil-simple"></i></button>
            <button class="btn btn-danger btn-sm" data-del-stu="${s.id}"><i class="ph ph-trash"></i></button>
          </td>
        </tr>`;
    }).join('') : '<tr><td colspan="5" class="text-center text-muted">Belum ada siswa di kelas ini.</td></tr>';
    const ortuOpts = ortuArr.map(o => `<option value="${o.id}">${o.name}</option>`).join('');
    container.innerHTML = `
      <div style="margin-bottom:16px"><a href="#/admin/classes" class="btn btn-outline"><i class="ph ph-arrow-left"></i> Kembali ke daftar kelas</a></div>
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Daftar siswa</h3>
          <button class="btn btn-primary" id="btn-add-stu"><i class="ph ph-plus"></i> Tambah</button>
        </div>
        <div class="table-responsive">
          <table class="table"><thead><tr><th>NIS</th><th>Nama</th><th>Gender</th><th>Orang Tua</th><th style="width:100px">Aksi</th></tr></thead>
          <tbody>${rows}</tbody></table>
        </div>
      </div>

      <div class="modal-overlay" id="modal-stu">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title" id="stu-modal-title">Tambah siswa</h3>
            <button class="btn-icon" onclick="AdminPages._closeModal('modal-stu')"><i class="ph ph-x"></i></button>
          </div>
          <form id="form-stu">
            <div class="modal-body">
              <input type="hidden" id="stu-id">
              <div class="form-group">
                <label>Nama lengkap</label>
                <input id="stu-name" required placeholder="Contoh: Ahmad Fauzi">
              </div>
              <div class="form-group">
                <label>NIS</label>
                <input id="stu-nis" placeholder="Contoh: 20260014">
              </div>
              <div class="form-group">
                <label>Jenis kelamin</label>
                <select id="stu-gender"><option value="L">Laki-laki</option><option value="P">Perempuan</option></select>
              </div>
              <div class="form-group">
                <label>Orang tua / wali (opsional)</label>
                <select id="stu-parent"><option value="">— Tidak ditautkan —</option>${ortuOpts}</select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="AdminPages._closeModal('modal-stu')">Batal</button>
              <button type="submit" class="btn btn-primary">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById('btn-add-stu').onclick = () => {
      document.getElementById('stu-modal-title').innerText = 'Tambah siswa';
      document.getElementById('stu-id').value = '';
      document.getElementById('stu-name').value = '';
      document.getElementById('stu-nis').value = '';
      document.getElementById('stu-gender').value = 'L';
      document.getElementById('stu-parent').value = '';
      document.getElementById('modal-stu').classList.add('active');
    };
    container.querySelectorAll('[data-edit-stu]').forEach(btn => {
      btn.onclick = () => {
        const s = studentArr.find(x => x.id === btn.dataset.editStu);
        if (!s) return;
        document.getElementById('stu-modal-title').innerText = 'Edit siswa';
        document.getElementById('stu-id').value = s.id;
        document.getElementById('stu-name').value = s.name;
        document.getElementById('stu-nis').value = s.nis || '';
        document.getElementById('stu-gender').value = s.gender || 'L';
        document.getElementById('stu-parent').value = s.parentId || '';
        document.getElementById('modal-stu').classList.add('active');
      };
    });
    container.querySelectorAll('[data-del-stu]').forEach(btn => {
      btn.onclick = async () => {
        if (!confirm('Hapus data siswa ini?')) return;
        await DB.deleteStudent(btn.dataset.delStu);
        this.renderStudents(container, classId);
      };
    });
    document.getElementById('form-stu').onsubmit = async (e) => {
      e.preventDefault();
      const id = document.getElementById('stu-id').value || null;
      await DB.saveStudent(id, {
        name: document.getElementById('stu-name').value.trim(),
        nis: document.getElementById('stu-nis').value.trim(),
        gender: document.getElementById('stu-gender').value,
        classId: classId,
        parentId: document.getElementById('stu-parent').value || null
      });
      this._closeModal('modal-stu');
      this.renderStudents(container, classId);
    };
  },
  // ========== DATA MATA PELAJARAN ==========
  async renderSubjects(container) {
    Router.setTitle('Mata pelajaran', 'Kelola mata pelajaran dan kategorinya.');
    const subjects = await DB.getSubjects();
    const subArr = DB.toArray(subjects).sort((a, b) => (a.order || 0) - (b.order || 0));
    const categoryLabel = {
      'agama': 'Agama',
      'standar': 'Umum',
      'lokal': 'Muatan Lokal',
      'kekhasan': 'Kekhasan'
    };
    const categoryBadge = {
      'agama': 'badge-success',
      'standar': 'badge-primary',
      'lokal': 'badge-warning',
      'kekhasan': 'badge-danger'
    };
    const rows = subArr.length ? subArr.map(s => `
      <tr>
        <td>${s.order || '-'}</td>
        <td><strong>${s.name}</strong></td>
        <td><span class="badge ${categoryBadge[s.category] || 'badge-primary'}">${categoryLabel[s.category] || s.category}</span></td>
        <td class="action-cell">
          <button class="btn btn-outline btn-sm" data-edit-sub="${s.id}"><i class="ph ph-pencil-simple"></i></button>
          <button class="btn btn-danger btn-sm" data-del-sub="${s.id}"><i class="ph ph-trash"></i></button>
        </td>
      </tr>
    `).join('') : '<tr><td colspan="4" class="text-center text-muted">Belum ada mata pelajaran.</td></tr>';
    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Daftar mata pelajaran</h3>
          <button class="btn btn-primary" id="btn-add-sub"><i class="ph ph-plus"></i> Tambah</button>
        </div>
        <div class="table-responsive">
          <table class="table"><thead><tr><th style="width:50px">No</th><th>Nama Mata Pelajaran</th><th>Kategori</th><th style="width:100px">Aksi</th></tr></thead>
          <tbody>${rows}</tbody></table>
        </div>
      </div>
      ${this._subjectModal()}
    `;
    document.getElementById('btn-add-sub').onclick = () => this._openSubjectModal(null, subArr.length + 1);
    container.querySelectorAll('[data-edit-sub]').forEach(btn => {
      btn.onclick = () => {
        const s = subArr.find(x => x.id === btn.dataset.editSub);
        if (s) this._openSubjectModal(s);
      };
    });
    container.querySelectorAll('[data-del-sub]').forEach(btn => {
      btn.onclick = async () => {
        if (!confirm('Yakin hapus mata pelajaran ini?')) return;
        await DB.deleteSubject(btn.dataset.delSub);
        this.renderSubjects(container);
      };
    });
    document.getElementById('form-sub').onsubmit = async (e) => {
      e.preventDefault();
      const id = document.getElementById('sub-id').value || null;
      await DB.saveSubject(id, {
        name: document.getElementById('sub-name').value.trim(),
        category: document.getElementById('sub-category').value,
        order: parseInt(document.getElementById('sub-order').value) || 1
      });
      this._closeModal('modal-sub');
      this.renderSubjects(container);
    };
  },
  _subjectModal() {
    return `
    <div class="modal-overlay" id="modal-sub">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title" id="sub-modal-title">Tambah mata pelajaran</h3>
          <button class="btn-icon" onclick="AdminPages._closeModal('modal-sub')"><i class="ph ph-x"></i></button>
        </div>
        <form id="form-sub">
          <div class="modal-body">
            <input type="hidden" id="sub-id">
            <div class="form-group">
              <label>Nama mata pelajaran</label>
              <input id="sub-name" required placeholder="Contoh: Matematika">
            </div>
            <div class="form-group">
              <label>Kategori</label>
              <select id="sub-category">
                <option value="agama">Pendidikan Agama</option>
                <option value="standar">Mata Pelajaran Umum</option>
                <option value="lokal">Muatan Lokal</option>
                <option value="kekhasan">Kekhasan Muhammadiyah</option>
              </select>
            </div>
            <div class="form-group">
              <label>Urutan tampil</label>
              <input id="sub-order" type="number" min="1" value="1">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="AdminPages._closeModal('modal-sub')">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>`;
  },
  _openSubjectModal(existing, nextOrder) {
    document.getElementById('sub-modal-title').innerText = existing ? 'Edit mata pelajaran' : 'Tambah mata pelajaran';
    document.getElementById('sub-id').value = existing ? existing.id : '';
    document.getElementById('sub-name').value = existing ? existing.name : '';
    document.getElementById('sub-category').value = existing ? existing.category : 'standar';
    document.getElementById('sub-order').value = existing ? existing.order : (nextOrder || 1);
    document.getElementById('modal-sub').classList.add('active');
  },
  // ========== DATA EKSTRAKURIKULER ==========
  async renderExtracurriculars(container) {
    Router.setTitle('Ekstrakurikuler', 'Kelola daftar ekstrakurikuler sekolah.');
    const ekskuls = await DB.getExtracurriculars();
    const eksArr = DB.toArray(ekskuls).sort((a, b) => (a.order || 0) - (b.order || 0));
    const rows = eksArr.length ? eksArr.map(e => `
      <tr>
        <td>${e.order || '-'}</td>
        <td><strong>${e.name}</strong></td>
        <td class="action-cell">
          <button class="btn btn-outline btn-sm" data-edit-eks="${e.id}"><i class="ph ph-pencil-simple"></i></button>
          <button class="btn btn-danger btn-sm" data-del-eks="${e.id}"><i class="ph ph-trash"></i></button>
        </td>
      </tr>
    `).join('') : '<tr><td colspan="3" class="text-center text-muted">Belum ada ekstrakurikuler.</td></tr>';
    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Daftar Ekstrakurikuler</h3>
          <button class="btn btn-primary" id="btn-add-eks"><i class="ph ph-plus"></i> Tambah</button>
        </div>
        <div class="table-responsive">
          <table class="table"><thead><tr><th style="width:50px">No</th><th>Nama Ekstrakurikuler</th><th style="width:100px">Aksi</th></tr></thead>
          <tbody>${rows}</tbody></table>
        </div>
      </div>
      ${this._extracurricularModal()}
    `;
    document.getElementById('btn-add-eks').onclick = () => this._openExtracurricularModal(null, eksArr.length + 1);
    container.querySelectorAll('[data-edit-eks]').forEach(btn => {
      btn.onclick = () => {
        const e = eksArr.find(x => x.id === btn.dataset.editEks);
        if (e) this._openExtracurricularModal(e);
      };
    });
    container.querySelectorAll('[data-del-eks]').forEach(btn => {
      btn.onclick = async () => {
        if (!confirm('Yakin hapus ekstrakurikuler ini?')) return;
        await DB.deleteExtracurricular(btn.dataset.delEks);
        this.renderExtracurriculars(container);
      };
    });
    document.getElementById('form-eks').onsubmit = async (e) => {
      e.preventDefault();
      const id = document.getElementById('eks-id').value || null;
      await DB.saveExtracurricular(id, {
        name: document.getElementById('eks-name').value.trim(),
        order: parseInt(document.getElementById('eks-order').value) || 1
      });
      this._closeModal('modal-eks');
      this.renderExtracurriculars(container);
    };
  },
  _extracurricularModal() {
    return `
    <div class="modal-overlay" id="modal-eks">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title" id="eks-modal-title">Tambah ekstrakurikuler</h3>
          <button class="btn-icon" onclick="AdminPages._closeModal('modal-eks')"><i class="ph ph-x"></i></button>
        </div>
        <form id="form-eks">
          <div class="modal-body">
            <input type="hidden" id="eks-id">
            <div class="form-group">
              <label>Nama ekstrakurikuler</label>
              <input id="eks-name" required placeholder="Contoh: Hizbul Wathan (HW)">
            </div>
            <div class="form-group">
              <label>Urutan tampil</label>
              <input id="eks-order" type="number" min="1" value="1">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="AdminPages._closeModal('modal-eks')">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>`;
  },
  _openExtracurricularModal(existing, nextOrder) {
    document.getElementById('eks-modal-title').innerText = existing ? 'Edit ekstrakurikuler' : 'Tambah ekstrakurikuler';
    document.getElementById('eks-id').value = existing ? existing.id : '';
    document.getElementById('eks-name').value = existing ? existing.name : '';
    document.getElementById('eks-order').value = existing ? existing.order : (nextOrder || 1);
    document.getElementById('modal-eks').classList.add('active');
  },
  // ========== HELPERS ==========
  _closeModal(id) {
    document.getElementById(id).classList.remove('active');
  }
};
// Route registration
Router.add('#/admin/characters', c => AdminPages.renderCharacters(c));
Router.add('#/admin/users', c => AdminPages.renderUsers(c));
Router.add('#/admin/classes', c => AdminPages.renderClasses(c));
Router.add('#/admin/subjects', c => AdminPages.renderSubjects(c));
Router.add('#/admin/extracurriculars', c => AdminPages.renderExtracurriculars(c));
Router.add('#/admin/students/:id', (c, classId) => AdminPages.renderStudents(c, classId));