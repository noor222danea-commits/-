import React, { useState } from 'react';
import { Share2, MessageCircle, Send, FileDown, Sparkles, Check, Phone } from 'lucide-react';
import { TeachingSession, JuniorTeacherProfile } from '../types';
import { ShareService } from '../services/shareService';
import { PdfGenerator } from '../services/pdfGenerator';

interface SendReportBannerProps {
  latestSession?: TeachingSession;
  profile: JuniorTeacherProfile;
  onOpenReportGenerator: () => void;
}

export const SendReportBanner: React.FC<SendReportBannerProps> = ({
  latestSession,
  profile,
  onOpenReportGenerator,
}) => {
  const [copied, setCopied] = useState(false);
  const [targetPhone, setTargetPhone] = useState(profile.mentorTeacherPhone || '+966501234567');

  const handleShareWhatsApp = () => {
    if (latestSession) {
      ShareService.shareToWhatsApp(latestSession, targetPhone);
    } else {
      onOpenReportGenerator();
    }
  };

  const handleShareTelegram = () => {
    if (latestSession) {
      ShareService.shareToTelegram(latestSession);
    } else {
      onOpenReportGenerator();
    }
  };

  const handleCopyText = async () => {
    if (latestSession) {
      const res = await ShareService.shareNative(latestSession);
      if (res.success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } else {
      onOpenReportGenerator();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-2xl text-white shadow-2xl border border-white/20 my-10">
      {/* Background Graphic elements and luminous blurs */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Banner Image */}
        <div className="lg:col-span-4 h-52 sm:h-64 lg:h-full relative overflow-hidden flex items-center justify-center bg-slate-950/40">
          <img
            src="https://images.mediadirhub.com/vibe/smartphone-screen-showing-send-report-as-pdf-button-with-whatsapp-and-telegram-icons.png"
            alt="إرسال التقرير كـ PDF"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Banner Content & Actions */}
        <div className="lg:col-span-8 p-6 sm:p-8 text-right">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-amber-300 border border-white/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>نظام الإرسال الفوري المعتمد</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white font-['Tajawal',sans-serif] mb-2">
            إرسال التقرير كـ PDF
          </h3>

          <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-xl mb-5">
            اضغط لإنشاء وتوزيع تقرير مفصل عبر واتساب أو تليجرام إلى الأستاذ المشرف ({profile.mentorTeacherName}) أو أولياء الأمور بضغطة زر واحدة.
          </p>

          {/* Teacher Phone recipient input */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 max-w-lg mb-5">
            <div className="flex items-center gap-2 mb-2 text-xs text-white/80">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>هاتف المعلم المشرف المستلم:</span>
              <strong className="text-white font-bold">{profile.mentorTeacherName}</strong>
            </div>
            <input
              type="text"
              dir="ltr"
              value={targetPhone}
              onChange={(e) => setTargetPhone(e.target.value)}
              placeholder="+966501234567"
              className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="banner-btn-whatsapp"
              onClick={handleShareWhatsApp}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/30"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>إرسال عبر واتساب فوراً</span>
            </button>

            <button
              id="banner-btn-telegram"
              onClick={handleShareTelegram}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-900/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-sky-400/30"
            >
              <Send className="w-4 h-4 text-white" />
              <span>إرسال عبر تليجرام</span>
            </button>

            <button
              id="banner-btn-generate-pdf"
              onClick={onOpenReportGenerator}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-amber-300" />
              <span>معاينة وتنزيل PDF</span>
            </button>

            <button
              onClick={handleCopyText}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 cursor-pointer backdrop-blur-md"
              title="نسخ التقرير للحافظة"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
