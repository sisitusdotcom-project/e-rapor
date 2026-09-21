// ==========================================
// KONFIGURASI FIREBASE
// ==========================================
// PENTING: Ganti nilai-nilai di bawah ini dengan config dari Firebase Console Anda.
// 1. Buka console.firebase.google.com
// 2. Buat Project -> Web App
// 3. Copy firebaseConfig ke sini
const firebaseConfig = {
  apiKey: "AIzaSyC9csv8TECoXln6CiAhRoj2tBJ8p3-sN-0",
  authDomain: "musada-sd.firebaseapp.com",
  databaseURL: "https://musada-sd-default-rtdb.firebaseio.com",
  projectId: "musada-sd",
  storageBucket: "musada-sd.firebasestorage.app",
  messagingSenderId: "579185454529",
  appId: "1:579185454529:web:d131622d53d79211369340"
};

// Initialize Firebase
let app, auth, db;

try {
  // Hanya inisialisasi jika config valid (mencegah error merah saat pertama kali load tanpa config)
  if (firebaseConfig.apiKey !== "API_KEY_ANDA_DISINI") {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.database();
    console.log("Firebase berhasil diinisialisasi.");
  } else {
    console.warn("WARNING: Firebase Config belum diset. Silakan edit assets/js/firebase-config.js");
  }
} catch (error) {
  console.error("Firebase Init Error:", error);
}

// Helper untuk mengecek apakah DB siap digunakan
let _dbWarningShown = false;
function isDBReady() {
  if (!db) {
    if (!_dbWarningShown) {
      console.warn("Koneksi Database belum dikonfigurasi. Data tidak akan dimuat.");
      _dbWarningShown = true;
    }
    return false;
  }
  return true;
}
