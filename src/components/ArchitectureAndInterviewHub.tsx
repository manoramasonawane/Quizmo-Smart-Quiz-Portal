import React, { useState } from 'react';
import { Database, ShieldCheck, Server, Layers, Cpu, Code2, WifiOff, Clock, Terminal } from 'lucide-react';

export const ArchitectureAndInterviewHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schema' | 'scale' | 'edgecases' | 'interview'>('schema');

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10 text-center">
        <span className="text-xs font-mono text-indigo-400 font-semibold tracking-wider uppercase">
          Full-Stack Technical Blueprint
        </span>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
          System Architecture, Schema & Scale
        </h1>
        <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">
          Deep-dive into Quizmo's database schemas, concurrency architecture,
          anti-cheat telemetry pipelines, and interview talking points.
        </p>
      </div>

      {/* Hero Architectural Visual from generate_image */}
      <div className="mb-10 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        <div className="relative aspect-16/9 w-full max-h-80 overflow-hidden">
          <img
            src="/src/assets/images/quizmo_platform_hero_1792600487181.jpg"
            alt="Quizmo Smart Quiz Platform System Architecture and Diagnostics"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-slate-300">
            <span className="font-mono text-indigo-300">
              Quizmo End-to-End Diagnostic Pipeline · Node.js + Express + MongoDB
            </span>
            <span className="hidden sm:inline font-mono text-slate-400">
              Low-Latency Aggregation · Sub-20ms P99 Query Performance
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'schema'
              ? 'bg-indigo-600 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>MongoDB Data Modeling</span>
        </button>
        <button
          onClick={() => setActiveTab('scale')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'scale'
              ? 'bg-indigo-600 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Scale & Concurrency (5k+ Users)</span>
        </button>
        <button
          onClick={() => setActiveTab('edgecases')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'edgecases'
              ? 'bg-indigo-600 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Edge Cases & Anti-Cheating</span>
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'interview'
              ? 'bg-indigo-600 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Interview Defense Flashcards</span>
        </button>
      </div>

      {/* TAB 1: MONGODB DATA MODELING */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-base font-semibold text-white font-display mb-2">
              Embedding vs Referencing Design Decisions
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In MongoDB modeling for Quizmo, we balanced write contention and read velocity.
              Questions are embedded directly inside the <code className="text-indigo-300">Quiz</code> document because a quiz version is immutable during a live testing session.
              Student <code className="text-indigo-300">Submissions</code> are stored in a dedicated collection to prevent the 16MB document size limit and allow atomic appends.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Collection 1: Quizzes */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center justify-between text-xs font-mono text-indigo-400 mb-2">
                <span>Collection: quizzes</span>
                <span>Indexes: [category: 1, createdBy: 1]</span>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">{`{
  _id: ObjectId("..."),
  title: "Full-Stack Node.js Diagnostics",
  category: "Full-Stack Web Engineering",
  timeLimitMinutes: 10,
  questions: [
    {
      questionId: "node-01",
      topic: "Node.js Event Loop",
      text: "In Node.js event loop processing...",
      options: [
        { text: "Output: 1, 6, 4, 5, 2, 3" }
      ],
      correctOptionIndex: 0,
      benchmarkMedianSec: 38,
      stdDevSec: 12
    }
  ],
  version: 1,
  createdAt: ISODate("...")
}`}</pre>
            </div>

            {/* Collection 2: Submissions & Telemetry */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center justify-between text-xs font-mono text-indigo-400 mb-2">
                <span>Collection: submissions</span>
                <span>Indexes: [quizId: 1, studentId: 1, submittedAt: -1]</span>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">{`{
  _id: ObjectId("..."),
  quizId: ObjectId("..."),
  studentId: ObjectId("..."),
  studentName: "Alex Chen",
  submittedAt: ISODate("2024-11-14T14:23:10Z"),
  responses: [
    {
      questionId: "node-01",
      selectedOptionIndex: 0,
      isCorrect: true,
      confidenceRating: 5,        // Metric 1
      switchesCount: 1,           // Metric 2
      firstHesitationSec: 8.0,    // Metric 2
      timeSpentSeconds: 34,       // Metric 3
      timeDeviationZScore: -0.33, // Metric 3
      classification: "effortless_mastery"
    }
  ],
  summary: {
    accuracyPct: 100,
    calibrationIndex: 95,
    guessingRate: 0,
    violationsCount: 0
  }
}`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCALE & CONCURRENCY */}
      {activeTab === 'scale' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-base font-semibold text-white font-display mb-2">
              Handling the 30-Second Submission Spike (5,000+ Concurrent Students)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When a timed quiz expires, thousands of students submit simultaneously.
              If a naive backend tries to write and compute aggregations synchronously, Node's event loop blocks and MongoDB connection pools exhaust. Here is how Quizmo solves it:
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-mono text-indigo-400 mb-1">01. Async Queue Decoupling</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Incoming submission payloads are acknowledged within 15ms by pushing raw JSON to Redis/RabbitMQ queue buffers. The HTTP endpoint immediately returns 202 Accepted.
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-mono text-indigo-400 mb-1">02. Batch BulkWrite in MongoDB</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Background worker processes drain the queue using MongoDB <code className="text-slate-200">bulkWrite()</code> with unordered inserts, writing 500 records per network roundtrip.
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-mono text-indigo-400 mb-1">03. Read Replica Offloading</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Teacher aggregation queries are routed to secondary read replicas using <code className="text-slate-200">readPreference: 'secondaryPreferred'</code>, preventing analytical load from impacting student writes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EDGE CASES & ANTI-CHEATING */}
      {activeTab === 'edgecases' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-base font-semibold text-white font-display mb-2">
              Mitigating Cheating, Timer Tampering & Disconnections
            </h3>

            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Edge Case 1: Client Clock Manipulation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Risk:</strong> Student alters system clock or pauses JavaScript execution in DevTools to gain infinite quiz time.
                  <br />
                  <strong>Quizmo Solution:</strong> The server generates a signed session token containing an authoritative start timestamp (t_start). Upon submission, the server computes Δ = t_server_now - t_start. If Δ exceeds allowedLimit + networkGracePeriod, the submission is rejected or marked as late regardless of client-reported time.
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                  <WifiOff className="w-4 h-4" />
                  <span>Edge Case 2: Sudden Network Disconnect Mid-Quiz</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Risk:</strong> Wi-Fi drops while answering question 4 of 10. Page refresh would normally reset state.
                  <br />
                  <strong>Quizmo Solution:</strong> Responses and option switch histories are persisted synchronously to IndexedDB / localStorage. On reconnect, Quizmo performs a handshake with the backend to sync elapsed time and resume seamlessly without loss of work.
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Edge Case 3: Tab Switching & Answer Searching</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Risk:</strong> Student opens search engines or chat tools in another window to look up solutions.
                  <br />
                  <strong>Quizmo Solution:</strong> Quizmo hooks into the browser's <code>visibilitychange</code> and <code>window.onblur</code> events, logging timestamps and durations of backgrounding. Excess defocus events flag the attempt in the Teacher Diagnostic dashboard for manual audit.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTERVIEW DEFENSE FLASHCARDS */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-base font-semibold text-white font-display mb-1">
              Software Engineer Interview Preparation Cards
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Questions technical recruiters and senior engineers ask when reviewing Quizmo on a resume:
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-mono text-indigo-300 font-semibold mb-1">
                  Q1: "How did you achieve the 40% performance improvement in reporting?"
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> "Originally, our reporting endpoint fetched all student submissions to the Node.js server and computed class metrics using JavaScript <code>.map()</code> and <code>.filter()</code> arrays. For a cohort of 300 students with 50 questions, this transferred 15,000 document records over the network and blocked the Node.js event loop during serialization. I re-architected this into a multi-stage MongoDB aggregation pipeline using <code>$match</code>, <code>$unwind</code>, and <code>$facet</code>. By processing computations natively inside MongoDB with compound index <code>{'{ quizId: 1, submittedAt: -1 }'}</code>, payload transfer dropped by 92% and query time fell by 40%."
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-mono text-indigo-300 font-semibold mb-1">
                  Q2: "Why track time deviation rather than just raw time?"
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> "Raw elapsed time is biased by question length and complexity. A student taking 45 seconds on an intricate code tracing question is demonstrating quick fluency, whereas 45 seconds on a simple definition indicates hesitation. Time deviation normalizes candidate performance against the empirical median and standard deviation of peer cohorts (Δt / σ). This allowed us to reliably classify fast guesses (Z &lt; -1.2) and deep cognitive deliberation (Z &gt; +1.5)."
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-mono text-indigo-300 font-semibold mb-1">
                  Q3: "How did you prevent cheating and payload manipulation?"
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> "We adopted a zero-trust client model: the client never knows the correct answer key until after submission. Quiz timers are enforced server-side using signed JWT expiration timestamps rather than trusting client <code>setTimeout</code>. Furthermore, client-side telemetry captured window blur and tab visibility changes to log integrity flags in teacher reports."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
