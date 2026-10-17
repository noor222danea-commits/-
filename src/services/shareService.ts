import { TeachingSession, ProgressReportItem } from '../types';

export const ShareService = {
  // Format teaching session report for WhatsApp
  formatSessionForWhatsApp(session: TeachingSession): string {
    const text = `🎓 *تقرير إنجاز حصة تدريس الأقران (برنامج المعلم الصغير)* 🎓
────────────────────
👤 *المعلم الصغير:* ${session.juniorTeacherName || 'زيد الخالدي'}
👨‍🎓 *اسم الطالب المتدرب:* ${session.studentName} (${session.studentGrade})
📚 *المادة:* ${session.subject}
📖 *الموضوع:* ${session.topic}
📅 *اليوم والتاريخ:* ${session.day} - ${session.date}
⏰ *الوقت والمدة:* ${session.time} (${session.durationMinutes} دقيقة)
────────────────────
📝 *تقرير ما تم تدريسه ومجريات الجلسة:*
${session.lessonReport}

🌟 *مستوى الاستيعاب والتقييم:*
${session.understandingLevel}

💪 *نقاط القوة والملاحظات الإيجابية:*
${session.strengthsObserved || 'تفاعل ممتاز وحرص على الفهم'}

🎯 *النقاط المستهدفة للتحسين:*
${session.areasToImprove || 'متابعة التمارين المستمرة'}

🏠 *الواجب المنزلي المعطى:*
${session.homeworkGiven || 'حل التمارين المحددة'}

💡 *توصية المعلم الصغير للأستاذ المشرف:*
${session.recommendationsForTeacher || 'يرجى تشجيع الطالب في الحصة الصفية القادمة'}
────────────────────
✨ _تم إنشاء هذا التقرير عبر منصة المعلم الصغير الذكية_`;

    return text;
  },

  // Open WhatsApp with text
  shareToWhatsApp(session: TeachingSession, phoneNumber?: string) {
    const message = this.formatSessionForWhatsApp(session);
    const encoded = encodeURIComponent(message);
    const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, '') : '';
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  },

  // Open Telegram with text
  shareToTelegram(session: TeachingSession) {
    const message = this.formatSessionForWhatsApp(session);
    const encoded = encodeURIComponent(message);
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encoded}`;
    window.open(url, '_blank');
  },

  // Native Web Share if available, else copy to clipboard
  async shareNative(session: TeachingSession): Promise<{ success: boolean; method: 'native' | 'clipboard' }> {
    const text = this.formatSessionForWhatsApp(session);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `تقرير المعلم الصغير - ${session.studentName}`,
          text,
        });
        return { success: true, method: 'native' };
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      return { success: true, method: 'clipboard' };
    } catch {
      return { success: false, method: 'clipboard' };
    }
  },

  // Share generic report item
  shareReportWhatsApp(report: ProgressReportItem, teacherPhone?: string) {
    const text = `📄 *تقرير تقدم الطالب - برنامج المعلم الصغير*
────────────────────
👤 *الطالب:* ${report.studentName}
📚 *المادة:* ${report.subject}
📖 *الموضوع:* ${report.topic}
📅 *التاريخ:* ${report.date}
📊 *نسبة الإتقان:* ${report.understandingScore}%
────────────────────
📝 *ملخص الأداء:*
${report.detailedContent || report.summary}
────────────────────
✨ _منصة المعلم الصغير لتدريس الأقران_`;

    const encoded = encodeURIComponent(text);
    const cleanPhone = teacherPhone ? teacherPhone.replace(/[^0-9]/g, '') : '';
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  },

  shareReportTelegram(report: ProgressReportItem) {
    const text = `📄 *تقرير تقدم الطالب - برنامج المعلم الصغير*
👤 الطالب: ${report.studentName}
📚 المادة: ${report.subject} | الموضوع: ${report.topic}
📊 نسبة الإتقان: ${report.understandingScore}%
📝 ${report.summary}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  },
};
