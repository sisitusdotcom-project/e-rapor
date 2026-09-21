Saya akan memberikan file **`format-umum.html`** sebagai **format acuan utama rapor umum SD Muhammadiyah 1 Sedati**.

Tugas kamu sekarang adalah **mengembangkan aplikasi yang sudah ada menjadi Sistem Rapor SD Muhammadiyah 1 Sedati**, bukan membuat aplikasi baru dari nol.

### 1. WAJIB PELAJARI FILE `format-umum.html`

Baca dan analisis seluruh isi `format-umum.html`.

Jadikan file tersebut sebagai **referensi utama struktur, urutan, istilah, komponen, dan tampilan rapor**.

Jangan mengarang format rapor baru jika sudah tersedia di file tersebut.

Pertahankan komponen yang memang ada di format tersebut, termasuk secara umum:

* Identitas peserta didik
* Mata pelajaran
* Nilai akhir
* Capaian kompetensi
* Kokurikuler
* Ekstrakurikuler
* Kehadiran
* Catatan wali kelas
* Tanggapan orang tua/wali
* Tanda tangan kepala sekolah, wali kelas, dan orang tua/wali
* Tahun ajaran dan semester

### 2. JANGAN HAPUS APLIKASI PENILAIAN KARAKTER YANG SUDAH DIBUAT

Aplikasi/modul karakter yang sudah selesai **TIDAK BOLEH DIHAPUS**.

Jadikan modul tersebut sebagai salah satu sumber data dalam Sistem Rapor.

Struktur besarnya menjadi:

**Sistem Rapor SD Muhammadiyah 1 Sedati**

* Data Master
* Data Siswa
* Data Guru
* Data Kelas
* Nilai Akademik
* Karakter & Perkembangan
* Kokurikuler
* Ekstrakurikuler
* Kehadiran
* Catatan Wali Kelas
* Cetak Rapor

Jadi aplikasi karakter yang sudah ada menjadi modul:

**Karakter & Perkembangan**

### 3. INTEGRASIKAN KARAKTER KE RAPOR

Data hasil penilaian karakter harus dapat digunakan ketika membuat rapor.

Namun **jangan memasukkan seluruh indikator mentah ke tabel rapor** karena akan membuat rapor terlalu padat.

Buat bagian khusus:

**PERKEMBANGAN KARAKTER**

Contohnya:

| Aspek          | Predikat    | Deskripsi |
| -------------- | ----------- | --------- |
| Religius       | Sangat Baik | ...       |
| Disiplin       | Baik        | ...       |
| Tanggung Jawab | Sangat Baik | ...       |
| Sosial         | Baik        | ...       |

Sesuaikan jumlah aspek dengan konfigurasi modul karakter yang sudah ada.

Deskripsi karakter sebaiknya dapat dibuat dari hasil penilaian/observasi sehingga guru tidak perlu mengetik semuanya dari nol.

### 4. JANGAN MENGUBAH FORMAT ASLI SECARA SEMBARANGAN

`format-umum.html` adalah **referensi format rapor dari sekolah**.

Pertahankan:

* struktur halaman
* urutan informasi
* istilah
* tabel
* ukuran dan orientasi halaman
* bagian tanda tangan
* bagian yang memang diperlukan untuk pencetakan

Jika ada bagian yang belum terhubung ke sistem, tugas kamu adalah **membuatnya dinamis**, bukan mengganti formatnya dengan desain lain.

### 5. UBAH FORMAT STATIS MENJADI DINAMIS

Data rapor harus berasal dari database.

Guru harus dapat mengisi/mengelola:

* nilai mata pelajaran
* capaian kompetensi
* kokurikuler
* ekstrakurikuler
* kehadiran
* catatan wali kelas
* tanggapan orang tua
* data karakter

Kemudian sistem menghasilkan rapor berdasarkan data tersebut.

Jangan menggunakan data dummy sebagai data utama aplikasi.

### 6. DATA MASTER

