import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { StudentCards } from './components/StudentCards';
import { RecentSessions } from './components/RecentSessions';
import { ProgressReports } from './components/ProgressReports';
import { SendReportBanner } from './components/SendReportBanner';
import { TeachingTools } from './components/TeachingTools';
import { TeacherDashboard } from './components/TeacherDashboard';

import { NewSessionModal } from './components/NewSessionModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ZipDownloadModal } from './components/ZipDownloadModal';
import { CertificateModal } from './components/CertificateModal';

import { StorageService } from './services/storage';
import { Student, TeachingSession, ProgressReportItem, CertificateData } from './types';
import { BookOpen, Sparkles, GraduationCap, Download, Heart } from 'lucide-react';

export function App() {
  const [data, setData] = useState(StorageService.getData());
  const [activeTab, setActiveTab] = useState<'student_view' | 'teacher_view'>('student_view');

  // Modals state
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [showAiAssistantModal, setShowAiAssistantModal] = useState(false);
  const [showZipModal, setShowZipModal] = useState(false);
  const [selectedSessionForDetail, setSelectedSessionForDetail] = useState<TeachingSession | null>(null);
  const [selectedStudentForSession, setSelectedStudentForSession] = useState<Student | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);

  // Subscribe to storage updates
  useEffect(() => {
    const unsubscribe = StorageService.subscribe((updated) => {
      setData(updated);
    });
    return unsubscribe;
  }, []);

  const pendingReviewsCount = data.sessions.filter((s) => !s.teacherFeedback?.isVerified).length;

  const handleStartSessionForStudent = (student: Student) => {
    setSelectedStudentForSession(student);
    setShowNewSessionModal(true);
  };

  const handleOpenGeneralNewSession = () => {
    setSelectedStudentForSession(null);
    setShowNewSessionModal(true);
  };

  const handleSelectProgressReport = (report: ProgressReportItem) => {
    // Find matching session if available, or construct temporary session for modal
    const matchingSession = data.sessions.find(
      (s) => s.studentName === report.studentName && s.subject === report.subject
    ) || data.sessions[0];

    setSelectedSessionForDetail(matchingSession);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden text-white font-['Cairo',sans-serif] selection:bg-amber-400 selection:text-slate-950" dir="rtl">
      {/* Background Glowing Ambient Orbs */}
      <div className="fixed top-[-100px] left-[-100px] w-[480px] h-[480px] rounded-full bg-amber-500/20 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-100px] right-[10%] w-[450px] h-[450px] rounded-full bg-pink-500/20 blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[-100px] w-[400px] h-[400px] rounded-full bg-indigo-400/20 blur-[120px] pointer-events-none z-0" />

      {/* Top Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewSession={handleOpenGeneralNewSession}
        onOpenAiAssistant={() => setShowAiAssistantModal(true)}
        onOpenZipModal={() => setShowZipModal(true)}
        profile={data.profile}
        pendingReviewsCount={pendingReviewsCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {activeTab === 'student_view' ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Hero Section per template */}
            <HeroBanner
              onStartSession={handleOpenGeneralNewSession}
              profile={data.profile}
              students={data.students}
              sessions={data.sessions}
            />

            {/* Students Grid Section */}
            <StudentCards
              students={data.students}
              onSelectStudentForSession={handleStartSessionForStudent}
              onAddStudent={(newSt) => StorageService.addStudent(newSt)}
            />

            {/* Recent Sessions Carousel Section */}
            <RecentSessions
              sessions={data.sessions}
              onViewSession={(session) => setSelectedSessionForDetail(session)}
              onOpenNewSession={handleOpenGeneralNewSession}
            />

            {/* Progress Reports Section */}
            <ProgressReports
              reports={data.progressReports}
              onSelectReport={handleSelectProgressReport}
            />

            {/* PDF & Social Dispatch Banner Section */}
            <SendReportBanner
              latestSession={data.sessions[0]}
              profile={data.profile}
              onOpenReportGenerator={() => setSelectedSessionForDetail(data.sessions[0] || null)}
            />

            {/* Teaching Interactive Tools Suite */}
            <TeachingTools
              notes={data.notes}
              timetable={data.timetable}
              sessions={data.sessions}
              students={data.students}
              onOpenNewSession={handleOpenGeneralNewSession}
              onOpenReportGenerator={() => setSelectedSessionForDetail(data.sessions[0] || null)}
            />
          </div>
        ) : (
          /* Teacher Dashboard View */
          <TeacherDashboard
            sessions={data.sessions}
            students={data.students}
            profile={data.profile}
            certificates={data.certificates}
            onViewSession={(session) => setSelectedSessionForDetail(session)}
            onOpenReportGenerator={() => setSelectedSessionForDetail(data.sessions[0] || null)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-xl border-t border-white/10 mt-16 py-8 text-center text-xs text-white/70 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-wide">برنامج المعلم الصغير — مبادرة تدريس الأقران والتميز الطلابي</span>
          </div>

          <div className="flex items-center gap-4 text-white/80">
            <button
              onClick={() => setShowZipModal(true)}
              className="flex items-center gap-1.5 hover:text-amber-400 font-medium transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تنزيل المشروع (ZIP)</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setShowAiAssistantModal(true)}
              className="flex items-center gap-1.5 hover:text-purple-300 font-medium transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>المساعد الذكي</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <NewSessionModal
        isOpen={showNewSessionModal}
        onClose={() => setShowNewSessionModal(false)}
        students={data.students}
        profile={data.profile}
        initialStudent={selectedStudentForSession}
      />

      <ReportDetailModal
        session={selectedSessionForDetail}
        onClose={() => setSelectedSessionForDetail(null)}
        profile={data.profile}
      />

      <AiAssistantModal
        isOpen={showAiAssistantModal}
        onClose={() => setShowAiAssistantModal(false)}
      />

      <ZipDownloadModal
        isOpen={showZipModal}
        onClose={() => setShowZipModal(false)}
      />

      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </div>
  );
}

export default App;
