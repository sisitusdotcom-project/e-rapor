# Panduan Kolaborasi Skill: Desain Premium & Anti-Deteksi AI (Impeccable)

Dokumen ini mendefinisikan aturan kolaborasi (sinergi) antara skill desain dan skill penyamaran AI (`impeccable`). Tujuannya adalah untuk menghasilkan antarmuka yang **memukau secara visual, tidak monoton, efisien dalam penggunaan ruang (tidak makan space),** dan **terlihat natural seperti buatan manusia (tidak terdeteksi sebagai hasil generate AI)**.

## 1. Pembagian Peran

### A. Pilar Estetika (Taste-Skill & Redesign)
Fokus pada **Visual, Tata Letak, dan Kepadatan Ruang (Space Efficiency)**.
- **Tujuan:** Membuat tampilan yang dinamis ("tidak monoton") namun tetap kompak.
- **Tugas Utama:** 
  - **Dinamis & Tidak Monoton:** Memecah kesimetrian tata letak (asymmetric grid, masonry) dan menggunakan variasi ukuran antar elemen.
  - **Efisiensi Ruang (Tidak Makan Space):** Menghindari padding atau margin raksasa yang tidak perlu. Desain harus *breathable* (lega) namun padat informasi. Gunakan tata letak grid yang efisien, komponen *collapsible*, atau teks yang tertata agar pengguna tidak harus melakukan *scroll* yang terlalu panjang.
  - **Tipografi Berkarakter:** Gunakan font yang kuat (misal: Outfit, Cabinet Grotesk, dll) dengan skala ukuran (*font-size*) yang wajar dan proporsional.
  - **Visual Elegan:** Menggunakan palet warna elegan (off-white, off-black, tinted shadows) dan tekstur background halus (misal: *noise/grain*).

### B. Pilar Anti-AI (Impeccable & Human-like)
Fokus pada **Kewajaran, Copywriting, dan Struktur Kode**.
- **Tujuan:** Membuat hasil akhir tidak terdeteksi oleh radar atau pola khas AI.
- **Tugas Utama:**
  - **Copywriting Natural:** Dilarang keras menggunakan kata-kata klise AI seperti *"Elevate", "Seamless", "Unleash", "Next-Gen"*. Gunakan bahasa yang langsung, spesifik, dan membumi (natural human voice).
  - **Data Dummy Realistis:** Hindari nama generik seperti "John Doe", "Acme Corp", atau angka bulat seperti `99.99%`. Gunakan data yang berantakan dan organik (misal: "Budi Santoso", `47.2%`). Jangan pernah menggunakan *Lorem Ipsum*.
  - **Struktur Kode Organik:** Berikan komentar kode yang natural (seperti manusia yang sedang menjelaskan) dan hindari pola komentar blok yang sangat kaku yang sering dihasilkan AI.
  - **Penanganan Teks:** Gunakan *sentence case* untuk judul, hindari penggunaan Title Case yang berlebihan.

## 2. Aturan Sinergi (Golden Rules)

Jika AI (Agen) diminta untuk mendesain atau menulis kode baru, agen **WAJIB** menggabungkan kedua pilar ini:

1. **Estetika Dinamis & Konten Membumi.** 
   - *Contoh salah:* Desain yang memakan satu layar penuh hanya untuk 3 baris teks (terlalu banyak whitespace) dengan copy AI "Unleash Your Potential".
   - *Contoh benar:* Desain grid asimetris yang kompak dan efisien, dengan copywriting "Kelola pendaftaran siswa lebih cepat dengan sistem terpusat."
2. **Hindari "Pola AI" di CSS & HTML.**
   - Jangan selalu menggunakan susunan 3 kolom kartu yang ukurannya sama persis (paling sering dibuat AI) yang dipisahkan ruang raksasa. Gunakan variasi hierarki yang cerdas dan nama kelas CSS yang alami.
3. **Jangan Over-Engineer & Boros Ruang.**
   - AI sering kali menambahkan elemen/div berlapis-lapis dan *white-space* yang berlebihan. Jaga struktur DOM tetap bersih dan informasi tersusun padat namun rapi agar **tidak makan space**.

---
**Instruksi Global untuk Agen AI:** 
Setiap kali Anda menerima tugas pembuatan halaman, redesain, atau penambahan fitur di workspace ini, baca dan taati dokumen ini. Pastikan hasil akhir Anda selalu lulus **Uji Estetika (Tidak Monoton)**, **Uji Efisiensi (Tidak Makan Space)**, dan **Uji Penyamaran (Tidak ada jejak default LLM)**.

Berikut **penambahan panduan** yang bisa langsung disisipkan ke dalam dokumen asli:

---

## 3. Pendekatan Mobile-First & Profesionalisme Visual 100%

