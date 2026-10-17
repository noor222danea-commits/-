import React, { useState } from 'react';
import { Sparkles, BookOpen, HelpCircle, Loader2, Copy, Check, X, FileText } from 'lucide-react';
import { GeminiService } from '../services/gemini';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'quiz' | 'tips'>('plan');
  const [subject, setSubject] = useState('الرياضيات');
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('المرحلة المتوسطة');
  const [customPrompt, setCustomPrompt] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('الرجاء إدخال موضوع الدرس المراد تحضيره');
      return;
    }

    setLoading(true);
    setResult('');
    try {
      const actionMap = {
        plan: 'lesson_plan',
        quiz: 'generate_quiz',
        tips: 'pedagogical_tips',
      } as const;

      const res = await GeminiService.callAssist({
        action: actionMap[activeTab],
        subject,
        topic: topic.trim(),
        gradeLevel,
        prompt: customPrompt,
      });

      setResult(res.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200 text-right text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/30 border border-purple-400/40 text-purple-200 flex items-center justify-center shadow-lg shadow-purple-500/20 backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-['Tajawal',sans-serif]">
                المساعد التربوي الذكي للمعلم الصغير
              </h3>
              <p className="text-xs text-white/70">
                تحضير الحصص، توليد الأسئلة والاختبارات، وتقديم نصائح الشرح الفعالة
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

        {/* Tab Selection */}
        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl mb-5 border border-white/10">
          <button
            onClick={() => setActiveTab('plan')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'plan' ? 'bg-purple-600 text-white shadow-md' : 'text-white/70 hover:text-white'
            }`}
          >
            خطة شرح وتدريس 📋
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'quiz' ? 'bg-purple-600 text-white shadow-md' : 'text-white/70 hover:text-white'
            }`}
          >
            بنك أسئلة وتطبيق ❓
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'tips' ? 'bg-purple-600 text-white shadow-md' : 'text-white/70 hover:text-white'
            }`}
          >
            نصائح واستراتيجيات 💡
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3.5 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">المادة الدراسية:</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs sm:text-sm bg-slate-800 text-white"
              >
                <option value="الرياضيات" className="bg-slate-800 text-white">الرياضيات</option>
                <option value="العلوم" className="bg-slate-800 text-white">العلوم</option>
                <option value="اللغة الإنجليزية" className="bg-slate-800 text-white">اللغة الإنجليزية</option>
                <option value="اللغة العربية" className="bg-slate-800 text-white">اللغة العربية</option>
                <option value="الفيزياء" className="bg-slate-800 text-white">الفيزياء</option>
                <option value="الكيمياء" className="bg-slate-800 text-white">الكيمياء</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">المرحلة الدراسية:</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs sm:text-sm bg-slate-800 text-white"
              >
                <option value="المرحلة الابتدائية" className="bg-slate-800 text-white">المرحلة الابتدائية</option>
                <option value="المرحلة المتوسطة" className="bg-slate-800 text-white">المرحلة المتوسطة</option>
                <option value="المرحلة الثانوية" className="bg-slate-800 text-white">المرحلة الثانوية</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/80 mb-1">موضوع الدرس أو المفهوم المراد تدريسه:</label>
            <input
              type="text"
              required
              placeholder="مثال: شرح قانون نيوتن الأول للحركة مع أمثلة حياتية"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 text-xs sm:text-sm bg-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <button
            id="btn-generate-ai-plan"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-purple-400/30"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جارٍ التوليد الذكي بواسطة Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>توليد المحتوى التربوي الآن ✨</span>
              </>
            )}
          </button>
        </div>

        {/* Results Area */}
        {result && (
          <div className="bg-purple-500/15 backdrop-blur-md p-4 rounded-2xl border border-purple-400/30 text-right space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>المخرجات المقترحة للمعلم الصغير:</span>
              </span>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-bold text-white bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-xl border border-white/20 shadow-sm cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
              </button>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs sm:text-sm text-white/90 leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
