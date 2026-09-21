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
    await db.ref(`users/${uid}`).update(data);
  },

  async createUserInDB(uid, data) {
    if (!isDBReady()) return;
    await db.ref(`users/${uid}`).set({
      ...data,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    });
  },

  async deleteUser(uid) {
    if (!isDBReady()) return;
    await db.ref(`users/${uid}`).remove();
  },

  // --- SETTINGS (Tahun ajaran & semester) ---
  async getSettings() {
    if (!isDBReady()) return { currentAcademicYear: '2026/2027', currentSemester: '1' };
    const snap = await db.ref('settings').once('value');
    return snap.val() || { currentAcademicYear: '2026/2027', currentSemester: '1' };
  },

  async updateSettings(data) {
    if (!isDBReady()) return;
    await db.ref('settings').update(data);
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
    return Object.keys(obj).map(k => ({ id: k, ...obj[k] }));
  }
};
