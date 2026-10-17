import React from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  PlusCircle, 
  Sparkles, 
  Download, 
  Award, 
  Clock, 
  Users,
  BookOpen
} from 'lucide-react';
import { JuniorTeacherProfile } from '../types';

interface NavbarProps {
  activeTab: 'student_view' | 'teacher_view';
  setActiveTab: (tab: 'student_view' | 'teacher_view') => void;
  onOpenNewSession: () => void;
  onOpenAiAssistant: () => void;
  onOpenZipModal: () => void;
  profile: JuniorTeacherProfile;
  pendingReviewsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewSession,
  onOpenAiAssistant,
  onOpenZipModal,
  profile,
  pendingReviewsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/10 backdrop-blur-2xl border-b border-white/15 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25 ring-2 ring-white/30">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white font-['Tajawal',sans-serif]">
                  المعلم الصغير
                </h1>
                <span className="bg-amber-400/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-400/30 backdrop-blur-md">
                  تدريس الأقران
                </span>
              </div>
              <p className="text-xs text-white/70 flex items-center gap-1 font-medium mt-0.5">
                <span>{profile.name}</span> • <span>{profile.grade}</span>
              </p>
            </div>
          </div>

          {/* Mode Switcher (Student vs Teacher Dashboard) */}
          <div className="bg-white/10 backdrop-blur-xl p-1.5 rounded-2xl flex items-center border border-white/15 shadow-inner">
            <button
              id="btn-switch-student-view"
              onClick={() => setActiveTab('student_view')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'student_view'
                  ? 'bg-white/25 text-white shadow-inner border border-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>لوحة المعلم الصغير</span>
            </button>

            <button
              id="btn-switch-teacher-view"
              onClick={() => setActiveTab('teacher_view')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'teacher_view'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>لوحة المعلم المشرف</span>
              {pendingReviewsCount > 0 && (
                <span className="bg-rose-500 text-white text-[11px] px-1.5 py-0.2 rounded-full font-black animate-pulse shadow">
                  {pendingReviewsCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              id="btn-open-ai-assistant"
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500/80 to-indigo-600/80 hover:from-purple-500 hover:to-indigo-600 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-purple-900/30 border border-white/20 backdrop-blur-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
              title="المساعد التربوي الذكي للمعلم الصغير"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden sm:inline">المساعد الذكي</span>
            </button>

            <button
              id="btn-quick-new-session"
              onClick={onOpenNewSession}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/25 border border-amber-200 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>تسجيل حصة جديدة</span>
            </button>

            <button
              id="btn-download-project-zip"
              onClick={onOpenZipModal}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/15 transition-all backdrop-blur-md cursor-pointer text-xs font-bold shadow-sm"
              title="تنزيل المشروع كاملاً كملف مضغوط ZIP"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">تحميل المشروع (ZIP) 📦</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick stats mini ribbon with frosted glass styling */}
      <div className="bg-white/5 backdrop-blur-lg border-t border-white/10 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/80 font-medium">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>الساعات المنجزة: <strong className="text-white font-bold">{profile.totalTeachingHours} ساعة</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>نقاط التميز: <strong className="text-white font-bold">{profile.points} نقطة</strong></span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>المشرف الأكاديمي: <strong className="text-white font-bold">{profile.mentorTeacherName}</strong></span>
            </span>
          </div>
          <div className="text-amber-300 font-bold bg-amber-500/20 border border-amber-400/30 px-3 py-0.5 rounded-full text-[11px] backdrop-blur-md">
            {profile.rankBadge}
          </div>
        </div>
      </div>
    </header>
  );
};
