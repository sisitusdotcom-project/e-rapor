// db.js — service layer untuk seluruh operasi Firebase RTDB.
// Setiap fungsi return data langsung (bukan snapshot) supaya caller bersih.
const DB = {
  // --- USERS ---
  async getUser(uid) {
    if (!isDBReady()) return null;
    const snap = await db.ref(`users/${uid}`).once('value');
    return snap.val();
  },
  async getAllUsers() {
    if (!isDBReady()) return {};
    const snap = await db.ref('users').once('value');
    return snap.val() || {};
  },
  async saveUser(uid, data) {
    if (!isDBReady()) return;
    const safeData = { ...data };
    delete safeData.password;
    await db.ref(`users/${uid}`).update(safeData);
  },
  async saveProfilePhoto(uid, base64Data, mimeType = 'image/jpeg') {
    if (!uid || !base64Data) return null;
    const fileUrl = await DriveBridge.uploadProfilePhoto(uid, base64Data, mimeType);
    if (!fileUrl) return null;
    await db.ref(`users/${uid}/photoURL`).set(fileUrl);
    return fileUrl;
  },
  async uploadDriveFile(fileName, mimeType, base64Data, folderId = null) {
    if (!fileName || !mimeType || !base64Data) return null;
    const result = await DriveBridge.uploadBase64({ fileName, mimeType, base64Data, folderId });
    return result.fileUrl || null;
  },
  async createUserInDB(uid, data) {
    if (!isDBReady()) return;
    const safeData = { ...data };
    delete safeData.password;
    await db.ref(`users/${uid}`).set({
      ...safeData,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    });
  },
  async deleteUser(uid) {
    if (!isDBReady()) return;
    await db.ref(`users/${uid}`).remove();
  },
  // --- SETTINGS (Tahun ajaran & semester) ---
  async getSettings() {
    const defaultSettings = {
      currentAcademicYear: '2026/2027',
      currentSemester: '1',
      attendanceRules: {
        checkInStart: '07:00',
        checkInEnd: '09:00',
        checkOutStart: '15:00',
        checkOutEnd: '17:00',
        attendanceStartDate: '',
        attendanceEndDate: ''
      }
    };
    if (!isDBReady()) return defaultSettings;
    const snap = await db.ref('settings').once('value');
    const current = snap.val() || {};
    return {
      ...defaultSettings,
      ...current,
      attendanceRules: {
        ...defaultSettings.attendanceRules,
        ...(current.attendanceRules || {})
      }
    };
  },
  async updateSettings(data) {
    if (!isDBReady()) return;
    await db.ref('settings').update(data);
  },
  // --- SCHOOL SETTINGS (Global config) ---
  async getSchoolSettings() {
    const defaultSettings = {
      location: {
        lat: null,
        lng: null,
        radius_meters: null
      }
    };
    if (!isDBReady()) return defaultSettings;
    const snap = await db.ref('school_settings').once('value');
    const current = snap.val() || {};
    return {
      ...defaultSettings,
      ...current,
      location: {
        lat: current.location?.lat ?? null,
        lng: current.location?.lng ?? null,
        radius_meters: current.location?.radius_meters ?? null
      }
    };
  },
  async updateSchoolSettings(data) {
    if (!isDBReady()) return;
    await db.ref('school_settings').update(data);
  },
  // --- TEACHER ATTENDANCE ---
  async getTeacherAttendance(dateStr, teacherId) {
    if (!isDBReady()) return null;
    const snap = await db.ref(`teacher_attendance/${dateStr}/${teacherId}`).once('value');
    return snap.val();
  },
  async getTeacherAttendanceByDate(dateStr) {
    if (!isDBReady()) return {};
    const snap = await db.ref(`teacher_attendance/${dateStr}`).once('value');
    return snap.val() || {};
  },
  async saveTeacherAttendance(dateStr, teacherId, data) {
    if (!isDBReady()) return;
    const isAdmin = typeof Auth !== 'undefined' && Auth.currentRole === 'admin';
    if (typeof Auth !== 'undefined' && Auth.currentUser && teacherId !== Auth.currentUser.uid && !isAdmin) {
      throw new Error('Anda tidak berwenang mengubah presensi guru lain.');
    }
    const payload = {};
    if (data && data.time_in) payload.time_in = data.time_in;
    if (data && data.location_in) payload.location_in = data.location_in;
    if (data && data.time_out) payload.time_out = data.time_out;
    if (data && data.location_out) payload.location_out = data.location_out;
    if (data && data.proof_url) payload.proof_url = data.proof_url;
    if (data && data.proofUrl) payload.proof_url = data.proofUrl;
    if (!Object.keys(payload).length) return;
    await db.ref(`teacher_attendance/${dateStr}/${teacherId}`).update(payload);
  },
  async saveTeacherAttendanceProof(dateStr, teacherId, base64Data, mimeType = 'image/jpeg') {
    if (!base64Data) return null;
    const fileUrl = await DriveBridge.uploadAttendanceProof(dateStr, teacherId, base64Data, mimeType);
    if (!fileUrl) return null;
    await this.saveTeacherAttendance(dateStr, teacherId, { proof_url: fileUrl });
    return fileUrl;
  },
  async submitTeacherAttendanceToWorker({ dateStr, teacherId, type, photoDataUrl, location, accuracy }) {
    const workerUrl = (window.CLOUDFLARE_ATTENDANCE_WORKER_URL || '').trim();

    if (!workerUrl || workerUrl.includes('your-subdomain')) {
      const fallbackProof = await this.saveTeacherAttendanceProof(dateStr, teacherId, photoDataUrl, 'image/jpeg');
      const payload = {
        ...(type === 'in' ? { time_in: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) } : {}),
        ...(type === 'out' ? { time_out: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) } : {}),
        ...(location ? (type === 'in' ? { location_in: location } : { location_out: location }) : {}),
        ...(fallbackProof ? { proof_url: fallbackProof } : {})
      };
      await this.saveTeacherAttendance(dateStr, teacherId, payload);
      return { status: 'success', proof_url: fallbackProof, record: payload };
    }

    const user = typeof firebase !== 'undefined' && firebase.auth ? firebase.auth().currentUser : null;
    const idToken = user ? await user.getIdToken() : '';
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {})
      },
      body: JSON.stringify({
        dateStr,
        teacherId,
        type,
        photoDataUrl,
        location,
        accuracy,
        clientTimestamp: new Date().toISOString()
      })
    });

    let result = {};
    try {
      result = await response.json();
    } catch (error) {
      result = { status: 'error', message: 'Respons worker tidak valid JSON.' };
    }

    if (!response.ok || result.status !== 'success') {
      throw new Error(result && result.message ? result.message : 'Gagal memvalidasi absensi di server.');
    }

    return result;
  },
  // --- STUDENT ATTENDANCE (Daily per class) ---
  async getDailyStudentAttendance(dateStr, classId) {
    if (!isDBReady()) return {};
    const snap = await db.ref(`student_attendance_daily/${dateStr}/${classId}`).once('value');
    return snap.val() || {};
  },
  async getDailyStudentAttendanceByDate(dateStr) {
    if (!isDBReady()) return {};
    const snap = await db.ref(`student_attendance_daily/${dateStr}`).once('value');
    return snap.val() || {};
  },
  async saveDailyStudentAttendance(dateStr, classId, data) {
    if (!isDBReady()) return;
    const isAdmin = typeof Auth !== 'undefined' && Auth.currentRole === 'admin';
    if (typeof Auth !== 'undefined' && Auth.currentUser && !isAdmin) {
      const classes = await this.getClasses();
      const cls = classes[classId] || null;
      const isOwner = !!(cls && (cls.teacherId === Auth.currentUser.uid || (cls.subjectTeachers && Object.values(cls.subjectTeachers).includes(Auth.currentUser.uid))));
      if (!isOwner) {
        throw new Error('Anda tidak berwenang mengisi absensi kelas ini.');
      }
    }
    const normalized = {};
    Object.entries(data || {}).forEach(([studentId, status]) => {
      if (['H', 'S', 'I', 'A'].includes(status)) normalized[studentId] = status;
    });
    if (!Object.keys(normalized).length) return;
    await db.ref(`student_attendance_daily/${dateStr}/${classId}`).update(normalized);
  },
  // --- CHARACTERS (Aspek/Indikator) ---
  async getCharacters() {
    if (!isDBReady()) return {};
    const snap = await db.ref('characters').orderByChild('order').once('value');
    return snap.val() || {};
  },
  async saveCharacter(id, data) {
    if (!isDBReady()) return null;
    const ref = id ? db.ref(`characters/${id}`) : db.ref('characters').push();
    await ref.set(data);
    return ref.key;
  },
  async deleteCharacter(id) {
    if (!isDBReady()) return;
    await db.ref(`characters/${id}`).remove();
  },
  // --- CLASSES ---
  async getClasses() {
    if (!isDBReady()) return {};
    const snap = await db.ref('classes').once('value');
    return snap.val() || {};
  },
  async saveClass(id, data) {
    if (!isDBReady()) return null;
    const ref = id ? db.ref(`classes/${id}`) : db.ref('classes').push();
    await ref.set(data);
    return ref.key;
  },
  async deleteClass(id) {
    if (!isDBReady()) return;
    await db.ref(`classes/${id}`).remove();
  },
  async saveClassSubjectTeachers(classId, subjectTeachers) {
    if (!isDBReady()) return;
    await db.ref(`classes/${classId}/subjectTeachers`).set(subjectTeachers);
  },
  // --- STUDENTS ---
  async getAllStudents() {
    if (!isDBReady()) return {};
    const snap = await db.ref('students').once('value');
    return snap.val() || {};
  },
  async getStudentsByClass(classId) {
    if (!isDBReady()) return {};
    const snap = await db.ref('students').orderByChild('classId').equalTo(classId).once('value');
    return snap.val() || {};
  },
  async getStudentsByParent(parentUid) {
    if (!isDBReady()) return {};
    const snap = await db.ref('students').orderByChild('parentId').equalTo(parentUid).once('value');
    return snap.val() || {};
  },
  async getStudent(id) {
    if (!isDBReady()) return null;
    const snap = await db.ref(`students/${id}`).once('value');
    return snap.val();
  },
  async saveStudent(id, data) {
    if (!isDBReady()) return null;
    const ref = id ? db.ref(`students/${id}`) : db.ref('students').push();
    await ref.set(data);
    return ref.key;
  },
  async deleteStudent(id) {
    if (!isDBReady()) return;
    await db.ref(`students/${id}`).remove();
  },
  // --- ASSESSMENTS (Penilaian skala 1-4) ---
  // Struktur: assessments/{year-sem}/{studentId}/{charId} = { score, updatedAt, updatedBy }
  _assessPath(year, sem) {
    return `assessments/${year.replace('/', '-')}_${sem}`;
  },
  async getAssessments(year, sem, studentId) {
    if (!isDBReady()) return {};
    const snap = await db.ref(`${this._assessPath(year, sem)}/${studentId}`).once('value');
    return snap.val() || {};
  },
  async getAllAssessmentsForPeriod(year, sem) {
    if (!isDBReady()) return {};
    const snap = await db.ref(this._assessPath(year, sem)).once('value');
    return snap.val() || {};
  },
  async saveAssessment(year, sem, studentId, charId, score, teacherId) {
    if (!isDBReady()) return;
    await db.ref(`${this._assessPath(year, sem)}/${studentId}/${charId}`).set({
      score: parseInt(score),
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
      updatedBy: teacherId
    });
  },
  // --- OBSERVATIONS (Catatan perilaku) ---
  async getObservationsByStudent(studentId) {
    if (!isDBReady()) return {};
    const snap = await db.ref('observations').orderByChild('studentId').equalTo(studentId).once('value');
    return snap.val() || {};
  },
  async getObservationsByTeacher(teacherUid) {
    if (!isDBReady()) return {};
    const snap = await db.ref('observations').orderByChild('teacherId').equalTo(teacherUid).once('value');
    return snap.val() || {};
  },
  async getAllObservations() {
    if (!isDBReady()) return {};
    const snap = await db.ref('observations').once('value');
    return snap.val() || {};
  },
  async saveObservation(data) {
    if (!isDBReady()) return null;
    data.timestamp = firebase.database.ServerValue.TIMESTAMP;
    const ref = await db.ref('observations').push(data);
    return ref.key;
  },
  async deleteObservation(id) {
    if (!isDBReady()) return;
    await db.ref(`observations/${id}`).remove();
  },
  // --- SUBJECTS (Mata Pelajaran) ---
  async getSubjects() {
    if (!isDBReady()) return {};
    const snap = await db.ref('subjects').orderByChild('order').once('value');
    return snap.val() || {};
  },
  async saveSubject(id, data) {
    if (!isDBReady()) return null;
    const ref = id ? db.ref(`subjects/${id}`) : db.ref('subjects').push();
    await ref.set(data);
    return ref.key;
  },
  async deleteSubject(id) {
    if (!isDBReady()) return;
    await db.ref(`subjects/${id}`).remove();
  },
  // --- EXTRACURRICULARS (Master Data Ekskul) ---
  async getExtracurriculars() {
    if (!isDBReady()) return {};
    const snap = await db.ref('extracurriculars').once('value');
    return snap.val() || {};
  },
  async saveExtracurricular(id, data) {
    if (!isDBReady()) return null;
    const ref = id ? db.ref(`extracurriculars/${id}`) : db.ref('extracurriculars').push();
    await ref.set(data);
    return ref.key;
  },
  async deleteExtracurricular(id) {
    if (!isDBReady()) return;
    await db.ref(`extracurriculars/${id}`).remove();
  },
  // --- RAPOR DATA PATH HELPER ---
  _raporPath(type, year, sem) {
    return `${type}/${year.replace('/', '-')}_${sem}`;
  },
  // --- ACADEMIC GRADES ---
  async getAcademicGrades(year, sem, studentId) {
    if (!isDBReady()) return {};
    const snap = await db.ref(`${this._raporPath('academic_grades', year, sem)}/${studentId}`).once('value');
    return snap.val() || {};
  },
  async getAllAcademicGrades(year, sem) {
    if (!isDBReady()) return {};
    const snap = await db.ref(this._raporPath('academic_grades', year, sem)).once('value');
    return snap.val() || {};
  },
  async saveAcademicGrade(year, sem, studentId, subjectId, data) {
    if (!isDBReady()) return;
    await db.ref(`${this._raporPath('academic_grades', year, sem)}/${studentId}/${subjectId}`).set({
      ...data,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });
  },
  // --- STUDENT EXTRACURRICULARS ---
  async getStudentExtracurriculars(year, sem, studentId) {
    if (!isDBReady()) return {};
    const snap = await db.ref(`${this._raporPath('student_extracurriculars', year, sem)}/${studentId}`).once('value');
    return snap.val() || {};
  },
  async saveStudentExtracurricular(year, sem, studentId, ekskulId, data) {
    if (!isDBReady()) return;
    await db.ref(`${this._raporPath('student_extracurriculars', year, sem)}/${studentId}/${ekskulId}`).set({
      ...data,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });
  },
  async deleteStudentExtracurricular(year, sem, studentId, ekskulId) {
    if (!isDBReady()) return;
    await db.ref(`${this._raporPath('student_extracurriculars', year, sem)}/${studentId}/${ekskulId}`).remove();
  },
  // --- COCURRICULARS ---
  async getCocurricular(year, sem, studentId) {
    if (!isDBReady()) return null;
    const snap = await db.ref(`${this._raporPath('cocurriculars', year, sem)}/${studentId}`).once('value');
    return snap.val();
  },
  async saveCocurricular(year, sem, studentId, data) {
    if (!isDBReady()) return;
    await db.ref(`${this._raporPath('cocurriculars', year, sem)}/${studentId}`).set({
      ...data,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });
  },
  // --- ATTENDANCES ---
  async getAttendance(year, sem, studentId) {
    if (!isDBReady()) return null;
    const snap = await db.ref(`${this._raporPath('attendances', year, sem)}/${studentId}`).once('value');
    return snap.val();
  },
  async saveAttendance(year, sem, studentId, data) {
    if (!isDBReady()) return;
    await db.ref(`${this._raporPath('attendances', year, sem)}/${studentId}`).set({
      ...data,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });
  },
  // --- TEACHER NOTES ---
  async getTeacherNote(year, sem, studentId) {
    if (!isDBReady()) return null;
    const snap = await db.ref(`${this._raporPath('teacher_notes', year, sem)}/${studentId}`).once('value');
    return snap.val();
  },
  async saveTeacherNote(year, sem, studentId, data) {
    if (!isDBReady()) return;
    await db.ref(`${this._raporPath('teacher_notes', year, sem)}/${studentId}`).set({
      ...data,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });
  },
  // --- PARENT RESPONSES ---
  async getParentResponse(year, sem, studentId) {
    if (!isDBReady()) return null;
    const snap = await db.ref(`${this._raporPath('parent_responses', year, sem)}/${studentId}`).once('value');
    return snap.val();
  },
  async saveParentResponse(year, sem, studentId, data) {
    if (!isDBReady()) return;
    await db.ref(`${this._raporPath('parent_responses', year, sem)}/${studentId}`).set({
      ...data,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });
  },
  // helper: konversi snapshot object jadi array dengan id
  toArray(obj) {
    if (!obj) return [];
    return Object.keys(obj).map(k => ({
      id: k,
      ...obj[k]
    }));
  }
};