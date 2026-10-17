import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  Star, 
  Award, 
  FileText, 
  Send, 
  MessageCircle, 
  Download, 
  Sparkles, 
  Eye, 
  Edit3,
  ThumbsUp
} from 'lucide-react';
import { TeachingSession, Student, JuniorTeacherProfile, CertificateData } from '../types';
import { StorageService } from '../services/storage';
import { ShareService } from '../services/shareService';
import { PdfGenerator } from '../services/pdfGenerator';
import confetti from 'canvas-confetti';

interface TeacherDashboardProps {
  sessions: TeachingSession[];
  students: Student[];
  profile: JuniorTeacherProfile;
  certificates: CertificateData[];
  onViewSession: (session: TeachingSession) => void;
  onOpenReportGenerator: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  sessions,
  students,
  profile,
  certificates,
  onViewSession,
  onOpenReportGenerator,
}) => {
  const [selectedSessionForReview, setSelectedSessionForReview] = useState<TeachingSession | null>(null);
  const [rating, setRating] = useState(5);
  const [teacherNotes, setTeacherNotes] = useState('شرح رائع وجهد تربوي متميز من المعلم الصغير.');
  const [selectedBadge, setSelectedBadge] = useState('وسام المعلم المتميز 🏆');

  // Certificate issuance form
  const [showCertModal, setShowCertModal] = useState(false);
  const [certRecipient, setCertRecipient] = useState(profile.name);
  const [certRole, setCertRole] = useState<'المعلم الصغير' | 'طالب متميز'>('المعلم الصغير');
  const [certTitle, setCertTitle] = useState('وسام التميز والإبداع في تدريس الأقران');
  const [certReason, setCertReason] = useState('تقديراً لجهوده المخلصة في مساعدة زملائه وتقديم حصص نموذجية بأسلوب تربوي ملهم.');

  const pendingSessions = sessions.filter((s) => !s.teacherFeedback?.isVerified);
  const reviewedSessions = sessions.filter((s) => s.teacherFeedback?.isVerified);

  const handleApproveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionForReview) return;

    StorageService.reviewSession(
      selectedSessionForReview.id,
      rating,
      teacherNotes,
      profile.mentorTeacherName,
      selectedBadge
    );

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setSelectedSessionForReview(null);
  };

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certRecipient.trim()) return;

    StorageService.issueCertificate({
      recipientName: certRecipient.trim(),
      recipientRole: certRole,
      title: certTitle.trim(),
      reason: certReason.trim(),
      mentorTeacherName: profile.mentorTeacherName,
      schoolName: profile.schoolName,
      badgeType: 'diamond',
    });

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });

    setShowCertModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Teacher Header Banner */}
      <div className="rounded-3xl bg-white/10 backdrop-blur-2xl text-white p-6 sm:p-8 shadow-2xl border border-white/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-inner">
            <UserCheck className="w-8 h-8 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/80 backdrop-blur-md text-white text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-400/30">
                لوحة الأستاذ المشرف
              </span>
              <span className="text-xs text-emerald-200 font-medium">مباشر ومتزامن ⚡</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Tajawal',sans-serif] mt-1">
              مرحباً، {profile.mentorTeacherName}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-0.5">
              متابعة واعتماد تقارير المعلم الصغير ({profile.name}) في مبادرة تدريس الأقران
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap relative z-10">
          <button
            id="btn-issue-cert-teacher"
            onClick={() => setShowCertModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition-transform hover:scale-105 cursor-pointer border border-amber-300/40"
          >
            <Award className="w-4 h-4" />
            <span>إصدار شهادة تقدير 📜</span>
          </button>

          <button
            onClick={onOpenReportGenerator}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/20 transition-colors backdrop-blur-md cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>سجل التقارير الشامل</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between text-white/70 text-xs font-bold mb-2">
            <span>واردات في انتظار الاعتماد</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {pendingSessions.length} <span className="text-xs font-normal text-white/60">جلسة</span>
          </div>
          <div className="text-[11px] text-amber-300 font-bold mt-1">
            {pendingSessions.length > 0 ? 'تتطلب مراجعتك واعتمادك' : 'تم اعتماد جميع الحصص ✅'}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between text-white/70 text-xs font-bold mb-2">
            <span>الحصص المعتمدة</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {reviewedSessions.length} <span className="text-xs font-normal text-white/60">تقرير معتمد</span>
          </div>
          <div className="text-[11px] text-emerald-300 font-bold mt-1">
            موثقة بختم الأستاذ المشرف
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between text-white/70 text-xs font-bold mb-2">
            <span>ساعات التدريس المعتمدة</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {profile.totalTeachingHours} <span className="text-xs font-normal text-white/60">ساعة</span>
          </div>
          <div className="text-[11px] text-purple-300 font-bold mt-1">
            إنجاز متميز للمعلم الصغير
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between text-white/70 text-xs font-bold mb-2">
            <span>الشهادات الصادرة</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {certificates.length} <span className="text-xs font-normal text-white/60">أوسمة وشهادات</span>
          </div>
          <div className="text-[11px] text-amber-300 font-bold mt-1">
            معتمدة من إدارة المدرسة
          </div>
        </div>
      </div>

      {/* Live Submissions Inbox */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/15 shadow-xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <h3 className="text-xl font-black text-white font-['Tajawal',sans-serif] flex items-center gap-2">
              <span>صندوق الوارد: تقارير الحصص المرفوعة من المعلم الصغير</span>
              {pendingSessions.length > 0 && (
                <span className="bg-rose-500/30 text-rose-300 border border-rose-400/40 text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                  {pendingSessions.length} بانتظار الاعتماد
                </span>
              )}
            </h3>
            <p className="text-xs text-white/70 mt-0.5">
              كل حصة يسجلها الطالب تصل هنا فوراً للاطلاع والتقييم ومنح الملاحظات والأوسمة
            </p>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            لا توجد جلسات مسجلة بعد.
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                id={`teacher-review-item-${session.id}`}
                className={`p-5 rounded-3xl border transition-all ${
                  session.teacherFeedback?.isVerified
                    ? 'bg-white/5 border-white/10'
                    : 'bg-amber-500/10 border-amber-400/40 shadow-lg ring-1 ring-amber-400/20'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        {session.subject}
                      </span>
                      <span className="text-xs bg-white/10 text-white px-2.5 py-0.5 rounded-lg font-medium border border-white/10">
                        {session.day} - {session.date} ({session.time})
                      </span>
                      <span className="text-xs text-white/70">
                        الطالب المتدرب: <strong className="text-white">{session.studentName}</strong> ({session.studentGrade})
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">
                      {session.topic}
                    </h4>

                    <p className="text-xs text-white/80 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/10">
                      <strong className="text-amber-300">تقرير الشرح:</strong> {session.lessonReport}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="text-white/70">
                        <strong className="text-white">مستوى الفهم:</strong> {session.understandingLevel}
                      </div>
                      <div className="text-white/70">
                        <strong className="text-white">توصية المعلم الصغير:</strong> {session.recommendationsForTeacher || 'متابعة تشجيع الطالب.'}
                      </div>
                    </div>

                    {session.teacherFeedback?.isVerified && (
                      <div className="mt-2 bg-emerald-500/15 border border-emerald-400/30 p-3 rounded-2xl text-xs text-emerald-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold flex items-center gap-1 text-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            تم الاعتماد من قِبلك ({session.teacherFeedback.teacherName})
                          </span>
                          <div className="flex items-center">
                            {[...Array(session.teacherFeedback.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-white/80">{session.teacherFeedback.notes}</p>
                        {session.teacherFeedback.awardedBadge && (
                          <div className="mt-1 font-bold text-amber-300">
                            الوسام الممنوح: {session.teacherFeedback.awardedBadge}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
                    {!session.teacherFeedback?.isVerified ? (
                      <button
                        id={`btn-approve-${session.id}`}
                        onClick={() => setSelectedSessionForReview(session)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-400/30"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>اعتماد ومنح وسام ⭐</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedSessionForReview(session)}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1 border border-white/15 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل الملاحظات</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewSession(session)}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 border border-white/15 cursor-pointer"
                        title="معاينة التقرير وطباعته"
                      >
                        <Eye className="w-4 h-4 text-amber-300" />
                        <span className="hidden sm:inline">معاينة</span>
                      </button>

                      <button
                        onClick={() => PdfGenerator.downloadHtmlReport(session)}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors border border-white/15 cursor-pointer"
                        title="تنزيل كملف مستقل"
                      >
                        <Download className="w-4 h-4 text-amber-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review / Approval Modal */}
      {selectedSessionForReview && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/20 text-white animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">اعتماد تقرير الحصة وتقييمها</h4>
                  <p className="text-xs text-white/70">حصة {selectedSessionForReview.studentName} - {selectedSessionForReview.subject}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSessionForReview(null)}
                className="w-8 h-8 rounded-full hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApproveSession} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">تقييم أداء المعلم الصغير:</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-white/20'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-300 mr-2">{rating} من 5 نجوم</span>
                </div>
              </div>

              {/* Award Badge selection */}
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">منح وسام تميز خاص بالحصة:</label>
                <select
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/20 text-xs sm:text-sm bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="وسام المعلم المتميز 🏆">وسام المعلم المتميز 🏆</option>
                  <option value="وسام الشرح المتقن ⭐">وسام الشرح المتقن ⭐</option>
                  <option value="وسام الإبداع العلمي 🧪">وسام الإبداع العلمي 🧪</option>
                  <option value="وسام فصاحة البيان 📖">وسام فصاحة البيان 📖</option>
                  <option value="وسام الصبر والتشجيع 💡">وسام الصبر والتشجيع 💡</option>
                </select>
              </div>

              {/* Teacher Feedback Notes */}
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">ملاحظات وتوجيهات الأستاذ المشرف للمعلم الصغير:</label>
                <textarea
                  rows={3}
                  required
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  placeholder="اكتب توجيهاتك التربوية وتشجيعك..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 text-xs sm:text-sm bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/15">
                <button
                  type="button"
                  onClick={() => setSelectedSessionForReview(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer border border-emerald-400/30"
                >
                  اعتماد التقرير رسمياً ✅
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/20 text-white animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">إصدار وسام وشهادة تقدير رسمية</h4>
                  <p className="text-xs text-white/70">معتمدة من المشرف التربوي وإدارة المدرسة</p>
                </div>
              </div>
              <button
                onClick={() => setShowCertModal(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueCertificate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">اسم المكرم:</label>
                <input
                  type="text"
                  required
                  value={certRecipient}
                  onChange={(e) => setCertRecipient(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/20 text-xs sm:text-sm bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">صفة المكرم:</label>
                <select
                  value={certRole}
                  onChange={(e) => setCertRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs sm:text-sm bg-slate-800 text-white"
                >
                  <option value="المعلم الصغير">المعلم الصغير</option>
                  <option value="طالب متميز">طالب متميز</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">عنوان الشهادة:</label>
                <input
                  type="text"
                  required
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/20 text-xs sm:text-sm bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">سبب التكريم والعبارة التقديرية:</label>
                <textarea
                  rows={3}
                  required
                  value={certReason}
                  onChange={(e) => setCertReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/20 text-xs sm:text-sm bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/15">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md cursor-pointer transition-colors"
                >
                  إصدار الشهادة 📜
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