### A. Filosofi Mobile-First
Desain dimulai dari layar terkecil (`320px–375px`), lalu diperluas ke atas (*progressive enhancement*).

- **Breakpoint wajib:**
  - `base` : 0–639px (mobile)
  - `sm`   : 640–767px (phablet)
  - `md`   : 768–1023px (tablet)
  - `lg`   : 1024–1279px (desktop kecil)
  - `xl`   : 1280px+ (desktop besar)

- **Aturan penulisan CSS:**
  - Tulis gaya *base* (mobile) **tanpa media query** terlebih dahulu.
  - Gunakan `min-width` media query untuk menambahkan gaya pada layar lebih besar.
  - Hindari `max-width` kecuali untuk *exception* spesifik.

- **Sentuhan mobile yang profesional:**
  - Tap target minimal **44×44px** (standar Apple HIG).
  - Spasi antar elemen interaktif minimal **8px** agar tidak salah sentuh.
  - Font *body* minimal **15–16px** (iOS Safari akan zoom otomatis jika lebih kecil).
  - Gunakan `padding: 16px` sebagai default tepi konten mobile (bukan 24px atau 32px yang boros space).

---

### B. Struktur & Grid Profesional

**1. Grid System yang Disarankan:**
- **Mobile (1–2 kolom):** Gunakan 4-column grid dengan gutter 12px.
- **Tablet (2–4 kolom):** 8-column grid, gutter 16px.
- **Desktop (4–12 kolom):** 12-column grid, gutter 20–24px.

**2. Hindari Pola Grid Awam:**
- ❌ 3 kartu sejajar identik (pola generik AI).
- ✅ Gunakan **featured card** (1 kartu besar) + 2 kartu kecil di sampingnya, atau **masonry grid** dengan tinggi bervariasi.
- ✅ Pada mobile, tumpuk kartu secara vertikal **TAPI** variasikan lebar (misal: kartu 1 full-width, kartu 2 & 3 berdampingan 50%-50%).

**3. Penataan Section Profesional:**
- Gunakan **staggered layout** (zigzag): teks kiri – gambar kanan, lalu selang-seling.
- Manfaatkan **header strip** (pita judul section) dengan aksen garis kecil/bullet, bukan sekadar teks tebal polos.
- Gunakan **divider subtle** (`border-bottom: 1px solid rgba(0,0,0,0.08)`) untuk memisahkan section alih-alih whitespace raksasa.

---

### C. Icon yang Profesional

| Aturan | Detail |
|--------|--------|
| **Library** | Phosphor Icons, Lucide, atau Tabler Icons (hindari Font Awesome generik). |
| **Ukuran mobile** | 20–22px (standar), 18px untuk ikon inline kecil. |
| **Stroke width** | 1.5–2px untuk konsistensi visual. |
| **Warna** | Jangan hitam pekat `#000`. Gunakan `currentColor` dengan opacity warisan teks, atau warna netral seperti `#4A4A5A`. |
| **Dalam kartu/button** | Ikon selalu punya padding minimal 8px dari tepi, dan sejajar vertikal dengan teks (`display: inline-flex; align-items: center`). |
| **Hindari** | Ikon dalam lingkaran besar yang memakan 60px+ tanpa alasan fungsional. Pada mobile, ikon *container* maksimal 40×40px. |

---

### D. Kartu (Card) yang Profesional & Tidak Boros Space

**1. Struktur Dasar Card yang Direkomendasikan:**
```
┌──────────────────────┐
│  [badge / label kecil]│  ← opsional, max 1 baris
│  Judul Card (16px)   │  ← sentence case
│  Deskripsi 1-2 baris │  ← 14px, warna muted
│  [CTA kecil / ikon →]│  ← di bawah, compact
└──────────────────────┘
```

**2. Aturan Spasi Internal Card:**
- Padding: **12–16px** (mobile), 16–20px (desktop). Hindari padding 24px+ untuk card.
- Gap antar elemen dalam card: **8–12px**.
- Jangan ada *redundant whitespace* di dalam card (misal: padding atas dan bawah tidak simetris tanpa alasan).

**3. Variasi Card (Anti-Monoton):**
- **Card horizontal** (gambar kiri, teks kanan) untuk mobile – menghemat ruang vertikal.
- **Card ringkas** (compact card) tanpa gambar, hanya ikon kecil + teks.
- **Card dengan aksen border-left** berwarna, bukan shadow tebal default AI.
- **Stat card** minimalis: angka besar (24–28px) + label kecil di bawahnya.

**4. Shadow yang Elegan:**
```css
/* Bukan shadow tebal hitam */
box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);

/* Bukan */
box-shadow: 0 4px 20px rgba(0,0,0,0.15); /* ❌ terlalu generik AI */
```

