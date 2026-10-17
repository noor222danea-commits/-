export interface GeminiAssistParams {
  action: 'polish_report' | 'generate_quiz' | 'lesson_plan' | 'pedagogical_tips';
  studentName?: string;
  subject?: string;
  topic?: string;
  gradeLevel?: string;
  currentDraft?: string;
  prompt?: string;
}

export interface GeminiAssistResponse {
  success: boolean;
  isFallback: boolean;
  content: string;
  errorNote?: string;
}

export const GeminiService = {
  async callAssist(params: GeminiAssistParams): Promise<GeminiAssistResponse> {
    try {
      const response = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      console.warn('Backend API request failed, using intelligent client fallback:', err);
      return {
        success: true,
        isFallback: true,
        content: this.getLocalFallback(params),
      };
    }
  },

  getLocalFallback(params: GeminiAssistParams): string {
    const { action, studentName, subject, topic, currentDraft } = params;

    if (action === 'polish_report') {
      return `📋 تقرير حصة تدريس الأقران (المعلم الصغير)
───────────────
🔹 الموضوع: ${topic || 'مراجعة المفاهيم وحل التدريبات'} (${subject || 'المادة'})
🔹 الطالب: ${studentName || 'زميل الصف'}

✅ ما تم إنجازه:
${currentDraft || 'تم شرح النقاط الجوهرية للدرس وتطبيق المسائل خطوة بخطوة مع التأكد من إتقان القواعد الأساسية.'}

🎯 الملاحظات ومستوى الفهم:
أظهر الطالب انتباهاً ممتازاً وسرعة استجابة مع حل المسائل التطبيقية بشكل مستقل.

💡 توصيات للأستاذ المشرف:
تعزيز ثقة الطالب والمتابعة المستمرة للتأكد من تثبيت المفاهيم.`;
    }

    if (action === 'generate_quiz') {
      return `✨ بنك الأسئلة السريع لموضوع (${topic || subject || 'الدرس'}):
1. سؤال مباشر: ما هي الخطوة الأولى لتطبيق القاعدة المشروحة؟
2. سؤال تطبيقي: اذكر مثالاً حياً يوضح أهمية هذا المفهوم.
3. سؤال تفكير: كيف نتحقق من صحة الإجابة بعد الانتهاء من الحل؟`;
    }

    return `💡 خطة المعلم الصغير:
- التهيئة والترحيب (3 دقائق)
- شرح الفكرة الرئيسية بالأمثلة (15 دقيقة)
- تدريب عملي مشترك وحل أسئلة (15 دقيقة)
- تلخيص ختامي وتقييم سريع (7 دقائق)`;
  },
};
