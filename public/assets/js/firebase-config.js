const firebaseConfig = { apiKey: "AIzaSyC9csv8TECoXln6CiAhRoj2tBJ8p3-sN-0", authDomain: "musada-sd.firebaseapp.com", databaseURL: "https://musada-sd-default-rtdb.firebaseio.com", projectId: "musada-sd", storageBucket: "musada-sd.firebasestorage.app", messagingSenderId: "579185454529", appId: "1:579185454529:web:d131622d53d79211369340" };

const APP_DEFAULTS = Object.freeze({
  googleDriveUploadUrl: 'https://script.google.com/macros/s/AKfycbwHNSb34p_FcX_dTQuw87viaZ9joh2rT3KdtMLBVvwpocWzyF3HICPUPRfPuy63LDsNsw/exec',
  attendanceWorkerUrl: 'https://musada-absensi.sisitusdotcom.workers.dev/'
});

window.APP_ATTENDANCE_GEOFENCE = Object.freeze({
  lat: null,
  lng: null,
  radiusMeters: null
});

window.GOOGLE_DRIVE_UPLOAD_URL = window.GOOGLE_DRIVE_UPLOAD_URL || APP_DEFAULTS.googleDriveUploadUrl;
window.CLOUDFLARE_ATTENDANCE_WORKER_URL = window.CLOUDFLARE_ATTENDANCE_WORKER_URL || APP_DEFAULTS.attendanceWorkerUrl;
window.GOOGLE_DRIVE_CONFIG = Object.freeze({
  uploadUrl: window.GOOGLE_DRIVE_UPLOAD_URL,
  attendanceWorkerUrl: window.CLOUDFLARE_ATTENDANCE_WORKER_URL
});

let app, auth, db; try { if (firebaseConfig.apiKey !== "API_KEY_ANDA_DISINI") { app = firebase.initializeApp(firebaseConfig); auth = firebase.auth(); db = firebase.database();  } else {  } } catch (error) {  }
let _dbWarningShown = !1; function isDBReady() {
  if (!db) {
    if (!_dbWarningShown) {  _dbWarningShown = !0 }
    return !1
  }
  return !0
}