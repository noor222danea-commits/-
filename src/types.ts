export type GradeLevel = 'المرحلة الابتدائية' | 'المرحلة المتوسطة' | 'المرحلة الثانوية';

export type SubjectType = 
  | 'الرياضيات' 
  | 'العلوم' 
  | 'اللغة الإنجليزية' 
  | 'اللغة العربية والقراءة' 
  | 'الدراسات الاجتماعية' 
  | 'الحاسب الآلي والتقنية' 
  | 'الفيزياء' 
  | 'الكيمياء' 
  | 'التربية الإسلامية'
  | 'أخرى';

export type UnderstandingLevel = 'ممتاز جداً (90-100%)' | 'جيد جداً (80-89%)' | 'جيد (70-79%)' | 'يحتاج دعم ومتابعة (<70%)';

export interface Student {
  id: string;
  name: string;
  gradeLevel: GradeLevel;
  primarySubject: string;
  additionalSubjects?: string[];
  avatarUrl: string;
  progressSummary: string;
  totalSessionsCount: number;
  overallScore: number; // 0 to 100
  phone?: string;
  guardianPhone?: string;
  notes?: string;
  enrolledDate: string;
}

export interface TeacherFeedback {
  teacherName: string;
  teacherId?: string;
  rating: number; // 1 to 5 stars
  notes: string;
  isVerified: boolean;
  verifiedAt?: string;
  awardedBadge?: string;
}

export interface TeachingSession {
  id: string;
  studentId: string;
  studentName: string;
  studentGrade: GradeLevel;
  subject: SubjectType | string;
  topic: string;
  day: string; // e.g. "الأحد"
  date: string; // e.g. "2026-04-05"
  time: string; // e.g. "04:00 م"
  durationMinutes: number;
  imageUrl?: string;
  
  // Detailed Report
  lessonReport: string;
  understandingLevel: UnderstandingLevel;
  strengthsObserved: string;
  areasToImprove: string;
  homeworkGiven: string;
  recommendationsForTeacher: string;
  
  // Meta
  juniorTeacherName: string;
  status: 'submitted' | 'reviewed' | 'needs_revision';
  teacherFeedback?: TeacherFeedback;
  createdAt: string;
}

export interface ProgressReportItem {
  id: string;
  sessionId: string;
  studentName: string;
  subject: string;
  topic: string;
  date: string;
  summary: string;
  detailedContent: string;
  imageUrl: string;
  understandingScore: number;
  teacherVerified: boolean;
  teacherRating?: number;
}

export interface TimetableSlot {
  id: string;
  day: string;
  time: string;
  studentName: string;
  subject: string;
  topic: string;
  locationOrLink: string;
  isCompleted: boolean;
}

export interface NotebookNote {
  id: string;
  title: string;
  subject: string;
  content: string;
  date: string;
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  subject: string;
  topic: string;
  gradeLevel: GradeLevel;
  questions: QuizQuestion[];
  createdDate: string;
}

export interface JuniorTeacherProfile {
  name: string;
  roleTitle: string;
  schoolName: string;
  grade: string;
  mentorTeacherName: string;
  mentorTeacherPhone: string;
  mentorTeacherSubject: string;
  avatarUrl: string;
  totalTeachingHours: number;
  points: number;
  rankBadge: string;
  bio: string;
}

export interface CertificateData {
  id: string;
  recipientName: string;
  recipientRole: 'المعلم الصغير' | 'طالب متميز';
  title: string;
  reason: string;
  issueDate: string;
  mentorTeacherName: string;
  schoolName: string;
  badgeType: 'gold' | 'silver' | 'bronze' | 'diamond';
}