Pastikan sistem memiliki struktur data yang jelas untuk:

* Tahun ajaran
* Semester
* Kelas
* Siswa
* Guru
* Wali kelas
* Mata pelajaran
* Orang tua/wali
* Ekstrakurikuler
* Kokurikuler
* Aspek karakter
* Indikator karakter

Relasi antar-data harus jelas.

Contoh:

**Siswa → Kelas → Wali Kelas → Tahun Ajaran → Semester → Rapor**

dan

**Siswa → Penilaian Akademik**

**Siswa → Penilaian Karakter**

**Siswa → Ekstrakurikuler**

**Siswa → Kehadiran**

### 7. ROLE DAN HAK AKSES

Pertahankan/implementasikan role:

* `admin`
* `guru`
* `kepala_sekolah`
* `orang_tua`

Aturan dasar:

**Admin**

* Mengelola seluruh data master
* Mengelola pengguna
* Mengatur tahun ajaran/semester
* Mengatur mata pelajaran
* Mengatur konfigurasi sistem

**Guru/Wali Kelas**

* Mengisi nilai sesuai kelas/mata pelajaran yang menjadi kewenangannya
* Mengisi penilaian karakter
* Mengisi kokurikuler
* Mengisi ekstrakurikuler
* Mengisi kehadiran
* Mengisi catatan wali kelas
* Melihat dan mencetak rapor kelas yang menjadi kewenangannya

**Kepala Sekolah**

* Melihat rekap
* Memeriksa rapor
* Melihat perkembangan siswa
* Melakukan validasi/approval jika diperlukan
* Mencetak rapor

**Orang Tua/Wali**

* Read-only
* Hanya dapat melihat data anak yang terhubung dengannya
* Dapat melihat/mengunduh rapor
* Tidak dapat mengubah nilai

### 8. PENILAIAN AKADEMIK

Buat sistem input nilai yang cepat dan nyaman untuk guru.

Minimal:

* Pilih tahun ajaran
* Pilih semester
* Pilih kelas
* Pilih mata pelajaran
* Pilih siswa
* Masukkan nilai akhir
* Masukkan capaian kompetensi

Jika memungkinkan, buat input berbentuk tabel sehingga guru dapat memasukkan banyak siswa dengan cepat.

### 9. MODUL KARAKTER

Pertahankan mekanisme aplikasi karakter yang sudah dibuat.

Pastikan tetap tersedia:

* Penilaian karakter
* Observasi
* Skala penilaian yang sudah digunakan
* Rekap perkembangan
* Riwayat penilaian

Kemudian tambahkan proses:

**Penilaian Karakter → Rekap → Data Rapor**

Jangan membuat sistem karakter kedua yang terpisah jika fitur yang sama sudah tersedia.

### 10. CETAK RAPOR

Buat generator rapor berdasarkan `format-umum.html`.

Targetnya:

**Data database → Template rapor → Preview → Cetak/PDF**

Rapor harus nyaman dicetak dan tidak berantakan ketika menggunakan browser Print / Save as PDF.

Perhatikan:

* ukuran kertas
* margin
* page break
* tabel tidak terpotong sembarangan
* header/footer
* tanda tangan
* halaman lanjutan
* tampilan print tidak membawa elemen UI aplikasi

### 11. JANGAN RUSAK FITUR YANG SUDAH ADA

Sebelum mengubah kode:

1. Periksa struktur project.
2. Identifikasi modul karakter yang sudah selesai.
3. Identifikasi Firebase/Auth/database yang sudah digunakan.
4. Identifikasi komponen yang dapat digunakan kembali.
5. Jangan menghapus fitur yang masih relevan.
6. Jangan membuat ulang sesuatu yang sudah tersedia tanpa alasan teknis.

Jika perlu refactor, lakukan secara bertahap.

### 12. DATABASE DAN KEAMANAN

Gunakan struktur database yang konsisten dengan project yang sudah ada.

Pastikan:

