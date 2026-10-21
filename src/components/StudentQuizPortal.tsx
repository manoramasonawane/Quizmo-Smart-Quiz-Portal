import React, { useState, useEffect, useRef } from 'react';
import {
  ConfidenceLevel,
  Question,
  QuestionResponse,
  Quiz,
  StudentSubmission,
  AttemptLogEvent,
} from '../types/quizmo';
import {
  classifyResponseCognition,
  generateDiagnosticSummary,
} from '../services/metricsEngine';
import { SAMPLE_QUIZZES } from '../data/sampleQuizzes';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldAlert,
} from 'lucide-react';

interface StudentQuizPortalProps {
  onSaveSubmissionToCohort: (sub: StudentSubmission) => void;
  onNavigateToAnalytics: () => void;
}

export const StudentQuizPortal: React.FC<StudentQuizPortalProps> = ({
  onSaveSubmissionToCohort,
  onNavigateToAnalytics,
}) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz>(SAMPLE_QUIZZES[0]);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [studentName, setStudentName] = useState<string>('Jordan Reed');

  // Question response state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceLevel>(4);
  const [allResponses, setAllResponses] = useState<QuestionResponse[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [elapsedCurrentSeconds, setElapsedCurrentSeconds] = useState<number>(0);
  const [firstActionHesitation, setFirstActionHesitation] = useState<number | null>(null);
  const [attemptLogs, setAttemptLogs] = useState<AttemptLogEvent[]>([]);
  const [switchesCount, setSwitchesCount] = useState<number>(0);
  const [tabBlurViolations, setTabBlurViolations] = useState<number>(0);
  const [tabAlertVisible, setTabAlertVisible] = useState<boolean>(false);

  // Completed submission state
  const [completedSubmission, setCompletedSubmission] = useState<StudentSubmission | null>(null);

  const activeQuestion: Question | undefined = selectedQuiz.questions[currentQuestionIndex];
  const timerRef = useRef<number | null>(null);

  // Monitor Window Visibility / Tab Blurs (Anti-cheating edge case)
  useEffect(() => {
    if (!isQuizActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabBlurViolations((prev) => prev + 1);
        setTabAlertVisible(true);
        setTimeout(() => setTabAlertVisible(false), 4000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isQuizActive]);

  // Question Timer Loop
  useEffect(() => {
    if (!isQuizActive) return;

    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      setElapsedCurrentSeconds(Math.floor((now - questionStartTime) / 1000));
    }, 200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isQuizActive, questionStartTime]);

  const handleStartQuiz = (quizToStart: Quiz) => {
    setSelectedQuiz(quizToStart);
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setAllResponses([]);
    setCompletedSubmission(null);
    setTabBlurViolations(0);
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setConfidence(4);
    setQuestionStartTime(Date.now());
    setElapsedCurrentSeconds(0);
    setFirstActionHesitation(null);
    setAttemptLogs([{ timestamp: 0, action: 'first_view' }]);
    setSwitchesCount(0);
  };

  const handleSelectOption = (optionIndex: number) => {
    const now = Date.now();
    const timeDeltaSeconds = Math.round(((now - questionStartTime) / 1000) * 10) / 10;

    if (firstActionHesitation === null) {
      setFirstActionHesitation(timeDeltaSeconds);
    }

    if (selectedOption !== null && selectedOption !== optionIndex) {
      setSwitchesCount((prev) => prev + 1);
      setAttemptLogs((prev) => [
        ...prev,
        {
          timestamp: now - questionStartTime,
          action: 'change',
          selectedOptionIndex: optionIndex,
          previousOptionIndex: selectedOption,
        },
      ]);
    } else {
      setAttemptLogs((prev) => [
        ...prev,
        {
          timestamp: now - questionStartTime,
          action: 'select',
          selectedOptionIndex: optionIndex,
        },
      ]);
    }

    setSelectedOption(optionIndex);
  };

  const handleNextOrFinish = () => {
    if (!activeQuestion) return;

    const timeSpent = Math.max(1, elapsedCurrentSeconds);
    const isCorrect = selectedOption === activeQuestion.correctOptionIndex;
    const hesitation = firstActionHesitation ?? timeSpent;

    const { classification, timeDeviationSeconds, timeDeviationZScore } = classifyResponseCognition(
      isCorrect,
      confidence,
      timeSpent,
      activeQuestion.benchmarkMedianSeconds,
      activeQuestion.standardDeviationSeconds,
      switchesCount,
      hesitation
    );

    const recordedResponse: QuestionResponse = {
      questionId: activeQuestion.id,
      selectedOptionIndex: selectedOption,
      isCorrect,
      timeSpentSeconds: timeSpent,
      confidenceRating: confidence,
      attemptLogs,
      switchesCount,
      firstActionHesitationSeconds: hesitation,
      timeDeviationSeconds,
      timeDeviationZScore,
      classification,
    };

    const updatedResponses = [...allResponses, recordedResponse];
    setAllResponses(updatedResponses);

    if (currentQuestionIndex + 1 < selectedQuiz.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      resetQuestionState();
    } else {
      // Quiz Finished - Generate Diagnostic Summary
      const diagnostics = generateDiagnosticSummary(
        selectedQuiz.questions,
        updatedResponses,
        tabBlurViolations
      );

      const submission: StudentSubmission = {
        id: `sub-${Date.now()}`,
        quizId: selectedQuiz.id,
        quizTitle: selectedQuiz.title,
        studentId: `std-${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: studentName || 'Jordan Reed',
        avatarSeed: studentName.toLowerCase().replace(/\s+/g, ''),
        submittedAt: new Date().toISOString(),
        responses: updatedResponses,
        diagnostics,
      };

      setCompletedSubmission(submission);
      setIsQuizActive(false);
      onSaveSubmissionToCohort(submission);
    }
  };

  // 1. Initial State / Quiz Selector View
  if (!isQuizActive && !completedSubmission) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 text-center">
          <span className="text-xs font-mono text-indigo-400 font-semibold tracking-wider uppercase">
            Interactive Assessment Sandbox
          </span>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
            Experience Quizmo's 3-Metric Assessment Engine
          </h1>
          <p className="mt-3 text-base text-slate-400 max-w-2xl mx-auto">
            Traditional quiz tools only track binary right/wrong answers. Quizmo introduces{' '}
            <strong className="text-slate-200">Confidence Scoring</strong>,{' '}
            <strong className="text-slate-200">Attempt Patterns</strong>, and{' '}
            <strong className="text-slate-200">Time Deviation</strong> to detect guessing,
            deliberation, and misconception depth.
          </p>
        </div>

        {/* Student Profile Input */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <label className="text-xs font-mono text-slate-400">Student Name:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-64 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
            placeholder="Enter student name..."
          />
        </div>

        {/* Available Quizzes Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {SAMPLE_QUIZZES.map((quiz) => (
            <div
              key={quiz.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono text-indigo-400">{quiz.category}</span>
                  <span className="tabular-nums">{quiz.questions.length} Questions · ~{quiz.timeLimitMinutes}m</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-white font-display">
                  {quiz.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {quiz.description}
                </p>

                <div className="mt-5 border-t border-slate-800/80 pt-4 text-xs text-slate-400 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-mono font-medium">Metric 1:</span>
                    <span>Confidence slider per question (1-5 meta-cognition scale)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-mono font-medium">Metric 2:</span>
                    <span>Option-switching trajectory & hesitation latency tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-mono font-medium">Metric 3:</span>
                    <span>Real-time deviation against benchmark question medians</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 active:scale-[0.99] transition-all cursor-pointer"
                >
                  Start Quiz Session
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Active Quiz Taking View
  if (isQuizActive && activeQuestion) {
    const benchmarkDelta = elapsedCurrentSeconds - activeQuestion.benchmarkMedianSeconds;
    const progressPercent = Math.round(
      ((currentQuestionIndex) / selectedQuiz.questions.length) * 100
    );

    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Anti-cheat tab alert */}
        {tabAlertVisible && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-950/60 p-3.5 text-xs text-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Integrity Notice:</strong> Window defocus / tab blur event recorded. Total events logged: {tabBlurViolations}.
            </span>
          </div>
        )}

        {/* Top Session Status Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono text-slate-400">
              {selectedQuiz.title} · Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
            </div>
            <div className="text-sm font-semibold text-white font-display mt-0.5">
              Candidate: <span className="text-indigo-300">{studentName}</span>
            </div>
          </div>

          {/* Real-time Telemetry Widgets */}
          <div className="flex items-center gap-6 text-xs font-mono tabular-nums">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Time: <strong className="text-white">{elapsedCurrentSeconds}s</strong></span>
              <span className={`ml-1 text-[11px] ${benchmarkDelta > 10 ? 'text-amber-400' : 'text-slate-400'}`}>
                (Peer Median: {activeQuestion.benchmarkMedianSeconds}s | Δt: {benchmarkDelta > 0 ? `+${benchmarkDelta}` : benchmarkDelta}s)
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Switches: <strong className="text-white">{switchesCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Container */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
            <span className="font-mono text-indigo-400 font-semibold">{activeQuestion.topic}</span>
            <span>·</span>
            <span>{activeQuestion.subtopic}</span>
            <span>·</span>
            <span className="capitalize">{activeQuestion.difficulty}</span>
          </div>

          <h2 className="text-lg md:text-xl font-semibold text-white font-display leading-relaxed">
            {activeQuestion.question}
          </h2>

          {activeQuestion.codeSnippet && (
            <div className="mt-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-indigo-200/90 leading-normal">
              <pre>{activeQuestion.codeSnippet}</pre>
            </div>
          )}

          {/* Options Grid */}
          <div className="mt-6 space-y-3">
            {activeQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left rounded-lg p-4 border text-sm transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-700 text-slate-400'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 pt-0.5 leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Metric 1 Input: Confidence Rating */}
          <div className="mt-8 rounded-lg border border-slate-800/80 bg-slate-950/50 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-white font-display">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span>Metric 1: Rate Your Subjective Confidence</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Assesses metacognitive calibration. Used to distinguish reasoned mastery from lucky guesses.
                </p>
              </div>

              <div className="text-xs font-mono text-indigo-300 tabular-nums">
                Level {confidence}: {
                  confidence === 1 ? '1/5 (Wild Guess)' :
                  confidence === 2 ? '2/5 (Low Certainty)' :
                  confidence === 3 ? '3/5 (Moderate)' :
                  confidence === 4 ? '4/5 (High Confidence)' :
                  '5/5 (Absolute Certainty)'
                }
              </div>
            </div>

            {/* Confidence Selector Buttons */}
            <div className="mt-3 grid grid-cols-5 gap-2">
              {([1, 2, 3, 4, 5] as ConfidenceLevel[]).map((lvl) => {
                const isActive = confidence === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setConfidence(lvl)}
                    className={`py-2 px-1 text-center rounded-md text-xs font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold ring-1 ring-indigo-400'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span className="block text-sm font-bold">{lvl}</span>
                    <span className="hidden md:inline text-[10px] opacity-80">
                      {lvl === 1 ? 'Guess' : lvl === 3 ? 'Medium' : lvl === 5 ? 'Certain' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-800/80 pt-4">
            <div className="text-xs text-slate-400 font-mono">
              {selectedOption === null ? 'Select an answer above to continue' : 'Ready to record response'}
            </div>

            <button
              onClick={handleNextOrFinish}
              disabled={selectedOption === null}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold text-white transition-all cursor-pointer ${
                selectedOption !== null
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-sm active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <span>
                {currentQuestionIndex + 1 === selectedQuiz.questions.length
                  ? 'Submit Assessment & Analyze'
                  : 'Save & Next Question'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Post-Assessment Diagnostic Report View
  if (completedSubmission) {
    const d = completedSubmission.diagnostics;

    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span>Assessment Completed & Evaluated</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold text-white font-display">
              Personalized Diagnostic Report: {completedSubmission.studentName}
            </h1>
            <p className="mt-1 text-sm text-slate-400 font-mono">
              {completedSubmission.quizTitle} · Submitted {new Date(completedSubmission.submittedAt).toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleStartQuiz(selectedQuiz)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Quiz
            </button>
            <button
              onClick={onNavigateToAnalytics}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm transition-colors cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              View Class Analytics
            </button>
          </div>
        </div>

        {/* 4 Core Quantitative Pillars Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-xs font-mono text-slate-400">Raw Accuracy</div>
            <div className="mt-2 text-3xl font-bold text-white font-display tabular-nums">
              {d.accuracyPercentage}%
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {d.overallScore} of {d.maxScore} correct
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-xs font-mono text-slate-400">Confidence Calibration</div>
            <div className="mt-2 text-3xl font-bold text-indigo-400 font-display tabular-nums">
              {d.calibrationIndex}%
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Alignment of belief with truth
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-xs font-mono text-slate-400">Guessing Behavior Rate</div>
            <div className={`mt-2 text-3xl font-bold font-display tabular-nums ${
              d.guessingBehaviorRate > 25 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {d.guessingBehaviorRate}%
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Rushed/low-confidence flags
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-xs font-mono text-slate-400">Avg Time Variance (Δt)</div>
            <div className="mt-2 text-3xl font-bold text-white font-display tabular-nums">
              {d.averageTimeDeviationSeconds > 0 ? `+${d.averageTimeDeviationSeconds}s` : `${d.averageTimeDeviationSeconds}s`}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Relative to peer median
            </div>
          </div>
        </div>

        {/* Cognitive Quadrant Breakdown */}
        <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white font-display">
              Multi-Dimensional Cognitive Profile
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3.5">
              <div className="text-xs text-slate-400">Effortless Mastery</div>
              <div className="mt-1 text-2xl font-bold text-emerald-400 font-display tabular-nums">
                {d.cognitiveQuadrantBreakdown.effortlessMastery}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">High confidence, fast/correct</div>
            </div>

            <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3.5">
              <div className="text-xs text-slate-400">Deliberative Mastery</div>
              <div className="mt-1 text-2xl font-bold text-blue-400 font-display tabular-nums">
                {d.cognitiveQuadrantBreakdown.deliberativeMastery}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Careful reasoned deduction</div>
            </div>

            <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3.5">
              <div className="text-xs text-slate-400">Underconfident Mastery</div>
              <div className="mt-1 text-2xl font-bold text-cyan-400 font-display tabular-nums">
                {d.cognitiveQuadrantBreakdown.underconfidentMastery}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Correct, but doubted oneself</div>
            </div>

            <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3.5">
              <div className="text-xs text-slate-400">Overconfident Error</div>
              <div className="mt-1 text-2xl font-bold text-rose-400 font-display tabular-nums">
                {d.cognitiveQuadrantBreakdown.overconfidentError}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Certain, but mistaken (misconception)</div>
            </div>

            <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3.5">
              <div className="text-xs text-slate-400">Rushed Guess</div>
              <div className="mt-1 text-2xl font-bold text-amber-400 font-display tabular-nums">
                {d.cognitiveQuadrantBreakdown.rushedGuess}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Quick low-confidence guess</div>
            </div>

            <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3.5">
              <div className="text-xs text-slate-400">Struggling Error</div>
              <div className="mt-1 text-2xl font-bold text-orange-400 font-display tabular-nums">
                {d.cognitiveQuadrantBreakdown.strugglingError}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">High friction, slow and incorrect</div>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses (Actionable Insights) */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {/* Strengths */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center gap-2 text-emerald-400 mb-4">
              <CheckCircle className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-white font-display">Validated Strengths</h3>
            </div>
            {d.strengths.length > 0 ? (
              <ul className="space-y-3">
                {d.strengths.map((str, idx) => (
                  <li key={idx} className="border-b border-slate-800/60 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span>{str.topic}</span>
                      <span className="font-mono text-emerald-400 tabular-nums">{str.accuracy}% acc · {str.confidence}/5 conf</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">No validated topic mastery recorded yet.</p>
            )}
          </div>

          {/* Weaknesses & Targeted Interventions */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center gap-2 text-amber-400 mb-4">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-white font-display">Targeted Remediation Areas</h3>
            </div>
            {d.weaknesses.length > 0 ? (
              <ul className="space-y-3">
                {d.weaknesses.map((w, idx) => (
                  <li key={idx} className="border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span>{w.topic}</span>
                      <span className="font-mono text-amber-400 tabular-nums">{w.accuracy}% acc · {w.confidence}/5 conf</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {w.recommendation}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-emerald-400">Excellent performance! Zero critical knowledge gaps identified.</p>
            )}
          </div>
        </div>

        {/* Granular Question-by-Question Audit Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-sm font-semibold text-white font-display mb-4">
            Question-Level Telemetry & Cognitive Classification
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Topic</th>
                  <th className="py-2.5 px-3">Outcome</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Time Spent (Δt)</th>
                  <th className="py-2.5 px-3">Option Switches</th>
                  <th className="py-2.5 px-3">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                {completedSubmission.responses.map((resp, i) => {
                  const q = selectedQuiz.questions.find((x) => x.id === resp.questionId);
                  return (
                    <tr key={resp.questionId} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 text-slate-500 font-bold">{i + 1}</td>
                      <td className="py-3 px-3 font-sans text-slate-200">{q?.topic || resp.questionId}</td>
                      <td className="py-3 px-3">
                        {resp.isCorrect ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 tabular-nums">{resp.confidenceRating}/5</td>
                      <td className="py-3 px-3 tabular-nums">
                        {resp.timeSpentSeconds}s ({resp.timeDeviationSeconds > 0 ? `+${resp.timeDeviationSeconds}` : resp.timeDeviationSeconds}s)
                      </td>
                      <td className="py-3 px-3 tabular-nums">{resp.switchesCount}</td>
                      <td className="py-3 px-3 font-sans capitalize">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          resp.classification === 'effortless_mastery' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50' :
                          resp.classification === 'deliberative_mastery' ? 'bg-blue-950/60 text-blue-300 border border-blue-800/50' :
                          resp.classification === 'underconfident_mastery' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/50' :
                          resp.classification === 'overconfident_error' ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50' :
                          resp.classification === 'rushed_guess' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50' :
                          'bg-orange-950/60 text-orange-300 border border-orange-800/50'
                        }`}>
                          {resp.classification.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
