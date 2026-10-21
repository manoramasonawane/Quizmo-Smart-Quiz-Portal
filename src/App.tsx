import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { StudentQuizPortal } from './components/StudentQuizPortal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { MetricsEngineDeepDive } from './components/MetricsEngineDeepDive';
import { ArchitectureAndInterviewHub } from './components/ArchitectureAndInterviewHub';
import { ResumeBulletStudio } from './components/ResumeBulletStudio';
import { StudentSubmission } from './types/quizmo';
import { MOCK_COHORT_SUBMISSIONS } from './data/sampleQuizzes';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('quiz');
  const [cohortSubmissions, setCohortSubmissions] = useState<StudentSubmission[]>(MOCK_COHORT_SUBMISSIONS);
  const [isTakingQuiz, setIsTakingQuiz] = useState<boolean>(false);

  const handleSaveSubmissionToCohort = (newSub: StudentSubmission) => {
    setCohortSubmissions((prev) => [newSub, ...prev]);
  };

  const handleStartQuizFromNav = () => {
    setActiveTab('quiz');
    setIsTakingQuiz(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'quiz') setIsTakingQuiz(false);
        }}
        onStartQuiz={handleStartQuizFromNav}
        isTakingQuiz={isTakingQuiz}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'quiz' && (
          <StudentQuizPortal
            onSaveSubmissionToCohort={handleSaveSubmissionToCohort}
            onNavigateToAnalytics={() => setActiveTab('analytics')}
          />
        )}

        {activeTab === 'analytics' && (
          <TeacherDashboard
            cohortSubmissions={cohortSubmissions}
          />
        )}

        {activeTab === 'metrics' && (
          <MetricsEngineDeepDive />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureAndInterviewHub />
        )}

        {activeTab === 'resume' && (
          <ResumeBulletStudio />
        )}
      </main>

      {/* Quiet Footer adhering strictly to anti-slop guidelines */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300 font-display">Quizmo</span>
            <span>·</span>
            <span>Smart Quiz & Assessment Platform</span>
            <span>·</span>
            <span className="font-mono text-slate-400">Node.js · Express · MongoDB</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('metrics')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Evaluation Metrics
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Data Architecture
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Resume Bullet Studio
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
