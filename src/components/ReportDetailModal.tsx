import React, { useRef } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Share2, 
  MessageCircle, 
  Send, 
  CheckCircle, 
  Star, 
  Calendar, 
  Clock, 
  User, 
  GraduationCap,
  Award,
  X
} from 'lucide-react';
import { TeachingSession, JuniorTeacherProfile } from '../types';
import { PdfGenerator } from '../services/pdfGenerator';
import { ShareService } from '../services/shareService';

interface ReportDetailModalProps {
  session: TeachingSession | null;
  onClose: () => void;
  profile: JuniorTeacherProfile;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  session,
  onClose,
  profile,
}) => {
  const printableAreaRef = useRef<HTMLDivElement>(null);

  if (!session) return null;

  const handlePrint = () => {
    PdfGenerator.printElement('official-printable-report-card');
  };

  const handleDownloadHtml = () => {
    PdfGenerator.downloadHtmlReport(session);
  };

  const handleGeneratePdf = () => {
    PdfGenerator.downloadElementAsPdf(
      'official-printable-report-card',
      `تقرير-المعلم-الصغير-${session.studentName}-${session.date}.pdf`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl max-w-3xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200 text-right flex flex-col justify-between text-white">
        {/* Modal Top Toolbar (Non-printable) */}
        <div className="p-4 sm:p-6 pb-3 border-b border-white/15 flex items-center justify-between gap-2 flex-wrap print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-lg font-black text-white font-['Tajawal',sans-serif]">
              تقرير حصة تدريس الأقران الرسمية
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer border border-white/15"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>طباعة 🖨️</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold text-xs border border-amber-400/30 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>تنزيل PDF / HTML</span>
            </button>

            <button
              onClick={() => ShareService.shareToWhatsApp(session, profile.mentorTeacherPhone)}
              className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl transition-colors cursor-pointer border border-emerald-400/30"
              title="إرسال عبر واتساب"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <button
              onClick={() => ShareService.shareToTelegram(session)}
              className="p-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-xl transition-colors cursor-pointer border border-sky-400/30"
              title="إرسال عبر تليجرام"
            >
              <Send className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center text-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Content */}
        <div id="official-printable-report-card" ref={printableAreaRef} className="p-6 sm:p-10 space-y-6 bg-white text-slate-900 rounded-2xl mx-4 my-2 print:p-0 print:m-0">
          {/* Header of the Official Report */}
          <div className="border-b-2 border-amber-500 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold text-amber-600 mb-0.5">المملكة العربية السعودية • وزارة التعليم</div>
                <div className="text-xs text-slate-500">{profile.schoolName}</div>
                <div className="text-xs text-slate-500">برنامج التميز الطلابي - مبادرة (المعلم الصغير)</div>
              </div>

              <div className="text-left">
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-lg text-xs font-black">
                  <GraduationCap className="w-4 h-4 text-amber-700" />
                  <span>وثيقة تقرير تدريس معتمدة</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">الرقم المرجعي: #{session.id.slice(0, 8)}</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-2xl font-black text-slate-900 font-['Tajawal',sans-serif]">
                تقرير تدريس جلسة: {session.topic}
              </h2>
              <div className="text-xs text-slate-500 mt-1">
                مادة {session.subject} • {session.studentGrade}
              </div>
            </div>
          </div>

          {/* Grid Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/40 p-4 rounded-2xl border border-amber-200/80 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">المعلم الصغير:</span>
              <strong className="text-slate-900 text-sm">{session.juniorTeacherName || profile.name}</strong>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">الطالب المستفيد:</span>
              <strong className="text-slate-900 text-sm">{session.studentName}</strong>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">اليوم والتاريخ:</span>
              <strong className="text-slate-900">{session.day}، {session.date}</strong>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">الوقت والمدة:</span>
              <strong className="text-slate-900">{session.time} ({session.durationMinutes} دقيقة)</strong>
            </div>
          </div>

          {/* Detailed Lesson Explanation */}
          <div className="space-y-2">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>تقرير تفاصيل الشرح والأنشطة التدريسية:</span>
            </h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {session.lessonReport}
            </div>
          </div>

          {/* Key Observations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">🎯 مستوى الاستيعاب والفهم:</div>
              <p className="text-amber-700 font-bold">{session.understandingLevel}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">✨ نقاط القوة الملاحظة:</div>
              <p className="text-slate-700">{session.strengthsObserved || 'تفاعل إيجابي وسرعة في استيعاب التمارين التطبيقية.'}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">📝 الواجب والمهام المنزلية:</div>
              <p className="text-slate-700">{session.homeworkGiven || 'حل الأسئلة والتمارين ذات الصلة بالدرس.'}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">💡 توصيات للأستاذ المشرف:</div>
              <p className="text-slate-700">{session.recommendationsForTeacher || 'يرجى متابعة تشجيع الطالب بالمشاركات الصفية.'}</p>
            </div>
          </div>

          {/* Teacher Review Stamp Section */}
          <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <h5 className="text-sm font-black text-emerald-950">
                    اعتماد ورأي الأستاذ المشرف ({session.teacherFeedback?.teacherName || profile.mentorTeacherName})
                  </h5>
                </div>
                <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                  {session.teacherFeedback?.notes || 'تمت مراجعة تقرير الحصة والتأكد من ملاءمة أهداف الشرح ونوعية التمارين.'}
                </p>
                {session.teacherFeedback?.awardedBadge && (
                  <div className="mt-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-lg inline-block">
                    الوسام: {session.teacherFeedback.awardedBadge}
                  </div>
                )}
              </div>

              {/* Official Seal Mockup */}
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-600 flex flex-col items-center justify-center text-center p-2 text-[10px] text-emerald-800 font-bold bg-white/70 shadow-sm shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-600 mb-0.5" />
                <span>معتمد رسمياً</span>
                <span className="text-[8px] text-slate-500">{session.date}</span>
              </div>
            </div>
          </div>

          {/* Signatures footer */}
          <div className="grid grid-cols-2 pt-6 border-t border-slate-200 text-xs text-center">
            <div>
              <div className="text-slate-500 mb-6">توقيع المعلم الصغير:</div>
              <div className="font-bold text-slate-900">{session.juniorTeacherName || profile.name}</div>
            </div>
            <div>
              <div className="text-slate-500 mb-6">توقيع المعلم المشرف:</div>
              <div className="font-bold text-slate-900">{profile.mentorTeacherName}</div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-white/5 border-t border-white/15 flex items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-white/70">
            يمكنك حفظ هذا التقرير كـ PDF ومشاركته عبر واتساب وتليجرام مباشرة
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => ShareService.shareToWhatsApp(session, profile.mentorTeacherPhone)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow cursor-pointer border border-emerald-400/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال واتساب للمعلم</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
