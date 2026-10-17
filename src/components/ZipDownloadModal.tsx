import React, { useState } from 'react';
import { Download, Check, Sparkles, FolderArchive, Terminal, X, Loader2 } from 'lucide-react';
import { ZipExporter } from '../services/zipExporter';

interface ZipDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZipDownloadModal: React.FC<ZipDownloadModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await ZipExporter.generateAndDownloadProjectZip();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200 text-right text-white">
        <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-['Tajawal',sans-serif]">
                تصدير وتنزيل المشروع كاملاً (ZIP)
              </h3>
              <p className="text-xs text-white/70">حزمة كاملة لبرنامج المعلم الصغير مع كافة المكونات والملفات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6 text-xs sm:text-sm text-white/80 leading-relaxed">
          <div className="bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
            <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>محتويات ملف الـ ZIP المضغوط:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-white/90 text-xs mr-2">
              <li>كافة ملفات التطبيق (React + TypeScript + Vite + Tailwind CSS)</li>
              <li>خادم Express مع ربط الذكاء الاصطناعي (Gemini API)</li>
              <li>مولد ومحرر تقارير الـ PDF ونظام المشاركة عبر واتساب وتليجرام</li>
              <li>لوحة الطالب ولوحة الأستاذ المشرف المتزامنة</li>
              <li>ملف التعليمات README.md لطريقة التشغيل بنقرة واحدة</li>
            </ul>
          </div>

          <div className="bg-black/50 text-emerald-300 p-4 rounded-2xl font-mono text-xs text-left border border-white/10 shadow-inner" dir="ltr">
            <div className="text-white/50 mb-1"># خطوات التشغيل على جهازك:</div>
            <div>unzip almoallim-alsaghir-full-project.zip</div>
            <div>cd almoallim-alsaghir</div>
            <div>npm install</div>
            <div>npm run dev</div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/15">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 cursor-pointer transition-colors"
          >
            إغلاق
          </button>

          <button
            id="btn-confirm-zip-download"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all cursor-pointer disabled:opacity-50 border border-amber-300/40"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جارٍ تجهيز ملف الـ ZIP...</span>
              </>
            ) : downloaded ? (
              <>
                <Check className="w-4 h-4 text-slate-950 font-bold" />
                <span>تم بدء التنزيل بنجاح!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>تنزيل ملف الـ ZIP الآن 📦</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
