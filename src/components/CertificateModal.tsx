import React, { useRef } from 'react';
import { Award, Printer, Download, Sparkles, X, CheckCircle } from 'lucide-react';
import { CertificateData } from '../types';

interface CertificateModalProps {
  certificate: CertificateData | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200 text-right text-white">
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-black text-white font-['Tajawal',sans-serif]">
              شهادة شكر وتقدير رسمية
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة 🖨️</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Golden Border Sheet */}
        <div
          ref={certRef}
          className="relative bg-gradient-to-b from-amber-50/90 via-white to-amber-50/80 text-slate-900 p-8 sm:p-12 rounded-3xl border-8 border-double border-amber-400 text-center space-y-6 shadow-2xl print:border-amber-600 print:m-0"
        >
          {/* Header */}
          <div>
            <div className="text-xs font-bold text-slate-500 mb-1">
              المملكة العربية السعودية • {certificate.schoolName}
            </div>
            <div className="text-xs font-bold text-amber-700 tracking-wider">
              مبادرة التميز الطلابي (المعلم الصغير)
            </div>
          </div>

          {/* Golden Badge Emblem */}
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 ring-8 ring-amber-200">
            <Award className="w-10 h-10 text-amber-950" />
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Tajawal',sans-serif]">
              شهادة شكر وتقدير
            </h2>
            <div className="text-sm font-bold text-amber-700 mt-1">
              {certificate.title}
            </div>
          </div>

          {/* Recipient */}
          <div className="py-2">
            <p className="text-xs text-slate-500 mb-2">تُمنح هذه الشهادة والوسام بكل فخر واعتزاز إلى:</p>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 border-b-2 border-dashed border-amber-400 inline-block px-8 pb-2">
              {certificate.recipientName}
            </div>
            <div className="text-xs font-bold text-amber-800 mt-2">({certificate.recipientRole})</div>
          </div>

          {/* Reason */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-lg mx-auto">
            {certificate.reason}
          </p>

          {/* Signatures */}
          <div className="grid grid-cols-2 pt-6 border-t border-amber-200 text-xs">
            <div>
              <div className="text-slate-500 mb-4">المعلم المشرف:</div>
              <div className="font-black text-slate-900">{certificate.mentorTeacherName}</div>
            </div>
            <div>
              <div className="text-slate-500 mb-4">تاريخ الإصدار:</div>
              <div className="font-black text-slate-900">{certificate.issuedDate}</div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
