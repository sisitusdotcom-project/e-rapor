# Walkthrough: Dasbor Digital Sekolah Universal

Sistem E-Rapor sekarang telah berevolusi menjadi **Dasbor Digital Sekolah**. Seluruh kode telah ditulis dengan mempertimbangkan pedoman *mobile-first*, efisiensi ruang layar, serta estetika visual premium tanpa kesan monoton.

## Apa Saja yang Berubah?

### 1. Struktur Navigasi Baru (Sidebar Guru)
Tautan menu untuk Guru telah diperbarui untuk mendukung alur kerja harian secara menyeluruh:
- **Beranda**: Menampilkan waktu real-time, status presensi saat ini, dan akses cepat ke fitur utama.
- **Presensi Guru**: Halaman khusus untuk *Check-In / Check-Out* berbasis GPS.
- **Absensi Siswa**: Halaman khusus bagi guru untuk mengabsen siswanya di dalam kelas.
- **E-Rapor (Kelas)**: Halaman lama untuk menilai karakter/observasi sekarang dipindahkan ke menu terpisah agar tidak bercampur dengan presensi harian.

### 2. Fitur Presensi Guru Berbasis Geofencing
> [!TIP]
> Fitur ini menggunakan teknologi **HTML5 Geolocation API** dan menghitung jarak langsung di sisi klien menggunakan **Formula Haversine**.

- Secara *default*, sistem telah diisi dengan koordinat pusat SD Muhammadiyah 1 Sedati dan radius toleransi sejauh **40 meter**.
- Saat membuka menu ini, aplikasi akan otomatis memohon izin GPS. Jika guru berada dalam radius, tombol **Presensi Datang** / **Presensi Pulang** akan menyala (warna hijau premium).
- Terdapat indikator animasi halus (*shimmer/spinner*) saat mengambil lokasi, dengan copywriting natural (misal: "Mencari Lokasi..." atau "Berada di Area Sekolah").

### 3. Fitur Absensi Siswa Cepat (Tap-to-Mark)
- Guru tidak perlu mengetik nama atau membuka profil satu per satu.
- Aplikasi menampilkan daftar absensi dalam bentuk **Card List Padat** yang sangat menghemat ruang di layar HP (*Space Efficient*).
- Setiap siswa memiliki 4 saklar interaktif (H / S / I / A) dengan perubahan warna *micro-interaction* yang elegan:
  - **Hadir (H)**: Hijau (*Emerald*)
  - **Sakit (S)**: Biru (*Blue*)
  - **Izin (I)**: Kuning/Jingga (*Amber*)
  - **Alpa (A)**: Merah (*Red*)
- Guru dapat mengisi 30+ siswa dengan cepat, lalu menekan 1 tombol **Simpan Absensi** di bagian bawah yang melayang (*sticky footer*).

### 4. Arsitektur Database Siap Skala
Struktur `Firebase RTDB` telah diperluas tanpa merusak data lama:
- `school_settings`: Menyimpan koordinat sekolah pusat secara global.
- `teacher_attendance`: Merekam riwayat jam masuk dan jam pulang guru setiap hari.
- `student_attendance_daily`: Merekam status absensi siswa per hari untuk direkap secara otomatis pada akhir semester.

## Cara Melakukan Verifikasi
1. Silakan muat ulang (Refresh) aplikasi di browser atau masuk sebagai akun **Guru**.
2. Anda akan langsung melihat halaman **Beranda** yang baru (berwarna hijau gradien elegan dengan waktu berjalan).
3. Cobalah klik **Aksi Cepat -> Presensi Saya**. Izinkan lokasi pada browser Anda. Jika Anda sedang tidak berada di sekitar SD Muhammadiyah 1 Sedati, sistem akan mendeteksi jarak Anda dan memblokir presensi dengan pesan yang sopan.
4. Buka **Aksi Cepat -> Absensi Siswa**, pilih kelas yang Anda ampu, dan cobalah mengklik tombol-tombol Hadir, Sakit, Izin, atau Alpa. Lihat betapa halus dan cepat animasinya.

> [!NOTE]
> Semua pembaruan ini telah disusun mematuhi pilar anti-AI (tanpa *copywriting* kaku, menggunakan warna *shade* premium, dan tata letak tidak boros). Jika ada bagian UI yang ingin sedikit digeser atau disesuaikan dengan kebiasaan Bapak/Ibu Guru, Anda cukup memberi tahu saya.
