import React from 'react';
import { Sparkles, Users, Award, BookOpen, Clock, ArrowLeft } from 'lucide-react';
import { JuniorTeacherProfile, Student, TeachingSession } from '../types';

interface HeroBannerProps {
  onStartSession: () => void;
  profile: JuniorTeacherProfile;
  students: Student[];
  sessions: TeachingSession[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartSession,
  profile,
  students,
  sessions,
}) => {
  const verifiedSessionsCount = sessions.filter((s) => s.teacherFeedback?.isVerified).length;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-2xl text-white shadow-2xl border border-white/20">
      {/* Background Decorative overlays and subtle glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-slate-900/30 to-transparent z-10 pointer-events-none" />

      {/* Main Grid Content */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 items-center min-h-[260px]">
        {/* Text & Action column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center items-start text-right">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-amber-300 border border-white/20 mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>مبادرة التميز الطلابي وتدريس الأقران</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-['Tajawal',sans-serif] drop-shadow-md mb-3">
            أنت المعلم الصغير، مُرشدٌ متميز
          </h2>

          <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl mb-6">
            سجّل جلساتك التدريسية لزملائك، وثّق تقارير الشرح التفصيلية، وأرسلها مباشرة للأستاذ المشرف عبر واتساب وتليجرام كملف PDF معتمد!
          </p>

          {/* Action Button styled per design */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              id="hero-start-session-btn"
              onClick={onStartSession}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-amber-200"
            >
              <span>ابدأ التسجيل</span>
              <ArrowLeft className="w-5 h-5 text-slate-900" />
            </button>

            <div className="text-xs text-white/70 font-medium">
              ✨ توثيق فوري • تقارير PDF • إرسال بضغطة زر
            </div>
          </div>
        </div>

        {/* Hero Image column */}
        <div className="lg:col-span-5 relative h-56 sm:h-72 lg:h-full w-full overflow-hidden flex items-center justify-center">
          <img
            src="https://images.mediadirhub.com/vibe/teacher-and-student-in-quiet-classroom-with-open-book-and-notebook.png"
            alt="المعلم الصغير والطالب في الفصل"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Bottom KPI Bar */}
      <div className="relative z-20 bg-white/5 backdrop-blur-xl border-t border-white/15 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-amber-300 text-sm font-bold">
            <Users className="w-4 h-4" />
            <span className="text-xl font-black text-white">{students.length}</span>
          </div>
          <span className="text-[11px] text-white/70">الطلاب المسجلون</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-amber-300 text-sm font-bold">
            <Clock className="w-4 h-4" />
            <span className="text-xl font-black text-white">{profile.totalTeachingHours} ساعة</span>
          </div>
          <span className="text-[11px] text-white/70">ساعات التدريس</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-amber-300 text-sm font-bold">
            <BookOpen className="w-4 h-4" />
            <span className="text-xl font-black text-white">{sessions.length}</span>
          </div>
          <span className="text-[11px] text-white/70">الجلسات المنجزة</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold">
            <Award className="w-4 h-4" />
            <span className="text-xl font-black text-white">{verifiedSessionsCount}</span>
          </div>
          <span className="text-[11px] text-white/70">تقارير معتمدة من المعلم</span>
        </div>
      </div>
    </div>
  );
};