* Firebase Authentication digunakan dengan benar.
* Role tidak hanya disimpan sebagai tampilan frontend.
* Firebase Security Rules membatasi akses berdasarkan role dan kepemilikan data.
* Orang tua hanya dapat mengakses data anaknya.
* Guru hanya dapat mengakses kelas/data yang menjadi kewenangannya.
* Jangan menaruh secret/API key sensitif di source code frontend.
* Jangan mengandalkan validasi JavaScript saja untuk keamanan.

### 13. MOBILE-FIRST

Aplikasi input guru harus nyaman digunakan melalui HP.

Prioritas:

**cepat → sederhana → mudah dipahami → minim klik**

Terutama untuk:

* input nilai
* penilaian karakter
* observasi
* absensi
* catatan wali kelas

Sedangkan halaman rapor harus dioptimalkan untuk **preview dan pencetakan A4** sesuai format acuan.

### 14. JANGAN MENUNGGU KONFIRMASI

Jangan berhenti hanya karena ada detail sekolah yang belum diketahui.

Jika suatu aturan belum tersedia:

* buat konfigurasi yang dapat diubah admin
* gunakan struktur yang fleksibel
* jangan mengunci asumsi permanen ke dalam database

Jika menemukan bagian `format-umum.html` yang belum jelas, pertahankan struktur aslinya dan buat implementasinya fleksibel.

### 15. PRIORITAS PENGERJAAN

Kerjakan dengan urutan:

**FASE 1**
Analisis project yang sudah ada + `format-umum.html`

**FASE 2**
Database + Auth + Role + Security Rules

**FASE 3**
Data Master

**FASE 4**
Nilai Akademik

**FASE 5**
Integrasi modul Karakter yang sudah ada

**FASE 6**
Kokurikuler + Ekstrakurikuler + Kehadiran

**FASE 7**
Catatan Wali Kelas + Tanggapan Orang Tua

**FASE 8**
Generator Rapor berdasarkan `format-umum.html`

**FASE 9**
Preview + Print/PDF

**FASE 10**
Testing seluruh role dan alur

### 16. HASIL AKHIR YANG SAYA INGINKAN

Bukan sekadar halaman contoh.

Saya ingin **sistem rapor yang benar-benar dapat digunakan**, dengan alur:

**Admin menyiapkan data**
↓
**Guru mengisi nilai**
↓
**Guru melakukan penilaian karakter**
↓
**Guru mengisi kokurikuler/ekstrakurikuler/kehadiran/catatan**
↓
**Sistem menggabungkan seluruh data**
↓
**Rapor terbentuk mengikuti `format-umum.html`**
↓
**Kepala sekolah memeriksa**
↓
**Rapor dapat dicetak/PDF**
↓
**Orang tua dapat melihat rapor anaknya**

### 17. SEBELUM SELESAI, WAJIB TEST

Test minimal:

* Login admin
* Login guru
* Login kepala sekolah
* Login orang tua
* Pembatasan akses setiap role
* Tambah/edit siswa
* Penempatan siswa ke kelas
* Input nilai
* Input karakter
* Input kokurikuler
* Input ekstrakurikuler
* Input kehadiran
* Catatan wali kelas
* Generate rapor
* Preview rapor
* Print/PDF
* Akses orang tua hanya ke anaknya

Jangan menyatakan selesai jika fitur hanya berupa UI/mockup tanpa alur database yang bekerja.

### LAPORAN AKHIR

Setelah implementasi selesai, berikan laporan singkat:

1. File yang dibuat/diubah
2. Modul yang berhasil dibuat
3. Struktur database
4. Role dan permission
5. Integrasi modul karakter
6. Integrasi `format-umum.html`
7. Sistem cetak/PDF
8. Security Rules
9. Testing yang sudah dilakukan
10. Hal yang masih perlu dikonfigurasi sekolah

**Fokus utama: sistem harus berfungsi. Jangan menghabiskan waktu untuk dekorasi sebelum alur rapor benar-benar berjalan.**