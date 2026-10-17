import React, { useState } from 'react';
import { UserPlus, BookOpen, Star, Sparkles, ChevronLeft, Phone, Calendar } from 'lucide-react';
import { Student, GradeLevel } from '../types';

interface StudentCardsProps {
  students: Student[];
  onSelectStudentForSession: (student: Student) => void;
  onAddStudent: (student: Omit<Student, 'id' | 'enrolledDate' | 'totalSessionsCount' | 'overallScore'>) => void;
}

export const StudentCards: React.FC<StudentCardsProps> = ({
  students,
  onSelectStudentForSession,
  onAddStudent,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('المرحلة الابتدائية');
  const [primarySubject, setPrimarySubject] = useState('الرياضيات');
  const [progressSummary, setProgressSummary] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddStudent({
      name: name.trim(),
      gradeLevel,
      primarySubject,
      progressSummary: progressSummary.trim() || `طالب في ${gradeLevel}، مادة ${primarySubject}.`,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      phone,
    });

    setName('');
    setProgressSummary('');
    setPhone('');
    setShowAddModal(false);
  };

  return (
    <section className="mt-8 mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 font-['Tajawal',sans-serif]">
            <span>الطلاب المسجلون</span>
            <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 backdrop-blur-md">
              {students.length} طلاب
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-white/70 mt-0.5">
            الطلاب الذين يتلقون جلسات الدعم والمراجعة من المعلم الصغير
          </p>
        </div>

        <button
          id="btn-open-add-student-modal"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer backdrop-blur-md shadow-sm hover:shadow"
        >
          <UserPlus className="w-4 h-4 text-amber-300" />
          <span>إضافة طالب جديد</span>
        </button>
      </div>

      {/* Grid Cards (2 columns on mobile/tablet, 4 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {students.map((student) => (
          <div
            key={student.id}
            id={`student-card-${student.id}`}
            className="group bg-white/10 backdrop-blur-xl rounded-3xl border border-white/15 hover:border-amber-400/60 shadow-xl hover:bg-white/15 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              {/* Card Image */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900/40">
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-xl border border-white/15 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>{student.overallScore}%</span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-amber-500/90 backdrop-blur-md text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-lg border border-amber-300/40">
                  {student.primarySubject}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 text-right">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {student.name}
                  </h4>
                  <span className="text-[11px] bg-white/10 text-white/80 border border-white/10 px-2 py-0.5 rounded-lg font-medium">
                    {student.gradeLevel.replace('المرحلة ', '')}
                  </span>
                </div>

                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed mb-3">
                  {student.progressSummary}
                </p>

                <div className="flex items-center justify-between text-[11px] text-white/60 pt-2.5 border-t border-white/10">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>{student.totalSessionsCount} حصص منجزة</span>
                  </span>
                  <button
                    onClick={() => setSelectedStudentDetail(student)}
                    className="text-amber-300 hover:text-amber-200 font-bold hover:underline cursor-pointer"
                  >
                    عرض الملف
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="p-3 bg-white/5 border-t border-white/10 flex items-center gap-2">
              <button
                id={`btn-start-session-for-${student.id}`}
                onClick={() => onSelectStudentForSession(student)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>بدء حصة مع {student.name.split(' ')[0]}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Student Modal with Frosted Glass */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200 text-right text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">تسجيل طالب جديد</h4>
                  <p className="text-xs text-white/60">إضافة طالب لمتابعة دروسه وتقاريره</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">اسم الطالب الكامل</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: خالد عبد العزيز"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">المرحلة الدراسية</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2.5 rounded-xl bg-indigo-950/80 border border-white/20 text-white focus:ring-2 focus:ring-amber-400 text-sm outline-none"
                  >
                    <option value="المرحلة الابتدائية" className="bg-indigo-950 text-white">المرحلة الابتدائية</option>
                    <option value="المرحلة المتوسطة" className="bg-indigo-950 text-white">المرحلة المتوسطة</option>
                    <option value="المرحلة الثانوية" className="bg-indigo-950 text-white">المرحلة الثانوية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">المادة الأساسية</label>
                  <select
                    value={primarySubject}
                    onChange={(e) => setPrimarySubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-indigo-950/80 border border-white/20 text-white focus:ring-2 focus:ring-amber-400 text-sm outline-none"
                  >
                    <option value="الرياضيات" className="bg-indigo-950 text-white">الرياضيات</option>
                    <option value="العلوم" className="bg-indigo-950 text-white">العلوم</option>
                    <option value="اللغة الإنجليزية" className="bg-indigo-950 text-white">اللغة الإنجليزية</option>
                    <option value="اللغة العربية والقراءة" className="bg-indigo-950 text-white">اللغة العربية والقراءة</option>
                    <option value="الدراسات الاجتماعية" className="bg-indigo-950 text-white">الدراسات الاجتماعية</option>
                    <option value="الحاسب الآلي والتقنية" className="bg-indigo-950 text-white">الحاسب الآلي</option>
                    <option value="الفيزياء" className="bg-indigo-950 text-white">الفيزياء</option>
                    <option value="الكيمياء" className="bg-indigo-950 text-white">الكيمياء</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">نبذة عن مستوى الطالب واحتياجاته</label>
                <textarea
                  rows={2}
                  placeholder="مثال: يحتاج تقوية في الكسور وحل المسائل اللفظية..."
                  value={progressSummary}
                  onChange={(e) => setProgressSummary(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-amber-400 text-sm outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">رقم هاتف الطالب / ولي الأمر (لإرسال التقارير)</label>
                <input
                  type="tel"
                  placeholder="+966500000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-amber-400 text-sm outline-none text-left"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white font-bold text-xs cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md cursor-pointer"
                >
                  حفظ وتسجيل الطالب ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile Quick Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200 text-right text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentDetail.avatarUrl}
                  alt={selectedStudentDetail.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400"
                />
                <div>
                  <h4 className="text-lg font-bold text-white">{selectedStudentDetail.name}</h4>
                  <p className="text-xs text-white/70">{selectedStudentDetail.gradeLevel} • {selectedStudentDetail.primarySubject}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="w-8 h-8 rounded-full hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <div className="text-xs font-bold text-amber-300 mb-1">ملخص التقدم وملاحظات المعلم الصغير:</div>
                <p className="text-xs text-white/90 leading-relaxed">{selectedStudentDetail.progressSummary}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="text-white/60 mb-0.5">معدل الإتقان</div>
                  <div className="text-base font-black text-amber-300">{selectedStudentDetail.overallScore}% ⭐</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="text-white/60 mb-0.5">الحصص المنجزة</div>
                  <div className="text-base font-black text-white">{selectedStudentDetail.totalSessionsCount} حصص</div>
                </div>
              </div>

              {selectedStudentDetail.phone && (
                <div className="flex items-center gap-2 text-xs text-white/80 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>هاتف الطالب / ولي الأمر: <strong dir="ltr">{selectedStudentDetail.phone}</strong></span>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  const st = selectedStudentDetail;
                  setSelectedStudentDetail(null);
                  onSelectStudentForSession(st);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-md cursor-pointer"
              >
                بدء حصة تدريسية جديدة الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
