import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Send, 
  Plus, 
  CheckCircle, 
  Trash2, 
  Clock, 
  MapPin, 
  Sparkles, 
  X,
  MessageCircle,
  Award
} from 'lucide-react';
import { NotebookNote, TimetableSlot, TeachingSession, Student } from '../types';
import { StorageService } from '../services/storage';
import { ShareService } from '../services/shareService';
import { PdfGenerator } from '../services/pdfGenerator';

interface TeachingToolsProps {
  notes: NotebookNote[];
  timetable: TimetableSlot[];
  sessions: TeachingSession[];
  students: Student[];
  onOpenNewSession: () => void;
  onOpenReportGenerator: () => void;
}

export const TeachingTools: React.FC<TeachingToolsProps> = ({
  notes,
  timetable,
  sessions,
  students,
  onOpenNewSession,
  onOpenReportGenerator,
}) => {
  const [activeToolModal, setActiveToolModal] = useState<
    'none' | 'notebook' | 'timetable' | 'pdf_generator' | 'file_sender'
  >('none');

  // Notebook state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('الرياضيات');
  const [noteContent, setNoteContent] = useState('');

  // Timetable state
  const [slotDay, setSlotDay] = useState('الأحد');
  const [slotTime, setSlotTime] = useState('04:00 م - 04:45 م');
  const [slotStudent, setSlotStudent] = useState(students[0]?.name || 'أحمد محمد');
  const [slotSubject, setSlotSubject] = useState('الرياضيات');
  const [slotTopic, setSlotTopic] = useState('');
  const [slotLocation, setSlotLocation] = useState('غرفة الأنشطة الطلابية');

  // File sender state
  const [selectedSessionForSend, setSelectedSessionForSend] = useState<string>(sessions[0]?.id || '');
  const [customPhone, setCustomPhone] = useState('+966501234567');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    StorageService.addNote({
      title: noteTitle.trim(),
      subject: noteSubject,
      content: noteContent.trim(),
      tags: ['ملاحظة تدريس', noteSubject],
    });

    setNoteTitle('');
    setNoteContent('');
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotTopic.trim()) return;

    StorageService.addTimetableSlot({
      day: slotDay,
      time: slotTime,
      studentName: slotStudent,
      subject: slotSubject,
      topic: slotTopic.trim(),
      locationOrLink: slotLocation || 'قاعة التعلم الذاتي',
    });

    setSlotTopic('');
  };

  const currentSendSession = sessions.find((s) => s.id === selectedSessionForSend) || sessions[0];

  return (
    <section className="mt-10 mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 font-['Tajawal',sans-serif]">
            <span>أدوات التدريس</span>
            <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 backdrop-blur-md">
              أدوات تفاعلية
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-white/70 mt-0.5">
            حقيبة أدوات المعلم الصغير لإدارة وتنسيق وإرسال الحصص والتقارير
          </p>
        </div>
      </div>

      {/* Circle Cards Gallery matching prompt templates */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {/* Tool 1: دفتر الملاحظات */}
        <div
          id="tool-card-notebook"
          onClick={() => setActiveToolModal('notebook')}
          className="group cursor-pointer bg-white/10 backdrop-blur-xl rounded-3xl border border-white/15 hover:border-amber-400/60 p-5 shadow-xl hover:bg-white/15 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden bg-amber-400/20 p-1 mb-3 border-2 border-amber-400/40 group-hover:scale-110 transition-transform shadow-inner backdrop-blur-md">
            <img
              src="https://images.mediadirhub.com/vibe/simple-digital-notebook-icon-with-lines-and-pencil-on-light-background.png"
              alt="دفتر الملاحظات"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-1">
            دفتر الملاحظات
          </h4>
          <p className="text-xs text-white/70 line-clamp-2">
            أداة تدوين الملاحظات واستراتيجيات الشرح الرقمية
          </p>
          <span className="mt-3 text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/30">
            {notes.length} ملاحظات محفوظة
          </span>
        </div>

        {/* Tool 2: جدول الدروس */}
        <div
          id="tool-card-timetable"
          onClick={() => setActiveToolModal('timetable')}
          className="group cursor-pointer bg-white/10 backdrop-blur-xl rounded-3xl border border-white/15 hover:border-sky-400/60 p-5 shadow-xl hover:bg-white/15 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden bg-sky-400/20 p-1 mb-3 border-2 border-sky-400/40 group-hover:scale-110 transition-transform shadow-inner backdrop-blur-md">
            <img
              src="https://images.mediadirhub.com/vibe/minimalist-calendar-icon-with-weekly-lesson-blocks.png"
              alt="جدول الدروس"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors mb-1">
            جدول الدروس
          </h4>
          <p className="text-xs text-white/70 line-clamp-2">
            تقويم جدولة الدروس والمواعيد الأسبوعية
          </p>
          <span className="mt-3 text-[11px] font-bold text-sky-300 bg-sky-400/20 px-2.5 py-1 rounded-full border border-sky-400/30">
            {timetable.length} مواعيد مجدولة
          </span>
        </div>

        {/* Tool 3: منشئ التقارير */}
        <div
          id="tool-card-report-generator"
          onClick={onOpenReportGenerator}
          className="group cursor-pointer bg-white/10 backdrop-blur-xl rounded-3xl border border-white/15 hover:border-purple-400/60 p-5 shadow-xl hover:bg-white/15 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden bg-purple-400/20 p-1 mb-3 border-2 border-purple-400/40 group-hover:scale-110 transition-transform shadow-inner backdrop-blur-md">
            <img
              src="https://images.mediadirhub.com/vibe/icon-of-a-document-with-a-plus-sign-and-pencil-symbolizing-creation.png"
              alt="منشئ التقارير"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
            منشئ التقارير
          </h4>
          <p className="text-xs text-white/70 line-clamp-2">
            مولد تقارير PDF الرسمية ومعاينتها قبل الإرسال
          </p>
          <span className="mt-3 text-[11px] font-bold text-purple-300 bg-purple-400/20 px-2.5 py-1 rounded-full border border-purple-400/30">
            إنشاء وطباعة PDF
          </span>
        </div>

        {/* Tool 4: مرسل الملفات */}
        <div
          id="tool-card-file-sender"
          onClick={() => setActiveToolModal('file_sender')}
          className="group cursor-pointer bg-white/10 backdrop-blur-xl rounded-3xl border border-white/15 hover:border-emerald-400/60 p-5 shadow-xl hover:bg-white/15 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden bg-emerald-400/20 p-1 mb-3 border-2 border-emerald-400/40 group-hover:scale-110 transition-transform shadow-inner backdrop-blur-md">
            <img
              src="https://images.mediadirhub.com/vibe/icon-of-a-paper-airplane-with-two-messaging-app-logos-beside-it.png"
              alt="مرسل الملفات"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-1">
            مرسل الملفات
          </h4>
          <p className="text-xs text-white/70 line-clamp-2">
            مرسل ملفات وتقارير مباشرة لواتساب وتليجرام
          </p>
          <span className="mt-3 text-[11px] font-bold text-emerald-300 bg-emerald-400/20 px-2.5 py-1 rounded-full border border-emerald-400/30">
            إرسال فوري
          </span>
        </div>
      </div>

      {/* Modal: Digital Notebook */}
      {activeToolModal === 'notebook' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-white/20 text-white animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">دفتر ملاحظات المعلم الصغير</h4>
                  <p className="text-xs text-white/70">تدوين استراتيجيات التدريس والملاحظات التربوية للطلاب</p>
                </div>
              </div>
              <button
                onClick={() => setActiveToolModal('none')}
                className="w-8 h-8 rounded-full hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </div>

            {/* Add note form */}
            <form onSubmit={handleAddNote} className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/15 mb-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    placeholder="عنوان الملاحظة (مثال: أفكار لشرح درس الكسور)"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white/10 text-white placeholder-white/40"
                  />
                </div>
                <div>
                  <select
                    value={noteSubject}
                    onChange={(e) => setNoteSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none bg-slate-800 text-white"
                  >
                    <option value="الرياضيات">الرياضيات</option>
                    <option value="العلوم">العلوم</option>
                    <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                    <option value="اللغة العربية والقراءة">اللغة العربية</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={3}
                required
                placeholder="اكتب الأفكار والخطوات أو الأسئلة التحفيزية هنا..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white/10 text-white placeholder-white/40 resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>حفظ الملاحظة</span>
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-white/80">الملاحظات المحفوظة:</h5>
              {notes.map((note) => (
                <div key={note.id} className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <h6 className="text-sm font-bold text-white">{note.title}</h6>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-lg font-bold">
                      {note.subject}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 whitespace-pre-line leading-relaxed mb-2">
                    {note.content}
                  </p>
                  <div className="text-[10px] text-white/50">
                    تاريخ التدوين: {note.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Timetable */}
      {activeToolModal === 'timetable' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-white/20 text-white animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-400/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">جدول مواعيد الحصص والدروس</h4>
                  <p className="text-xs text-white/70">تنظيم مواعيد تدريس الأقران الأسبوعية ومتابعة إنجازها</p>
                </div>
              </div>
              <button
                onClick={() => setActiveToolModal('none')}
                className="w-8 h-8 rounded-full hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </div>

            {/* Add timetable slot */}
            <form onSubmit={handleAddSlot} className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/15 mb-5 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-white/80 mb-1">اليوم</label>
                  <select
                    value={slotDay}
                    onChange={(e) => setSlotDay(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/20 text-xs bg-slate-800 text-white"
                  >
                    <option value="الأحد">الأحد</option>
                    <option value="الإثنين">الإثنين</option>
                    <option value="الثلاثاء">الثلاثاء</option>
                    <option value="الأربعاء">الأربعاء</option>
                    <option value="الخميس">الخميس</option>
                    <option value="الجمعة">الجمعة</option>
                    <option value="السبت">السبت</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/80 mb-1">الوقت</label>
                  <input
                    type="text"
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    placeholder="04:00 م"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/20 text-xs bg-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/80 mb-1">الطالب</label>
                  <select
                    value={slotStudent}
                    onChange={(e) => setSlotStudent(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/20 text-xs bg-slate-800 text-white"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.name}>{st.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/80 mb-1">المادة</label>
                  <select
                    value={slotSubject}
                    onChange={(e) => setSlotSubject(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/20 text-xs bg-slate-800 text-white"
                  >
                    <option value="الرياضيات">الرياضيات</option>
                    <option value="العلوم">العلوم</option>
                    <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                    <option value="اللغة العربية">اللغة العربية</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="موضوع الدرس (مثال: جمع الكسور)"
                  value={slotTopic}
                  onChange={(e) => setSlotTopic(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-white/20 text-xs bg-white/10 text-white placeholder-white/40"
                />
                <input
                  type="text"
                  placeholder="المكان (مثال: قاعة التعلم الذاتي)"
                  value={slotLocation}
                  onChange={(e) => setSlotLocation(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-white/20 text-xs bg-white/10 text-white placeholder-white/40"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة للجدول</span>
                </button>
              </div>
            </form>

            {/* Timetable slots */}
            <div className="space-y-2.5">
              {timetable.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    slot.isCompleted ? 'bg-white/5 border-white/10 opacity-50' : 'bg-white/10 backdrop-blur-md border-white/15 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => StorageService.toggleSlotComplete(slot.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
                        slot.isCompleted ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-white/30 hover:border-emerald-400'
                      }`}
                    >
                      {slot.isCompleted && <CheckCircle className="w-4 h-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{slot.day} ({slot.time})</span>
                        <span className="text-[10px] bg-sky-400/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-lg font-bold">{slot.subject}</span>
                      </div>
                      <p className="text-xs text-white/80 mt-0.5">
                        مع الطالب: <strong className="text-white">{slot.studentName}</strong> • {slot.topic}
                      </p>
                      <p className="text-[10px] text-white/50 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{slot.locationOrLink}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveToolModal('none');
                      onOpenNewSession();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow"
                  >
                    بدء الحصة
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Instant File / Message Sender */}
      {activeToolModal === 'file_sender' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/20 text-white animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">مرسل ملفات وتقارير المعلم الصغير</h4>
                  <p className="text-xs text-white/70">إرسال فوري ومباشر إلى واتساب وتليجرام</p>
                </div>
              </div>
              <button
                onClick={() => setActiveToolModal('none')}
                className="w-8 h-8 rounded-full hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">اختر جلسة التدريس المنجزة:</label>
                <select
                  value={selectedSessionForSend}
                  onChange={(e) => setSelectedSessionForSend(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/20 text-sm bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {sessions.map((sess) => (
                    <option key={sess.id} value={sess.id}>
                      {sess.studentName} - {sess.subject} ({sess.date})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">رقم هاتف المستلم (المعلم المشرف أو ولي الأمر):</label>
                <input
                  type="text"
                  dir="ltr"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="+966501234567"
                  className="w-full px-3 py-2.5 rounded-xl border border-white/20 text-sm bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {currentSendSession && (
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-xs space-y-1.5">
                  <div className="font-bold text-amber-300">معاينة الرسالة الصادرة:</div>
                  <p className="text-white/80 line-clamp-3 leading-relaxed">
                    {ShareService.formatSessionForWhatsApp(currentSendSession)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="modal-dispatch-whatsapp"
                  onClick={() => {
                    if (currentSendSession) {
                      ShareService.shareToWhatsApp(currentSendSession, customPhone);
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer border border-emerald-400/30"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>إرسال واتساب</span>
                </button>

                <button
                  id="modal-dispatch-telegram"
                  onClick={() => {
                    if (currentSendSession) {
                      ShareService.shareToTelegram(currentSendSession);
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer border border-sky-400/30"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>إرسال تليجرام</span>
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => {
                    if (currentSendSession) {
                      PdfGenerator.downloadHtmlReport(currentSendSession);
                    }
                  }}
                  className="text-xs text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer"
                >
                  أو قم بتنزيل ملف التقرير المستقل (HTML / PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
