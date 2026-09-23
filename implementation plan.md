# Rencana Transformasi Dasbor Digital Sekolah Universal

Pembaruan ini bertujuan untuk mengubah aplikasi E-Rapor Karakter saat ini menjadi **Sistem Digital Terpusat SD Muhammadiyah 1 Sedati**. Sistem tidak lagi hanya mencatat nilai karakter, melainkan menjadi pusat aktivitas harian guru dan administrasi sekolah.

## ⚠️ User Review Required
> [!IMPORTANT]
> **Persetujuan Fitur Baru**: Silakan tinjau usulan modul tambahan di bawah. Apakah ada fitur spesifik yang ingin dihilangkan atau ditambahkan pada rilis pertama (Fase 1) ini?
> **Koordinat Sekolah**: Untuk presensi berbasis lokasi, kita akan membutuhkan titik pusat koordinat (Latitude, Longitude) SD Muhammadiyah 1 Sedati. Fitur GPS pada web/browser akan meminta izin lokasi pengguna.

## ❓ Open Questions
> [!TIP]
> 1. **Perangkat Absensi**: Apakah guru akan melakukan absensi menggunakan *smartphone* pribadi (web browser) atau tablet khusus yang disediakan sekolah? Ini menentukan bagaimana antarmuka kamera/lokasi dioptimalkan.
> 2. **Alur Izin Siswa**: Apakah pengajuan izin siswa dilakukan oleh wali murid melalui aplikasi/WhatsApp ke guru, kemudian guru yang memasukkannya ke sistem? Ataukah wali murid memiliki akses login sendiri? (Rekomendasi awal: Guru yang menginputkan izin berdasarkan laporan orang tua agar lebih terkontrol).

---

## 1. Usulan Struktur Menu & Modul Baru

Sistem akan dirancang secara *mobile-first* dengan navigasi bawah (*bottom navigation*) untuk akses cepat dan menu *sidebar/drawer* untuk fitur lengkap.

### A. Beranda (Dashboard)
- **Ringkasan Harian**: Jumlah siswa hadir/absen, pengingat jadwal mengajar.
- **Tombol Aksi Cepat**: "Presensi Datang", "Presensi Pulang", "Input Karakter Cepat".
- **Papan Informasi**: Pengumuman sekolah / mading digital ringkas.

### B. Kehadiran & Izin (Fitur Inti Baru)
1. **Presensi Guru (Geofencing)**
   - Tombol *Check-in/Check-out*.
   - Validasi radius 40 meter dari koordinat sekolah menggunakan API Geolocation HTML5.
   - Jika di luar radius, sistem mengunci tombol dan menampilkan pesan "Anda berada di luar area sekolah".
2. **Presensi Siswa (Oleh Guru)**
   - Antarmuka *tap-to-mark* (Hadir/Sakit/Izin/Alpa) untuk satu kelas sekaligus.
   - Selesai dalam hitungan detik.
3. **Manajemen Izin & Cuti**
   - Pengajuan izin guru (lampiran foto surat dokter/keterangan).
   - Pencatatan izin siswa oleh wali kelas.
   - **Integrasi**: Data absensi dan izin otomatis terkalkulasi dan masuk ke buku laporan E-Rapor di akhir semester.

### C. Akademik & Karakter (Eksisting, Disempurnakan)
- Penilaian Karakter (seperti yang sudah dirancang).
- Jurnal Mengajar Harian (Catatan materi yang diajarkan hari ini - *highly recommended*).
- Jadwal Pelajaran (Tampilan ringkas per hari).

### D. Administrasi & Komunikasi (Usulan Tambahan)
- **Buku Penghubung Digital**: Catatan dari guru ke orang tua (jika nantinya ada akses untuk orang tua).
- **Inventaris Kelas**: Laporan cepat barang rusak (misal: meja patah, proyektor mati) langsung ke bagian sarpras.
- **Kalender Akademik**: Hari libur, ujian, kegiatan sekolah.

---

## 2. Rencana Perubahan Database (Firebase RTDB)

Kita akan menambahkan dan memperluas struktur database saat ini agar mendukung sistem universal.

### [NEW] `school_settings/`
Penyimpanan konfigurasi global sekolah.
```json
{
  "location": {
    "lat": -7.387195, // (Contoh)
    "lng": 112.759298,
    "radius_meters": 40
  }
}
```

### [NEW] `teacher_attendance/`
Log presensi harian guru.
```json
{
  "date_20260922": {
    "teacherId_1": {
      "time_in": "06:45",
      "location_in": {"lat": -7.3872, "lng": 112.7593},
      "status_in": "on_time",
      "time_out": "15:10",
      "status": "present"
    }
  }
}
```

### [NEW] `student_attendance/`
Rekap harian per kelas, akan diagregasi ke E-Rapor.
```json
{
  "date_20260922": {
    "classId_4A": {
      "studentId_1": "H", // Hadir
      "studentId_2": "S", // Sakit
      "studentId_3": "I", // Izin
      "studentId_4": "A"  // Alpa
    }
  }
}
```

### [NEW] `leave_requests/`
Sistem tiket pengajuan izin.
```json
{
  "requestId_1": {
    "user_type": "student", // atau "teacher"
    "user_id": "studentId_2",
    "start_date": "2026-09-23",
    "end_date": "2026-09-25",
    "type": "sick",
    "reason": "Demam berdarah",
    "attachment_url": "...", // Opsional foto surat
    "status": "approved", // pending, approved, rejected
    "approved_by": "teacherId_1"
  }
}
```

---

## 3. Strategi Pengembangan UI/UX (Sesuai Panduan Profesional)

Sesuai dengan pedoman estetika dan efisiensi ruang:
1. **Fluid Typography & Compact Layout**: Menghindari pemborosan *whitespace*. Tabel absensi siswa akan dibuat dalam bentuk *card list* yang padat (seperti saklar *toggle* H/S/I/A) sehingga guru bisa mengabsen 30 siswa tanpa *scroll* berlebih.
2. **Micro-interactions**: Animasi *shimmer* saat memuat lokasi GPS, perubahan warna halus (hijau untuk dalam radius, abu-abu jika di luar radius).
3. **Copywriting Membumi**: Menggunakan kalimat natural seperti "Sedang mencari lokasi Anda..." atau "Berhasil mencatat kehadiran" (menghindari istilah kaku seperti "Location acquired successfully").
4. **Struktur CSS Modular**: Menggunakan arsitektur `base`, `components`, `layout`, dan `utilities` agar kode terorganisir seiring bertambah besarnya sistem.

---

## 4. Rencana Verifikasi

### Pengujian Otomatis / Validasi Logika
- Uji perhitungan jarak menggunakan formula Haversine (memastikan radius 40 meter akurat).
- Simulasi titik koordinat palsu (GPS Spoofing test) untuk melihat ketahanan sistem keamanan presensi guru.

### Pengujian Manual & Visual
- Membuka antarmuka presensi guru menggunakan *DevTools Mobile View* dan perangkat fisik (smartphone) untuk memastikan *prompt* izin lokasi muncul dengan benar.
- Mengisi absensi satu kelas secara acak dan memeriksa apakah data tersebut terakumulasi pada tampilan E-Rapor siswa secara waktu nyata.