---

### E. Ceklist Profesionalisme Akhir (100%)

Sebelum finalisasi, pastikan:

- [ ] **Mobile**: Semua teks terbaca tanpa horizontal scroll. Tidak ada elemen menyempit di bawah 280px.
- [ ] **Tap target**: Semua button/link ≥ 44×44px area sentuh.
- [ ] **Grid tidak monoton**: Minimal 1 section menggunakan layout asimetris/staggered.
- [ ] **Card bervariasi**: Tidak semua card bentuk dan ukurannya identik.
- [ ] **Ikon konsisten**: Satu library, satu stroke width, ukuran proporsional terhadap teks.
- [ ] **Spacing efisien**: Tidak ada section dengan whitespace >80px di mobile tanpa alasan konten.
- [ ] **Copywriting lulus uji**: Tidak ada kata "Elevate", "Seamless", "Unleash", "Next-Gen".
- [ ] **Data dummy realistis**: Nama lokal/umum, angka desimal organik, bukan Lorem Ipsum.
- [ ] **Komentar kode natural**: Seperti catatan developer sungguhan, bukan esai penjelasan.
- [ ] **Shadow & border subtle**: Tidak ada `box-shadow` hitam tebal atau border `#ddd` mentah.

---

### F. Contoh Potongan Kode Mobile-First (Referensi Cepat)

```css
/* === BASE: Mobile (tanpa media query) === */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 16px;
}

.card {
  padding: 14px;
  border-radius: 10px;
  background: #fafaf8;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

/* === sm: 640px+ (2 kolom variatif) === */
@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: 1fr 1fr;
  }
  .card:first-child {
    grid-column: span 2; /* featured card lebih lebar */
  }
}

/* === lg: 1024px+ (3 kolom, satu lebih kecil) === */
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: 1.2fr 0.8fr 1fr;
    gap: 16px;
  }
  .card:first-child {
    grid-column: span 1;
  }
}
```

---
Tentu. Berikut **saran lanjutan** untuk menyempurnakan panduan, mencakup aspek yang sering luput namun sangat berpengaruh pada profesionalisme 100%:

---

## 4. Tipografi Profesional (Melampaui Sekadar Pilih Font)

### A. Fluid Typography
Jangan gunakan ukuran font statis. Gunakan `clamp()` agar tipografi bernapas secara mulus dari mobile ke desktop.

```css
/* Judul halaman */
h1 { font-size: clamp(1.5rem, 4vw, 2.5rem); }

/* Body text */
p { font-size: clamp(0.938rem, 1.2vw, 1.063rem); }

/* Label kecil */
.label { font-size: clamp(0.75rem, 1vw, 0.813rem); }
```

### B. Line-Height Berbasis Skala
- Mobile: `line-height` lebih ketat (1.3–1.5) karena layar sempit.
- Desktop: `line-height` lebih longgar (1.5–1.7) untuk paragraf panjang.
- Judul: selalu `line-height: 1.1–1.3`.

### C. Width Paragraf Maksimal
- Jangan biarkan teks mengular tanpa batas. Batasi `max-width: 65ch` pada paragraf untuk keterbacaan optimal.
- Untuk mobile, otomatis aman karena layar sempit. Untuk desktop, wajib diterapkan.

---

## 5. Warna & Aksesibilitas

### A. Kontras Minimum (WCAG AA)
- Teks normal: rasio kontras **4.5:1** terhadap background.
- Teks besar (≥18px bold / ≥24px regular): rasio **3:1**.
- Hindari abu-abu muda `#ccc` di atas putih untuk teks penting.

### B. Palet dengan Variasi Temperatur
- Jangan gunakan abu-abu murni (`#808080`). Campur sedikit biru/ungu untuk *cool gray* (`#6B7280`) atau coklat untuk *warm gray* (`#78716C`).
- Warna aksen: cukup 1–2 warna. Sisanya netral.

### C. Dark Mode (Opsional tapi Nilai Tambah)
- Jika implementasi, gunakan `prefers-color-scheme: dark` di media query.
- Hindari putih murni `#fff` di dark mode – gunakan `#f0f0f0` atau off-white.

---

## 6. Mikro-Interaksi & State Management

### A. Hover, Focus, Active
Setiap elemen interaktif **wajib** punya 3 state visual:
```css
.btn {
  transition: all 0.15s ease;
}
.btn:hover  { opacity: 0.9; transform: translateY(-1px); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.btn:active { transform: scale(0.97); }
```

