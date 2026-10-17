import { Student, TeachingSession, ProgressReportItem, TimetableSlot, NotebookNote, JuniorTeacherProfile, CertificateData } from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_SESSIONS, 
  INITIAL_PROGRESS_REPORTS, 
  INITIAL_TIMETABLE, 
  INITIAL_NOTES, 
  INITIAL_TEACHER_PROFILE,
  INITIAL_CERTIFICATES 
} from '../data/initialData';

const KEYS = {
  STUDENTS: 'teacher_small_students_v1',
  SESSIONS: 'teacher_small_sessions_v1',
  REPORTS: 'teacher_small_reports_v1',
  TIMETABLE: 'teacher_small_timetable_v1',
  NOTES: 'teacher_small_notes_v1',
  PROFILE: 'teacher_small_profile_v1',
  CERTIFICATES: 'teacher_small_certificates_v1',
};

// Dispatch storage change event
const notifyUpdate = () => {
  window.dispatchEvent(new Event('almoallim_storage_update'));
};

export const StorageService = {
  // Profile
  getProfile(): JuniorTeacherProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : INITIAL_TEACHER_PROFILE;
    } catch {
      return INITIAL_TEACHER_PROFILE;
    }
  },

  saveProfile(profile: JuniorTeacherProfile) {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    notifyUpdate();
  },

  // Students
  getStudents(): Student[] {
    try {
      const data = localStorage.getItem(KEYS.STUDENTS);
      if (!data) {
        localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
        return INITIAL_STUDENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  addStudent(student: Omit<Student, 'id' | 'enrolledDate' | 'totalSessionsCount' | 'overallScore'>): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      ...student,
      id: `student-${Date.now()}`,
      enrolledDate: new Date().toISOString().split('T')[0],
      totalSessionsCount: 0,
      overallScore: 85,
    };
    students.unshift(newStudent);
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
    notifyUpdate();
    return newStudent;
  },

  updateStudent(student: Student) {
    const students = this.getStudents().map((s) => (s.id === student.id ? student : s));
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
    notifyUpdate();
  },

  // Sessions
  getSessions(): TeachingSession[] {
    try {
      const data = localStorage.getItem(KEYS.SESSIONS);
      if (!data) {
        localStorage.setItem(KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
        return INITIAL_SESSIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SESSIONS;
    }
  },

  addSession(sessionData: Omit<TeachingSession, 'id' | 'createdAt' | 'status'>): TeachingSession {
    const sessions = this.getSessions();
    const newSession: TeachingSession = {
      ...sessionData,
      id: `session-${Date.now()}`,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };
    sessions.unshift(newSession);
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));

    // Also update student total sessions and scores
    const students = this.getStudents().map((st) => {
      if (st.id === sessionData.studentId || st.name === sessionData.studentName) {
        return {
          ...st,
          totalSessionsCount: (st.totalSessionsCount || 0) + 1,
          overallScore: Math.min(100, Math.round(((st.overallScore || 85) + 95) / 2)),
        };
      }
      return st;
    });
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));

    // Also generate progress report item
    const reports = this.getReports();
    const newReport: ProgressReportItem = {
      id: `report-${Date.now()}`,
      sessionId: newSession.id,
      studentName: newSession.studentName,
      subject: newSession.subject,
      topic: newSession.topic,
      date: newSession.date,
      summary: newSession.lessonReport.slice(0, 95) + '...',
      detailedContent: newSession.lessonReport,
      imageUrl: newSession.imageUrl || 'https://images.mediadirhub.com/vibe/clean-pdf-document-preview-showing-student-name-and-progress-notes.png',
      understandingScore: newSession.understandingLevel.includes('90-100') ? 95 : newSession.understandingLevel.includes('80-89') ? 85 : 75,
      teacherVerified: false,
    };
    reports.unshift(newReport);
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));

    // Update teacher profile hours
    const profile = this.getProfile();
    const addedHours = Math.round((newSession.durationMinutes || 45) / 60 * 10) / 10;
    profile.totalTeachingHours = Math.round((profile.totalTeachingHours + addedHours) * 10) / 10;
    profile.points = (profile.points || 1400) + 50;
    this.saveProfile(profile);

    notifyUpdate();
    return newSession;
  },

  updateSession(session: TeachingSession) {
    const sessions = this.getSessions().map((s) => (s.id === session.id ? session : s));
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
    notifyUpdate();
  },

  // Teacher feedback review
  reviewSession(sessionId: string, rating: number, notes: string, teacherName: string, badge?: string) {
    const sessions = this.getSessions().map((s) => {
      if (s.id === sessionId) {
        return {
          ...s,
          status: 'reviewed' as const,
          teacherFeedback: {
            teacherName: teacherName || 'أ. عبد الرحمن الشهري',
            rating,
            notes,
            isVerified: true,
            verifiedAt: new Date().toISOString(),
            awardedBadge: badge,
          },
        };
      }
      return s;
    });
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));

    // Also update report verification status
    const reports = this.getReports().map((r) => {
      if (r.sessionId === sessionId) {
        return {
          ...r,
          teacherVerified: true,
          teacherRating: rating,
        };
      }
      return r;
    });
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));

    notifyUpdate();
  },

  // Reports
  getReports(): ProgressReportItem[] {
    try {
      const data = localStorage.getItem(KEYS.REPORTS);
      if (!data) {
        localStorage.setItem(KEYS.REPORTS, JSON.stringify(INITIAL_PROGRESS_REPORTS));
        return INITIAL_PROGRESS_REPORTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PROGRESS_REPORTS;
    }
  },

  // Timetable
  getTimetable(): TimetableSlot[] {
    try {
      const data = localStorage.getItem(KEYS.TIMETABLE);
      if (!data) {
        localStorage.setItem(KEYS.TIMETABLE, JSON.stringify(INITIAL_TIMETABLE));
        return INITIAL_TIMETABLE;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TIMETABLE;
    }
  },

  addTimetableSlot(slot: Omit<TimetableSlot, 'id' | 'isCompleted'>) {
    const list = this.getTimetable();
    list.push({
      ...slot,
      id: `slot-${Date.now()}`,
      isCompleted: false,
    });
    localStorage.setItem(KEYS.TIMETABLE, JSON.stringify(list));
    notifyUpdate();
  },

  toggleSlotComplete(slotId: string) {
    const list = this.getTimetable().map((s) => (s.id === slotId ? { ...s, isCompleted: !s.isCompleted } : s));
    localStorage.setItem(KEYS.TIMETABLE, JSON.stringify(list));
    notifyUpdate();
  },

  // Notes
  getNotes(): NotebookNote[] {
    try {
      const data = localStorage.getItem(KEYS.NOTES);
      if (!data) {
        localStorage.setItem(KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
        return INITIAL_NOTES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTES;
    }
  },

  addNote(note: Omit<NotebookNote, 'id' | 'date'>) {
    const list = this.getNotes();
    list.unshift({
      ...note,
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    });
    localStorage.setItem(KEYS.NOTES, JSON.stringify(list));
    notifyUpdate();
  },

  // Certificates
  getCertificates(): CertificateData[] {
    try {
      const data = localStorage.getItem(KEYS.CERTIFICATES);
      if (!data) {
        localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
        return INITIAL_CERTIFICATES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CERTIFICATES;
    }
  },

  issueCertificate(cert: Omit<CertificateData, 'id' | 'issueDate'>) {
    const certs = this.getCertificates();
    certs.unshift({
      ...cert,
      id: `cert-${Date.now()}`,
      issueDate: new Date().toISOString().split('T')[0],
    });
    localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certs));
    notifyUpdate();
  },

  // Aggregate snapshot
  getData() {
    return {
      profile: this.getProfile(),
      students: this.getStudents(),
      sessions: this.getSessions(),
      progressReports: this.getReports(),
      timetable: this.getTimetable(),
      notes: this.getNotes(),
      certificates: this.getCertificates(),
    };
  },

  // Reactive subscription
  subscribe(callback: (data: ReturnType<typeof StorageService.getData>) => void) {
    const handler = () => {
      callback(this.getData());
    };
    window.addEventListener('almoallim_storage_update', handler);
    return () => {
      window.removeEventListener('almoallim_storage_update', handler);
    };
  },

  // Reset to initial
  resetAll() {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(INITIAL_PROGRESS_REPORTS));
    localStorage.setItem(KEYS.TIMETABLE, JSON.stringify(INITIAL_TIMETABLE));
    localStorage.setItem(KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(INITIAL_TEACHER_PROFILE));
    localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
    notifyUpdate();
  },
};
