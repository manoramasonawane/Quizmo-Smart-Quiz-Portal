import React, { useState } from 'react';
import { Copy, Check, Sparkles, FileText, Code2, Sliders, ArrowRight } from 'lucide-react';

export const ResumeBulletStudio: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<'fullstack' | 'product' | 'custom' | 'comparison'>('fullstack');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Customization sliders/inputs
  const [reportingMetric, setReportingMetric] = useState<number>(40);
  const [usabilityMetric, setUsabilityMetric] = useState<number>(35);
  const [depthMetric, setDepthMetric] = useState<number>(30);
  const [instructionalMetric, setInstructionalMetric] = useState<number>(25);

  const fullStackBullets = [
    `Architected a responsive full-stack assessment portal using Node.js, Express, and MongoDB, supporting concurrent quiz sessions and automated real-time scoring.`,
    `Built multi-dimensional evaluation algorithms tracking confidence scores, attempt patterns, and time deviation to identify student knowledge gaps and guessing behavior.`,
    `Engineered MongoDB aggregation pipelines to generate role-based diagnostic reports for teachers, reducing grading and performance analysis time by ${reportingMetric}%.`,
    `Implemented secure RESTful APIs and a responsive, mobile-first UI for students and educators, improving session completion rates by ${usabilityMetric}%.`
  ];

  const productBullets = [
    `Developed an end-to-end quiz management system serving teachers and students, reducing manual assessment overhead by ${reportingMetric}%.`,
    `Formulated 3 proprietary evaluation metrics (confidence indexing, question-level attempt patterns, and time-variance analysis) to provide personalized learning diagnostics.`,
    `Designed dynamic reporting dashboards allowing educators to filter student strengths and weaknesses by topic, improving targeted remediation.`,
    `Built and integrated modular Express.js back-end services with MongoDB for low-latency question rendering and automated submission processing.`
  ];

  const originalBullets = [
    `Developed a full-stack quiz platform improving performance reporting accuracy by 40%.`,
    `Designed responsive UI for teachers and students, increasing usability by 35%.`,
    `Introduced 3 innovative assessment metrics—confidence score, attempt pattern, and time deviation—to personalize learning insights and boost evaluation depth by 30%.`,
    `Enabled teachers to generate detailed reports with insights into student strengths and weaknesses, boosting instructional effectiveness by 25%.`
  ];

  const currentBullets = selectedStyle === 'product' ? productBullets : fullStackBullets;

  const handleCopySingle = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const header = `Quizmo – Smart Quiz & Assessment Platform | HTML, CSS, JavaScript, Node.js, Express.js, MongoDB\nAug 2022 – Dec 2024\n`;
    const body = currentBullets.map((b) => `• ${b}`).join('\n');
    navigator.clipboard.writeText(`${header}${body}`);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-10 text-center">
        <span className="text-xs font-mono text-indigo-400 font-semibold tracking-wider uppercase">
          Resume Optimization & ATS Tuning Studio
        </span>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
          Resume Bullet Customizer
        </h1>
        <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">
          Tailor your Quizmo experience bullets for Software Engineering vs Product roles,
          with concrete technical mechanisms and ATS-friendly impact metrics.
        </p>
      </div>

      {/* Style Selector Tabs */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setSelectedStyle('fullstack')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedStyle === 'fullstack'
              ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Option 1: Full-Stack Engineering (Recommended)
        </button>
        <button
          onClick={() => setSelectedStyle('product')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedStyle === 'product'
              ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Option 2: Metric & Product-Driven
        </button>
        <button
          onClick={() => setSelectedStyle('comparison')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedStyle === 'comparison'
              ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Before vs After Comparison
        </button>
      </div>

      {/* BEFORE VS AFTER COMPARISON */}
      {selectedStyle === 'comparison' ? (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Original Draft */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-3 mb-4">
                <span className="font-semibold text-rose-300">Original Resume Bullets</span>
                <span className="text-rose-400">Ambiguous Metrics</span>
              </div>
              <ul className="space-y-4 text-xs text-slate-300 leading-relaxed">
                {originalBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-500 font-bold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 border-t border-slate-800 pt-4 text-xs text-slate-400">
                <strong className="text-rose-300 block mb-1">Recruiter Critique:</strong>
                "Usability by 35%" and "instructional effectiveness by 25%" lack concrete technical mechanisms. Mentions MongoDB but doesn't explain how data was queried or modeled.
              </div>
            </div>

            {/* Optimized High-Impact Draft */}
            <div className="rounded-xl border border-indigo-500/30 bg-slate-950 p-6 shadow-lg">
              <div className="flex items-center justify-between text-xs font-mono text-indigo-400 border-b border-slate-800 pb-3 mb-4">
                <span className="font-semibold text-emerald-300">Optimized Engineering Version</span>
                <span className="text-emerald-400">Action + Mechanism + Impact</span>
              </div>
              <ul className="space-y-4 text-xs text-slate-200 leading-relaxed">
                {fullStackBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 border-t border-slate-800 pt-4 text-xs text-slate-400">
                <strong className="text-emerald-300 block mb-1">Recruiter Strengths:</strong>
                Highlights architecture, aggregation pipelines, RESTful APIs, and exact algorithms for the 3 metrics. Concrete proof of full-stack backend depth.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ACTIVE BULLETS CARD WITH COPY & METRICS SLIDERS */
        <div className="space-y-6">
          {/* Main Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Quizmo – Smart Quiz & Assessment Platform
                </h3>
                <p className="text-xs font-mono text-indigo-400 mt-0.5">
                  HTML, CSS, JavaScript, Node.js, Express.js, MongoDB · Aug 2022 – Dec 2024
                </p>
              </div>

              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Copied Entire Block!' : 'Copy Formatted Resume Block'}</span>
              </button>
            </div>

            {/* Bullets List */}
            <div className="space-y-4">
              {currentBullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className="group relative flex items-start justify-between gap-4 rounded-lg border border-slate-800/80 bg-slate-950/40 p-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-indigo-400 font-bold text-sm select-none">•</span>
                    <p className="text-xs text-slate-200 leading-relaxed pt-0.5">
                      {bullet}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopySingle(bullet, idx)}
                    className="opacity-60 group-hover:opacity-100 p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
                    title="Copy bullet"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Metric Sliders Customizer */}
            <div className="mt-8 border-t border-slate-800 pt-6">
              <div className="flex items-center gap-2 mb-4 text-xs font-mono text-slate-300">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Adjust Metric Percentage Values for Your Target Role:</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Performance Analysis / Grading Overhead:</span>
                    <span className="font-mono text-indigo-300 font-bold">{reportingMetric}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    step="5"
                    value={reportingMetric}
                    onChange={(e) => setReportingMetric(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Usability / Session Completion Lift:</span>
                    <span className="font-mono text-indigo-300 font-bold">{usabilityMetric}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="50"
                    step="5"
                    value={usabilityMetric}
                    onChange={(e) => setUsabilityMetric(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
