import React from 'react';
import { FileText, Download, Send, MessageCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { ProgressReportItem } from '../types';
import { ShareService } from '../services/shareService';

interface ProgressReportsProps {
  reports: ProgressReportItem[];
  onSelectReport: (report: ProgressReportItem) => void;
}

export const ProgressReports: React.FC<ProgressReportsProps> = ({
  reports,
  onSelectReport,
}) => {
  return (
    <section className="mt-10 mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 font-['Tajawal',sans-serif]">
            <span>تقارير التقدم</span>
            <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 backdrop-blur-md">
              {reports.length} تقرير
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-white/70 mt-0.5">
            ملخصات الإنجاز الأكاديمي وتقييمات الفهم الموثقة والمعدة للإرسال
          </p>
        </div>
      </div>

      {/* Vertical List with Landscape Images matching template */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            id={`progress-report-item-${report.id}`}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/15 hover:border-amber-400/60 p-4 sm:p-5 shadow-xl hover:bg-white/15 transition-all duration-300 flex flex-col sm:flex-row items-center gap-4 group"
          >
            {/* Landscape Thumbnail per template */}
            <div className="relative w-full sm:w-36 h-28 shrink-0 rounded-2xl overflow-hidden bg-slate-900/40 border border-white/15">
              <img
                src={report.imageUrl}
                alt={report.studentName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-1.5 right-1.5 bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/15 shadow">
                {report.subject}
              </div>
              {report.teacherVerified && (
                <div className="absolute bottom-1.5 right-1.5 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 border border-emerald-400/30">
                  <CheckCircle className="w-2.5 h-2.5" />
                  <span>معتمد</span>
                </div>
              )}
            </div>

            {/* Text Content */}
            <div className="flex-1 text-right w-full">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  تقرير تقدم {report.studentName}
                </h4>
                <span className="text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-400/30">
                  {report.understandingScore}% إتقان
                </span>
              </div>

              <p className="text-xs text-white/70 line-clamp-2 leading-relaxed mb-3">
                {report.summary}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10">
                <button
                  onClick={() => onSelectReport(report)}
                  className="text-xs font-bold text-white/80 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>معاينة التقرير كامل</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-share-whatsapp-${report.id}`}
                    onClick={() => ShareService.shareReportWhatsApp(report)}
                    className="px-2.5 py-1 bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-emerald-500/30 cursor-pointer"
                    title="إرسال إلى واتساب"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="hidden sm:inline text-[11px]">واتساب</span>
                  </button>

                  <button
                    id={`btn-share-telegram-${report.id}`}
                    onClick={() => ShareService.shareReportTelegram(report)}
                    className="px-2.5 py-1 bg-sky-500/25 hover:bg-sky-500/40 text-sky-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-sky-500/30 cursor-pointer"
                    title="إرسال إلى تليجرام"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-300" />
                    <span className="hidden sm:inline text-[11px]">تليجرام</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
