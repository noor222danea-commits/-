import React from 'react';
import { Calendar, Clock, CheckCircle2, FileText, Share2, Eye, Star } from 'lucide-react';
import { TeachingSession } from '../types';
import { ShareService } from '../services/shareService';

interface RecentSessionsProps {
  sessions: TeachingSession[];
  onViewSession: (session: TeachingSession) => void;
  onOpenNewSession: () => void;
}

export const RecentSessions: React.FC<RecentSessionsProps> = ({
  sessions,
  onViewSession,
  onOpenNewSession,
}) => {
  return (
    <section className="mt-10 mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 font-['Tajawal',sans-serif]">
            <span>جلسات التدريس الأخيرة</span>
            <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 backdrop-blur-md">
              {sessions.length} جلسة
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-white/70 mt-0.5">
            سجل الحصص المنعقدة والتقارير المرفوعة للمعلم المشرف
          </p>
        </div>

        <button
          onClick={onOpenNewSession}
          className="text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 hover:underline cursor-pointer"
        >
          + تسجيل جلسة جديدة
        </button>
      </div>

      {/* Carousel / Grid Horizontal scroll on mobile, 4-col on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {sessions.slice(0, 4).map((session) => (
          <div
            key={session.id}
            id={`session-card-${session.id}`}
            onClick={() => onViewSession(session)}
            className="group cursor-pointer bg-white/10 backdrop-blur-xl rounded-3xl border border-white/15 hover:border-amber-400/60 shadow-xl hover:bg-white/15 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1 text-right"
          >
            <div>
              {/* Portrait Image per template */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900/40">
                <img
                  src={session.imageUrl || 'https://images.mediadirhub.com/vibe/digital-calendar-showing-april-5-4-pm-with-math-symbols-in-background.png'}
                  alt={session.topic}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Status Badges */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span className="bg-slate-950/80 backdrop-blur-md text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-lg border border-white/15">
                    {session.subject}
                  </span>
                </div>

                {session.teacherFeedback?.isVerified ? (
                  <div className="absolute bottom-2.5 right-2.5 bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-md border border-emerald-400/30">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    <span>معتمدة من المعلم</span>
                  </div>
                ) : (
                  <div className="absolute bottom-2.5 right-2.5 bg-amber-500/90 backdrop-blur-md text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-md border border-amber-300/40">
                    <Clock className="w-3 h-3" />
                    <span>في انتظار المراجعة</span>
                  </div>
                )}
              </div>

              {/* Title & Description per template */}
              <div className="p-4">
                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                  جلسة {session.subject} مع {session.studentName}
                </h4>
                <p className="text-xs text-white/60 mb-2.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>تمت في {session.date}، الساعة {session.time}</span>
                </p>

                <p className="text-xs text-white/80 line-clamp-2 leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/10">
                  {session.topic}
                </p>

                {session.teacherFeedback?.rating && (
                  <div className="flex items-center gap-1.5 mt-3 text-amber-400 text-xs font-bold">
                    <div className="flex items-center">
                      {[...Array(session.teacherFeedback.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-white/70 text-[11px]">تقييم المشرف</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-3 bg-white/5 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>عرض التقرير</span>
              </span>

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  title="إرسال عبر واتساب"
                  onClick={() => ShareService.shareToWhatsApp(session)}
                  className="p-1.5 hover:bg-emerald-500/30 text-emerald-300 rounded-lg transition-colors border border-transparent hover:border-emerald-400/40"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
