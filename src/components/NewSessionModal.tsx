import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  Send, 
  MessageCircle, 
  Calendar, 
  Clock, 
  BookOpen, 
  User, 
  FileText, 
  CheckCircle,
  HelpCircle,
  Loader2,
  X
} from 'lucide-react';
import { Student, TeachingSession, GradeLevel, SubjectType, UnderstandingLevel, JuniorTeacherProfile } from '../types';
import { StorageService } from '../services/storage';
import { ShareService } from '../services/shareService';
import { GeminiService } from '../services/gemini';
import { PdfGenerator } from '../services/pdfGenerator';
import confetti from 'canvas-confetti';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  profile: JuniorTeacherProfile;
  initialStudent?: Student | null;
}

export const NewSessionModal: React.FC<NewSessionModalProps> = ({
  isOpen,
  onClose,
  students,
  profile,
  initialStudent,
}) => {
  // Form fields
  const [studentId, setStudentId] = useState(initialStudent?.id || students[0]?.id || 'custom');
  const [studentName, setStudentName] = useState(initialStudent?.name || students[0]?.name || '');
  const [studentGrade, setStudentGrade] = useState<GradeLevel>(initialStudent?.gradeLevel || 'المرحلة الابتدائية');
  const [subject, setSubject] = useState<SubjectType | string>(initialStudent?.primarySubject || 'الرياضيات');
  const [topic, setTopic] = useState('');
  
  // Date & Time defaults
  const todayDate = new Date().toISOString().split('T')[0];
  const daysArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const currentDayName = daysArabic[new Date().getDay()];

  const [day, setDay] = useState(currentDayName);
  const [date, setDate] = useState(todayDate);
  const [time, setTime] = useState('04:00 م');
  const [durationMinutes, setDurationMinutes] = useState(45);

  // Detailed Report fields
  const [lessonReport, setLessonReport] = useState('');
  const [understandingLevel, setUnderstandingLevel] = useState<UnderstandingLevel>('ممتاز جداً (90-100%)');
  const [strengthsObserved, setStrengthsObserved] = useState('');
  const [areasToImprove, setAreasToImprove] = useState('');
  const [homeworkGiven, setHomeworkGiven] = useState('');
  const [recommendationsForTeacher, setRecommendationsForTeacher] = useState('');

  // Immediate action toggles
  const [sendWhatsAppImmediate, setSendWhatsAppImmediate] = useState(true);
  const [sendTelegramImmediate, setSendTelegramImmediate] = useState(false);
  const [downloadPdfImmediate, setDownloadPdfImmediate] = useState(false);

  // AI polishing state
  const [isPolishing, setIsPolishing] = useState(false);
  const [aiNote, setAiNote] = useState('');

  useEffect(() => {
    if (initialStudent) {
      setStudentId(initialStudent.id);
      setStudentName(initialStudent.name);
      setStudentGrade(initialStudent.gradeLevel);
      setSubject(initialStudent.primarySubject);
    }
  }, [initialStudent]);

  if (!isOpen) return null;

  const handleStudentSelectChange = (val: string) => {
    setStudentId(val);
    const selected = students.find((s) => s.id === val);
    if (selected) {
      setStudentName(selected.name);
      setStudentGrade(selected.gradeLevel);
      setSubject(selected.primarySubject);
    }
  };

  const handleAiPolishReport = async () => {
    if (!lessonReport.trim() && !topic.trim()) {
      alert('الرجاء كتابة مسودة تقرير أو موضوع الدرس أولاً ليقوم الذكاء الاصطناعي بصياغته وترتيبه.');
      return;
    }

    setIsPolishing(true);
    setAiNote('');
    try {
      const res = await GeminiService.callAssist({
        action: 'polish_report',
        studentName,
        subject,
        topic,
        gradeLevel: studentGrade,
        currentDraft: lessonReport,
      });

      if (res.content) {
        setLessonReport(res.content);
        setAiNote('✨ تمت الصياغة والتحسين التربوي بنجاح بواسطة المساعد الذكي!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !topic.trim() || !lessonReport.trim()) {
      alert('الرجاء ملء اسم الطالب وموضوع الدرس وتقرير الشرح.');
      return;
    }

    // Save session to storage
    const newSession = StorageService.addSession({
      studentId: studentId || `student-${Date.now()}`,
      studentName: studentName.trim(),
      studentGrade,
      subject,
      topic: topic.trim(),
      day,
      date,
      time,
      durationMinutes: Number(durationMinutes) || 45,
      lessonReport: lessonReport.trim(),
      understandingLevel,
      strengthsObserved: strengthsObserved.trim() || 'تفاعل ممتاز وسرعة بديهة في حل المسائل.',
      areasToImprove: areasToImprove.trim() || 'المراجعة المنتظمة للتأكد من رسوخ المفاهيم.',
      homeworkGiven: homeworkGiven.trim() || 'حل التمارين المحددة في مذكرة الطالب.',
      recommendationsForTeacher: recommendationsForTeacher.trim() || 'يرجى تشجيع الطالب في الحصة الصفية القادمة.',
      juniorTeacherName: profile.name,
      imageUrl: 'https://images.mediadirhub.com/vibe/digital-calendar-showing-april-5-4-pm-with-math-symbols-in-background.png',
    });

    // Confetti celebration
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Immediate dispatching if checked
    if (sendWhatsAppImmediate) {
      setTimeout(() => {
        ShareService.shareToWhatsApp(newSession, profile.mentorTeacherPhone);
      }, 500);
    }

    if (sendTelegramImmediate) {
      setTimeout(() => {
        ShareService.shareToTelegram(newSession);
      }, 800);
    }

    if (downloadPdfImmediate) {
      setTimeout(() => {
        PdfGenerator.downloadHtmlReport(newSession);
      }, 1000);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200 text-right text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/20 font-black">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-['Tajawal',sans-serif]">
                تسجيل حصة تدريسية جديدة
              </h3>
              <p className="text-xs text-white/70">
                توثيق جلسة تدريس الأقران وإعداد تقرير الـ PDF الموجه للأستاذ المشرف
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Info Card */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <User className="w-4 h-4 text-amber-400" />
              <span>بيانات الطالب والمادة:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-white/80 mb-1">الطالب المسجل:</label>
                <select
                  value={studentId}
                  onChange={(e) => handleStudentSelectChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs sm:text-sm bg-slate-800 text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id} className="bg-slate-800 text-white">
                      {st.name} ({st.gradeLevel.replace('المرحلة ', '')})
                    </option>
                  ))}
                  <option value="custom" className="bg-slate-800 text-white">+ طالب آخر غير مسجل</option>
                </select>
              </div>

              {studentId === 'custom' && (
                <div>
                  <label className="block text-[11px] font-bold text-white/80 mb-1">اسم الطالب:</label>
                  <input
                    type="text"
                    required
                    placeholder="اسم الطالب"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs sm:text-sm bg-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-white/80 mb-1">المرحلة الدراسية:</label>
                <select
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(e.target.value as GradeLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs sm:text-sm bg-slate-800 text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="المرحلة الابتدائية" className="bg-slate-800 text-white">المرحلة الابتدائية</option>
                  <option value="المرحلة المتوسطة" className="bg-slate-800 text-white">المرحلة المتوسطة</option>
                  <option value="المرحلة الثانوية" className="bg-slate-800 text-white">المرحلة الثانوية</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white/80 mb-1">المادة:</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs sm:text-sm bg-slate-800 text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="الرياضيات" className="bg-slate-800 text-white">الرياضيات</option>
                  <option value="العلوم" className="bg-slate-800 text-white">العلوم</option>
                  <option value="اللغة الإنجليزية" className="bg-slate-800 text-white">اللغة الإنجليزية</option>
                  <option value="اللغة العربية والقراءة" className="bg-slate-800 text-white">اللغة العربية والقراءة</option>
                  <option value="الدراسات الاجتماعية" className="bg-slate-800 text-white">الدراسات الاجتماعية</option>
                  <option value="الحاسب الآلي والتقنية" className="bg-slate-800 text-white">الحاسب الآلي والتقنية</option>
                  <option value="الفيزياء" className="bg-slate-800 text-white">الفيزياء</option>
                  <option value="الكيمياء" className="bg-slate-800 text-white">الكيمياء</option>
                  <option value="التربية الإسلامية" className="bg-slate-800 text-white">التربية الإسلامية</option>
                  <option value="أخرى" className="bg-slate-800 text-white">أخرى</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/80 mb-1">موضوع الدرس المحدد (عنوان الحصة):</label>
              <input
                type="text"
                required
                placeholder="مثال: حل المعادلات الخطية واستخراج قيمة المتغير (س)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 text-xs sm:text-sm bg-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Date, Day, Time, Duration Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div>
              <label className="block text-[11px] font-bold text-white/80 mb-1">اليوم:</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-white/20 text-xs bg-slate-800 text-white"
              >
                {daysArabic.map((d) => (
                  <option key={d} value={d} className="bg-slate-800 text-white">{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/80 mb-1">التاريخ:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-white/20 text-xs bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/80 mb-1">الوقت:</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="04:00 م"
                className="w-full px-2.5 py-1.5 rounded-xl border border-white/20 text-xs bg-white/10 text-white placeholder-white/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/80 mb-1">المدة (بالدقائق):</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-xl border border-white/20 text-xs bg-white/10 text-white"
              />
            </div>
          </div>

          {/* Detailed Lesson Report with AI polish action */}
          <div className="bg-amber-400/10 p-4 rounded-2xl border border-amber-400/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>تقرير كامل عما درّسه المعلم الصغير للطلاب (تفاصيل الشرح):</span>
              </label>

              <button
                type="button"
                id="btn-ai-polish-report"
                onClick={handleAiPolishReport}
                disabled={isPolishing}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer disabled:opacity-50 border border-purple-400/30"
              >
                {isPolishing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جارٍ الصياغة...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>تحسين تربوي بالذكاء الاصطناعي ✨</span>
                  </>
                )}
              </button>
            </div>

            {aiNote && (
              <div className="text-[11px] text-purple-200 bg-purple-900/50 p-2 rounded-lg font-medium border border-purple-500/30">
                {aiNote}
              </div>
            )}

            <textarea
              rows={4}
              required
              placeholder="اكتب هنا بالتفصيل ما تم شرحه للطالب، المفاهيم التي تم التركيز عليها، التمارين المحلولة، ومدى تفاعله..."
              value={lessonReport}
              onChange={(e) => setLessonReport(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 text-xs sm:text-sm bg-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-amber-400 focus:outline-none leading-relaxed resize-none"
            />
          </div>

          {/* Assessment & Additional fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-white/80 mb-1">تقييم مستوى الاستيعاب:</label>
              <select
                value={understandingLevel}
                onChange={(e) => setUnderstandingLevel(e.target.value as UnderstandingLevel)}
                className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs bg-slate-800 text-white"
              >
                <option value="ممتاز جداً (90-100%)" className="bg-slate-800 text-white">ممتاز جداً (90-100%) ⭐</option>
                <option value="جيد جداً (80-89%)" className="bg-slate-800 text-white">جيد جداً (80-89%)</option>
                <option value="جيد (70-79%)" className="bg-slate-800 text-white">جيد (70-79%)</option>
                <option value="يحتاج دعم ومتابعة (<70%)" className="bg-slate-800 text-white">يحتاج دعم ومتابعة (&lt;70%)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/80 mb-1">نقاط القوة الملاحظة:</label>
              <input
                type="text"
                placeholder="مثال: سرعة البديهة وحفظ القواعد"
                value={strengthsObserved}
                onChange={(e) => setStrengthsObserved(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs bg-white/10 text-white placeholder-white/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/80 mb-1">الواجب المنزلي المعطى للطالب:</label>
              <input
                type="text"
                placeholder="مثال: حل صفحة 45 المسائل 1-4"
                value={homeworkGiven}
                onChange={(e) => setHomeworkGiven(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs bg-white/10 text-white placeholder-white/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/80 mb-1">توصية المعلم الصغير للأستاذ المشرف:</label>
              <input
                type="text"
                placeholder="مثال: إشراك الطالب في المشاركات الصفية لتعزيز ثقته"
                value={recommendationsForTeacher}
                onChange={(e) => setRecommendationsForTeacher(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs bg-white/10 text-white placeholder-white/40"
              />
            </div>
          </div>

          {/* Quick Dispatch Actions Checkboxes */}
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-2">
            <div className="text-xs font-bold text-white/90">إجراءات فورية عند الحفظ:</div>
            <div className="flex items-center gap-4 flex-wrap text-xs text-white/80">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendWhatsAppImmediate}
                  onChange={(e) => setSendWhatsAppImmediate(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-400 w-4 h-4 bg-slate-800 border-white/30"
                />
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>إرسال التقرير للمعلم عبر واتساب فوراً</span>
                </span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendTelegramImmediate}
                  onChange={(e) => setSendTelegramImmediate(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-sky-400 w-4 h-4 bg-slate-800 border-white/30"
                />
                <span className="flex items-center gap-1">
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  <span>إرسال عبر تليجرام</span>
                </span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={downloadPdfImmediate}
                  onChange={(e) => setDownloadPdfImmediate(e.target.checked)}
                  className="rounded text-purple-500 focus:ring-purple-400 w-4 h-4 bg-slate-800 border-white/30"
                />
                <span>تنزيل ملف التقرير تلقائياً</span>
              </label>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/15">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-colors border border-white/15 cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              id="btn-save-new-session"
              className="px-7 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-400/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-amber-300/40"
            >
              حفظ الحصة وتوليد التقرير ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