### B. Skeleton Loading (Bukan Spinner Kosong)
- Saat data loading, tampilkan skeleton berbentuk konten (bukan spinner besar).
- Skeleton tidak boleh berwarna abu-abu pucat (#eee) – gunakan gradien subtle dengan animasi shimmer.

### C. Empty State yang Membumi
- Jangan gunakan ilustrasi generik. Gunakan teks natural: "Belum ada data siswa yang terdaftar. Klik tombol di atas untuk menambahkan."
- Hindari kalimat kosong: "No items found." (❌)

---

## 7. Navigasi & Layout yang Tidak Boros Space

### A. Bottom Navigation (Mobile)
- Maksimal **4–5 item** dengan ikon + label pendek.
- Hindari "More" atau "..." menu – gunakan hamburger hanya untuk item non-prioritas (≤3 item di dalamnya).

### B. Breadcrumb
- Gunakan untuk halaman dengan kedalaman ≥3 level.
- Format ringkas: `Beranda / Kelas / Detail` (bukan `Home > Classroom > Detail Siswa`).

### C. Sidebar (Desktop)
- Jika menggunakan sidebar, biarkan **collapsible** (mini mode) dengan ikon saja saat tidak di-hover.
- Ini menghemat 60–200px ruang horizontal.

### D. Floating Action Button (FAB)
- Gunakan hanya untuk 1 aksi utama yang sangat sering dipakai.
- Jangan tumpuk dengan elemen bottom navigation.

---

## 8. Komponen Spesifik & Fungsional

### A. Tabel Data (Bukan Tabel Excel Mentah)
- Mobile: ubah tabel menjadi **card list** (setiap row jadi satu card).
- Desktop: gunakan tabel dengan `sticky header`, zebra stripe halus (`rgba(0,0,0,0.02)`), dan teks rata kiri (hindari center alignment untuk data teks).

### B. Modal / Dialog
- Lebar maksimal mobile: `calc(100vw - 32px)`.
- Tinggi maksimal: `80vh` dengan konten scrollable di dalam.
- Backdrop: `rgba(0,0,0,0.4)` + `backdrop-filter: blur(2px)` untuk efek premium.

### C. Formulir
- Label **di atas** input (bukan di samping) – lebih mudah dibaca vertikal.
- Input height minimal **44px** (mobile).
- Error message muncul di bawah field, berwarna merah gelap `#B91C1C`, bukan merah terang.
- Gunakan `inputmode` yang sesuai (`numeric`, `email`, `tel`) untuk memicu keyboard yang tepat di mobile.

---

## 9. Animasi & Transisi (Subtle, Tidak Norak)

### A. Durasi & Easing
- Transisi UI: **150–250ms** dengan `ease-out` atau `cubic-bezier(0.4, 0, 0.2, 1)`.
- Hindari durasi >500ms – terasa lambat dan amatir.
- Jangan gunakan `ease-in-out` untuk hover efek.

### B. Animasi Scroll (Gunakan Secukupnya)
- **Fade-in** ringan diperbolehkan (opacity 0 → 1 + translateY 8px → 0).
- Hindari animasi `scale`, `rotate`, atau `bounce` yang berlebihan (jejak template AI generik).
- Gunakan `prefers-reduced-motion` untuk menghormati aksesibilitas.

---

## 10. SEO & Metadata Dasar (Jangan Lupa)

- Setiap halaman wajib punya `<title>` deskriptif (bukan "Dashboard" polos).
- Meta description 120–155 karakter, ditulis natural seperti manusia (bukan keyword stuffing).
- Gambar dekoratif pakai `alt=""`, gambar konten pakai `alt` deskriptif.

---

## 11. Ceklist Anti-Kesalahan Umum AI

| Kesalahan AI | Perbaikan |
|--------------|-----------|
| Gambar placeholder `https://via.placeholder.com/400x300` | Gunakan gambar dari `unsplash` atau ilustrasi custom SVG inline |
| `border-radius: 9999px` di semua tempat | Gunakan radius proporsional: 6–10px untuk card, 20–24px untuk button pill |
| Gradient background mencolok di hero section | Gunakan gradient sangat subtle (perbedaan 5–10% luminance) atau cukup warna solid dengan tekstur noise |
| Font dari Google Fonts dipanggil semua weight (400,500,600,700,800) | Pilih maksimal 3 weight: 400, 500, 700 sudah cukup |
| Placeholder input: "Enter your email" | Gunakan: "contoh: nama@sekolah.id" (lebih natural dan membantu) |

---

## 12. Saran Struktur Folder CSS (Scalable)

```
styles/
├── base/
│   ├── reset.css
│   ├── typography.css
│   └── variables.css
├── components/
│   ├── card.css
│   ├── button.css
│   ├── modal.css
│   └── table.css
├── layout/
│   ├── grid.css
│   ├── header.css
│   └── sidebar.css
└── utilities/
    ├── spacing.css
    └── visibility.css
```
