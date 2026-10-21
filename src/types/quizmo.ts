export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;

export interface QuestionOption {
  id: string;
  text: string;
  codeSnippet?: string;
}

export interface Question {
  id: string;
  topic: string;
  subtopic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  codeSnippet?: string;
  options: QuestionOption[];
  correctOptionIndex: number;
  explanation: string;
  benchmarkMedianSeconds: number;
  standardDeviationSeconds: number;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  description: string;
  timeLimitMinutes: number;
  questions: Question[];
}

export interface AttemptLogEvent {
  timestamp: number; // ms since question started
  action: 'first_view' | 'select' | 'change' | 'clear' | 'hesitate';
  selectedOptionIndex?: number;
  previousOptionIndex?: number;
}

export type CognitiveClassification =
  | 'effortless_mastery'    // High accuracy, high confidence, fast/optimal time
  | 'deliberative_mastery'  // High accuracy, moderate/high confidence, slow deliberate time
  | 'underconfident_mastery'// High accuracy, low confidence (hesitant, second-guessing)
  | 'overconfident_error'   // Low accuracy, high confidence (misconception / Dunning-Kruger)
  | 'rushed_guess'          // Low accuracy, low confidence, very fast time (<40% benchmark)
  | 'struggling_error';     // Low accuracy, low confidence, slow time (>150% benchmark)

export interface QuestionResponse {
  questionId: string;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  confidenceRating: ConfidenceLevel;
  attemptLogs: AttemptLogEvent[];
  switchesCount: number;
  firstActionHesitationSeconds: number;
  timeDeviationSeconds: number; // timeSpent - benchmarkMedian
  timeDeviationZScore: number;  // (timeSpent - benchmarkMedian) / stdDev
  classification: CognitiveClassification;
}

export interface DiagnosticSummary {
  overallScore: number;
  maxScore: number;
  accuracyPercentage: number;
  calibrationIndex: number; // 0 to 100% (alignment between confidence and correctness)
  guessingBehaviorRate: number; // % of questions identified as guessing
  averageTimeDeviationSeconds: number;
  totalSwitchesCount: number;
  tabSwitchViolations: number;
  strengths: { topic: string; accuracy: number; confidence: number }[];
  weaknesses: { topic: string; accuracy: number; confidence: number; recommendation: string }[];
  cognitiveQuadrantBreakdown: {
    effortlessMastery: number;
    deliberativeMastery: number;
    underconfidentMastery: number;
    overconfidentError: number;
    rushedGuess: number;
    strugglingError: number;
  };
}

export interface StudentSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  avatarSeed: string;
  submittedAt: string;
  responses: QuestionResponse[];
  diagnostics: DiagnosticSummary;
}

export interface CohortMetrics {
  totalStudents: number;
  classAverageScore: number;
  averageCalibrationScore: number;
  averageCompletionTimeSeconds: number;
  guessingIncidenceRate: number;
  topicBreakdown: {
    topic: string;
    averageScore: number;
    averageConfidence: number;
    averageTimeDeviation: number;
    difficultyLevel: string;
  }[];
}
