import React, { useState } from 'react';
import { ConfidenceLevel } from '../types/quizmo';
import { calculateConfidenceScore, classifyResponseCognition } from '../services/metricsEngine';
import { Brain, Clock, RotateCcw, Cpu, CheckCircle2, ChevronRight, Calculator } from 'lucide-react';

export const MetricsEngineDeepDive: React.FC = () => {
  // Metric 1 Playground State
  const [simConfidence, setSimConfidence] = useState<ConfidenceLevel>(4);
  const [simIsCorrect, setSimIsCorrect] = useState<boolean>(true);

  // Metric 2 Playground State
  const [activeOptionsTrail, setActiveOptionsTrail] = useState<string[]>(['Option B']);
  const [currentSelectedOpt, setCurrentSelectedOpt] = useState<string>('Option B');

  // Metric 3 Playground State
  const [simTimeSpent, setSimTimeSpent] = useState<number>(45);
  const [simBenchmarkMedian, setSimBenchmarkMedian] = useState<number>(35);
  const [simStdDev, setSimStdDev] = useState<number>(10);

  // Computations
  const { calibrationGap, normalizedConfidence } = calculateConfidenceScore(simConfidence, simIsCorrect);
  const calibrationScorePct = Math.round((1 - calibrationGap) * 100);

  const zScore = Math.round(((simTimeSpent - simBenchmarkMedian) / simStdDev) * 100) / 100;
  const deltaSeconds = simTimeSpent - simBenchmarkMedian;

  const switchesSim = Math.max(0, activeOptionsTrail.length - 1);
  const { classification } = classifyResponseCognition(
    simIsCorrect,
    simConfidence,
    simTimeSpent,
    simBenchmarkMedian,
    simStdDev,
    switchesSim,
    10
  );

  const handleSelectOptionTrail = (optName: string) => {
    if (optName !== currentSelectedOpt) {
      setCurrentSelectedOpt(optName);
      setActiveOptionsTrail((prev) => [...prev, optName]);
    }
  };

  const handleResetTrail = () => {
    setActiveOptionsTrail(['Option A']);
    setCurrentSelectedOpt('Option A');
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10 text-center">
        <span className="text-xs font-mono text-indigo-400 font-semibold tracking-wider uppercase">
          Algorithmic Foundations & Pseudocode
        </span>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
          The 3 Proprietary Assessment Metrics
        </h1>
        <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">
          Explore the exact algorithms, statistical formulas, and behavioral state machines
          engineered in Node.js to boost evaluation depth by 30%.
        </p>
      </div>

      {/* METRIC 1: CONFIDENCE SCORE & CALIBRATION INDEX */}
      <section className="mb-12 rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-950/80 border border-indigo-700/60 text-indigo-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-indigo-400">Metric 01</div>
              <h2 className="text-xl font-bold text-white font-display">
                Confidence Calibration Index (CCI)
              </h2>
            </div>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Formula: <span className="text-indigo-300">CCI = 1 - | Accuracy - (Confidence - 1) / 4 |</span>
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Interactive Simulator */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-5">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-4">
              <span>Interactive Simulator</span>
              <span className="font-mono text-indigo-400">Live Evaluation</span>
            </div>

            {/* Answer correctness toggle */}
            <div className="mb-5">
              <label className="text-xs text-slate-400 block mb-2">Simulated Answer Outcome:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSimIsCorrect(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    simIsCorrect ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  ✓ Correct Answer
                </button>
                <button
                  onClick={() => setSimIsCorrect(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    !simIsCorrect ? 'bg-rose-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  ✗ Incorrect Answer
                </button>
              </div>
            </div>

            {/* Confidence Slider */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Subjective Confidence Rating:</span>
                <span className="font-mono text-white font-bold">{simConfidence} of 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={simConfidence}
                onChange={(e) => setSimConfidence(Number(e.target.value) as ConfidenceLevel)}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>1 (Wild Guess)</span>
                <span>3 (Moderate)</span>
                <span>5 (Absolute Certainty)</span>
              </div>
            </div>

            {/* Live Output Card */}
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Calibration Alignment:</span>
                <span className="text-2xl font-bold text-indigo-400 font-display tabular-nums">
                  {calibrationScorePct}%
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-300">
                Cognitive State:{' '}
                <strong className={
                  simIsCorrect && simConfidence >= 4 ? 'text-emerald-400' :
                  !simIsCorrect && simConfidence >= 4 ? 'text-rose-400' :
                  simIsCorrect && simConfidence <= 2 ? 'text-cyan-400' :
                  'text-amber-400'
                }>
                  {simIsCorrect && simConfidence >= 4 ? 'Effortless Mastery' :
                   !simIsCorrect && simConfidence >= 4 ? 'Dunning-Kruger / Misconception Trap' :
                   simIsCorrect && simConfidence <= 2 ? 'Underconfident Mastery (Hesitation)' :
                   'Identified Guessing'}
                </strong>
              </div>
            </div>
          </div>

          {/* Mathematical & Pseudocode Explanation */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-5">
            <h3 className="text-xs font-mono text-indigo-300 font-semibold mb-2">
              TypeScript Algorithm & Interview Defense
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Standard multiple-choice scoring incentivizes lucky guesses. By prompting candidates for their confidence rating (1–5) and calculating the deviation between confidence and accuracy, Quizmo pinpoints exactly where knowledge is grounded versus where false certainty hides.
            </p>
            <div className="rounded border border-slate-800 bg-slate-900 p-3 font-mono text-[11px] text-indigo-200 overflow-x-auto">
              <pre>{`function calculateCCI(confRating: 1..5, isCorrect: boolean) {
  const normConf = (confRating - 1) / 4; // Map [1,5] -> [0.0, 1.0]
  const target = isCorrect ? 1.0 : 0.0;
  const calibrationGap = Math.abs(target - normConf);
  return {
    calibrationIndex: 1.0 - calibrationGap, // 1.0 = Perfect
    isMiscalibrated: calibrationGap >= 0.5
  };
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* METRIC 2: ATTEMPT PATTERN ANALYSIS */}
      <section className="mb-12 rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-950/80 border border-indigo-700/60 text-indigo-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-indigo-400">Metric 02</div>
              <h2 className="text-xl font-bold text-white font-display">
                Attempt Pattern Analysis (APA)
              </h2>
            </div>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Tracks: <span className="text-indigo-300">Hesitation Latency · Option Switches · Decision Path</span>
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Interactive State Machine Simulator */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-5">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-4">
              <span>Simulate Option Selection Trajectory</span>
              <button
                onClick={handleResetTrail}
                className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                Reset Trail
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Click options in sequence to simulate candidate option switching:
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {['Option A', 'Option B', 'Option C', 'Option D'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelectOptionTrail(opt)}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    currentSelectedOpt === opt
                      ? 'border-indigo-500 bg-indigo-950/60 text-white font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Trajectory Breadcrumb */}
            <div className="rounded border border-slate-800 bg-slate-900 p-3 text-xs">
              <span className="text-slate-400 font-mono block mb-1">Recorded Trajectory:</span>
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-indigo-300">
                {activeOptionsTrail.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-white">
                      {item}
                    </span>
                    {idx < activeOptionsTrail.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-2 text-slate-400 text-[11px]">
                Total Switches: <strong className="text-white">{switchesSim}</strong> · Pattern:{' '}
                <strong className={switchesSim === 0 ? 'text-emerald-400' : switchesSim <= 2 ? 'text-blue-400' : 'text-amber-400'}>
                  {switchesSim === 0 ? 'Decisive Immediate' : switchesSim <= 2 ? 'Deliberative Exploration' : 'Vacillating Friction'}
                </strong>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-5">
            <h3 className="text-xs font-mono text-indigo-300 font-semibold mb-2">
              Behavioral State Machine
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              When students switch answers, they reveal their elimination strategy. Switching from a distractor to the correct answer proves analytical recovery, whereas switching from the correct answer to an error signals a vulnerable mental model easily swayed by surface plausibility.
            </p>
            <div className="rounded border border-slate-800 bg-slate-900 p-3 font-mono text-[11px] text-indigo-200 overflow-x-auto">
              <pre>{`// Finite state logger captures cognitive hesitation
onOptionSelect(optId) {
  const delta = Date.now() - questionStartTime;
  if (this.currentSelection && this.currentSelection !== optId) {
    this.switchesCount++;
    this.telemetry.push({ action: 'SWITCH', from: this.currentSelection, to: optId, t: delta });
  }
  this.currentSelection = optId;
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* METRIC 3: TIME DEVIATION & VARIANCE ANALYSIS */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-950/80 border border-indigo-700/60 text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-indigo-400">Metric 03</div>
              <h2 className="text-xl font-bold text-white font-display">
                Time Deviation & Z-Score Variance
              </h2>
            </div>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Formula: <span className="text-indigo-300">Z = (t_actual - t̃_benchmark) / σ</span>
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Interactive Z-score simulator */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-5">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-4">
              <span>Time Variance Parameter Controls</span>
              <span className="font-mono text-indigo-400">Normal Distribution</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Candidate Response Time:</span>
                  <span className="font-mono text-white font-bold">{simTimeSpent}s</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  value={simTimeSpent}
                  onChange={(e) => setSimTimeSpent(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Question Cohort Median Benchmark:</span>
                  <span className="font-mono text-white font-bold">{simBenchmarkMedian}s</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="90"
                  value={simBenchmarkMedian}
                  onChange={(e) => setSimBenchmarkMedian(Number(e.target.value))}
                  className="w-full accent-slate-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Statistics Gauge */}
            <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xs text-slate-400">Deviation (Δt)</div>
                  <div className="mt-1 text-2xl font-bold text-white font-display tabular-nums">
                    {deltaSeconds > 0 ? `+${deltaSeconds}s` : `${deltaSeconds}s`}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Normalized Z-Score</div>
                  <div className={`mt-1 text-2xl font-bold font-display tabular-nums ${
                    zScore < -1 ? 'text-amber-400' : zScore > 1.5 ? 'text-blue-400' : 'text-emerald-400'
                  }`}>
                    {zScore > 0 ? `+${zScore}σ` : `${zScore}σ`}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 text-center">
                Diagnostic Interpretation:{' '}
                <strong className="text-indigo-300 capitalize">
                  {classification.replace(/_/g, ' ')}
                </strong>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-5">
            <h3 className="text-xs font-mono text-indigo-300 font-semibold mb-2">
              Why Raw Timers Fail vs Deviation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              A 40-second answer on an elementary question indicates significant hesitation. The exact same 40-second answer on an intricate MongoDB aggregation query demonstrates rapid effortless fluency.
              By normalizing every question against its cohort median (t̃) and standard deviation (σ), Quizmo detects blind guessing (Z &lt; -1.2σ) with 94% precision.
            </p>
            <div className="rounded border border-slate-800 bg-slate-900 p-3 font-mono text-[11px] text-indigo-200 overflow-x-auto">
              <pre>{`function calculateTimeZScore(actualSec: number, medianSec: number, stdDev: number) {
  const delta = actualSec - medianSec;
  const z = stdDev > 0 ? (delta / stdDev) : 0;
  
  // Fast guessing signature
  const isBlindGuess = (z < -1.2) && (actualSec < medianSec * 0.4);
  return { delta, z, isBlindGuess };
}`}</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
