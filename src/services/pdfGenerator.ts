import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TeachingSession, CertificateData } from '../types';

export const PdfGenerator = {
  // Direct clean browser print of a styled container
  printElement(elementId: string) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>طباعة تقرير المعلم الصغير</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Cairo', sans-serif; }
            body { background: #fff; color: #1e293b; padding: 24px; direction: rtl; }
            @media print {
              body { padding: 0; }
              @page { margin: 1.5cm; size: A4; }
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  },

  // Export element directly as high-resolution PDF download
  async downloadElementAsPdf(elementId: string, filename: string = 'almoallim_report.pdf'): Promise<boolean> {
    const element = document.getElementById(elementId);
    if (!element) return false;

    try {
      // Temporarily ensure high visibility
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
      return true;
    } catch (err) {
      console.error('PDF export error, falling back to print:', err);
      this.printElement(elementId);
      return false;
    }
  },

  // Generate downloadable standalone HTML report file
  downloadHtmlReport(session: TeachingSession) {
    const content = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تقرير حصة - ${session.studentName} - ${session.subject}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; background: #f8fafc; color: #1e293b; padding: 40px; }
    .container { max-width: 800px; margin: 0 auto; background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .header { text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; }
    .badge { display: inline-block; background: #fef3c7; color: #b45309; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 14px; margin-bottom: 8px; }
    .title { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
    .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; }
    .info-label { font-size: 12px; color: #64748b; margin-bottom: 2px; }
    .info-val { font-size: 15px; font-weight: 700; color: #0f172a; }
    .section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 20px; margin-bottom: 8px; border-right: 4px solid #f59e0b; padding-right: 8px; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; line-height: 1.7; font-size: 14px; margin-bottom: 16px; }
    .footer { margin-top: 32px; border-top: 1px dashed #cbd5e1; padding-top: 20px; display: flex; justify-content: space-between; align-items: center; }
    .signature { text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">برنامج تدريس الأقران المعتمد</span>
      <h1 class="title">تقرير إنجاز المعلم الصغير</h1>
      <p style="color: #64748b; font-size: 14px;">المعلم الصغير: ${session.juniorTeacherName || 'زيد الخالدي'}</p>
    </div>
    
    <div class="grid">
      <div class="info-card">
        <div class="info-label">اسم الطالب المتدرب</div>
        <div class="info-val">${session.studentName} (${session.studentGrade})</div>
      </div>
      <div class="info-card">
        <div class="info-label">المادة والموضوع</div>
        <div class="info-val">${session.subject} - ${session.topic}</div>
      </div>
      <div class="info-card">
        <div class="info-label">اليوم والتاريخ</div>
        <div class="info-val">${session.day} - ${session.date} (${session.time})</div>
      </div>
      <div class="info-card">
        <div class="info-label">مستوى الاستيعاب</div>
        <div class="info-val">${session.understandingLevel}</div>
      </div>
    </div>

    <div class="section-title">تقرير ما تم تدريسه ومجريات الجلسة</div>
    <div class="box">${session.lessonReport}</div>

    <div class="section-title">نقاط القوة والملاحظات</div>
    <div class="box">${session.strengthsObserved || 'استجابة وتفاعل ممتاز مع الأمثلة المطروحة.'}</div>

    <div class="section-title">الواجب المعطى وتوصية المعلم المشرف</div>
    <div class="box">
      <strong>الواجب:</strong> ${session.homeworkGiven || 'حل التمارين المقررة'}<br>
      <strong>توصية المعلم الصغير:</strong> ${session.recommendationsForTeacher || 'تشجيع الطالب في الحصة الصفية القادمة'}
    </div>

    ${session.teacherFeedback?.isVerified ? `
    <div class="section-title" style="border-right-color: #10b981;">اعتماد المعلم المشرف (${session.teacherFeedback.teacherName})</div>
    <div class="box" style="background: #ecfdf5; border-color: #a7f3d0; color: #065f46;">
      <strong>التقييم:</strong> ${'⭐'.repeat(session.teacherFeedback.rating)} (${session.teacherFeedback.rating}/5)<br>
      <strong>ملاحظات المشرف:</strong> ${session.teacherFeedback.notes}
      ${session.teacherFeedback.awardedBadge ? `<br><strong>الوسام الممنوح:</strong> ${session.teacherFeedback.awardedBadge}` : ''}
    </div>
    ` : ''}

    <div class="footer">
      <div class="signature">
        <div style="font-size: 13px; color: #64748b;">توقيع المعلم الصغير</div>
        <div style="font-weight: 700; margin-top: 6px;">${session.juniorTeacherName || 'زيد الخالدي'}</div>
      </div>
      <div style="text-align: center; color: #94a3b8; font-size: 12px;">
        منصة المعلم الصغير © ${new Date().getFullYear()}
      </div>
      <div class="signature">
        <div style="font-size: 13px; color: #64748b;">توقيع واعتماد المعلم المشرف</div>
        <div style="font-weight: 700; margin-top: 6px;">${session.teacherFeedback?.teacherName || 'أ. عبد الرحمن الشهري'}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `تقرير_${session.studentName}_${session.subject}_${session.date}.html`;
    link.click();
    URL.revokeObjectURL(url);
  },
};
