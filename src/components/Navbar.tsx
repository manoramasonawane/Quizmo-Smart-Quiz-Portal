import React from 'react';

export type NavTab = 'quiz' | 'analytics' | 'metrics' | 'architecture' | 'resume';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onStartQuiz: () => void;
  isTakingQuiz: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onStartQuiz,
  isTakingQuiz,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onSelectTab('quiz')}
          className="text-left group flex items-baseline gap-1.5 focus:outline-none"
        >
          <span className="text-xl font-bold tracking-tight text-white font-display">
            Quizmo
          </span>
          <span className="text-xs font-mono text-indigo-400 font-medium">
            v2.4
          </span>
        </button>

        {/* Zone 2: Single-line Text Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('quiz')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'quiz'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Assessment Sandbox
          </button>
          <button
            onClick={() => onSelectTab('analytics')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'analytics'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Teacher Analytics
          </button>
          <button
            onClick={() => onSelectTab('metrics')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'metrics'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3 Metrics Engine
          </button>
          <button
            onClick={() => onSelectTab('architecture')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'architecture'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Architecture & Scale
          </button>
          <button
            onClick={() => onSelectTab('resume')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'resume'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resume Studio
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {!isTakingQuiz ? (
            <button
              onClick={onStartQuiz}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 active:scale-95 transition-all shadow-sm shadow-indigo-500/20 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Take Assessment
            </button>
          ) : (
            <div className="text-xs font-mono text-emerald-400 tabular-nums">
              Session Live
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
