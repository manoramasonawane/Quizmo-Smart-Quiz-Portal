import {
  CognitiveClassification,
  ConfidenceLevel,
  DiagnosticSummary,
  Question,
  QuestionResponse,
  StudentSubmission
} from '../types/quizmo';

/**
 * Metric 1: Confidence Calibration Index (CCI)
 * Measures meta-cognitive awareness. A high calibration score means the student
 * is accurately assessing what they do and do not know.
 */
export function calculateConfidenceScore(
  confidenceRating: ConfidenceLevel,
  isCorrect: boolean
): { calibrationGap: number; normalizedConfidence: number } {
  // Normalize confidence (1-5) to 0.0 - 1.0
  const normalizedConfidence = (confidenceRating - 1) / 4;
  const targetAccuracy = isCorrect ? 1.0 : 0.0;
  
  // Gap represents misalignment: 0 is perfect calibration, 1 is total miscalibration
  const calibrationGap = Math.abs(targetAccuracy - normalizedConfidence);
  return { calibrationGap, normalizedConfidence };
}

/**
 * Metric 2 & 3: Attempt Pattern & Time Deviation Classification
 * Combines response accuracy, confidence rating, attempt switching behavior,
 * and time-variance from cohort benchmark.
 */
export function classifyResponseCognition(
  isCorrect: boolean,
  confidenceRating: ConfidenceLevel,
  timeSpentSeconds: number,
  benchmarkMedianSeconds: number,
  stdDevSeconds: number,
  switchesCount: number,
  _hesitationSeconds: number
): {
  classification: CognitiveClassification;
  timeDeviationSeconds: number;
  timeDeviationZScore: number;
} {
  const timeDeviationSeconds = Math.round((timeSpentSeconds - benchmarkMedianSeconds) * 10) / 10;
  const timeDeviationZScore = stdDevSeconds > 0
    ? Math.round(((timeSpentSeconds - benchmarkMedianSeconds) / stdDevSeconds) * 100) / 100
    : 0;

  let classification: CognitiveClassification;

  if (isCorrect) {
    if (confidenceRating >= 4) {
      if (timeDeviationZScore <= 0.4 && switchesCount <= 1) {
        classification = 'effortless_mastery';
      } else {
        classification = 'deliberative_mastery';
      }
    } else {
      // Correct but low confidence: student knows the material but doubts themselves
      classification = 'underconfident_mastery';
    }
  } else {
    // Incorrect answer
    if (confidenceRating >= 4) {
      // High confidence but wrong: strong misconception (Dunning-Kruger trap)
      classification = 'overconfident_error';
    } else if (timeDeviationZScore <= -0.8 || (timeSpentSeconds < benchmarkMedianSeconds * 0.45 && switchesCount === 0)) {
      // Very fast answer with low confidence: rushed or wild guess
      classification = 'rushed_guess';
    } else {
      // Low confidence, spent significant time or multiple switches: struggling error
      classification = 'struggling_error';
    }
  }

  return {
    classification,
    timeDeviationSeconds,
    timeDeviationZScore
  };
}

/**
 * Generates comprehensive Diagnostic Summary for a completed quiz
 */
export function generateDiagnosticSummary(
  questions: Question[],
  responses: QuestionResponse[],
  tabSwitchViolations: number = 0
): DiagnosticSummary {
  let correctCount = 0;
  let totalCalibrationSum = 0;
  let guessingCount = 0;
  let totalTimeDev = 0;
  let totalSwitches = 0;

  const quadrantCounts = {
    effortlessMastery: 0,
    deliberativeMastery: 0,
    underconfidentMastery: 0,
    overconfidentError: 0,
    rushedGuess: 0,
    strugglingError: 0,
  };

  const topicMap: Record<
    string,
    { total: number; correct: number; confidenceSum: number; timeDevSum: number }
  > = {};

  responses.forEach((resp) => {
    const q = questions.find((item) => item.id === resp.questionId);
    if (!q) return;

    if (resp.isCorrect) correctCount++;
    totalSwitches += resp.switchesCount;
    totalTimeDev += resp.timeDeviationSeconds;

    const { calibrationGap } = calculateConfidenceScore(resp.confidenceRating, resp.isCorrect);
    // Calibration index component: 1 - gap (range 0 to 1)
    totalCalibrationSum += (1 - calibrationGap);

    if (resp.classification === 'rushed_guess' || (resp.confidenceRating <= 2 && !resp.isCorrect)) {
      guessingCount++;
    }

    // Quadrant counters
    switch (resp.classification) {
      case 'effortless_mastery': quadrantCounts.effortlessMastery++; break;
      case 'deliberative_mastery': quadrantCounts.deliberativeMastery++; break;
      case 'underconfident_mastery': quadrantCounts.underconfidentMastery++; break;
      case 'overconfident_error': quadrantCounts.overconfidentError++; break;
      case 'rushed_guess': quadrantCounts.rushedGuess++; break;
      case 'struggling_error': quadrantCounts.strugglingError++; break;
    }

    // Topic aggregator
    if (!topicMap[q.topic]) {
      topicMap[q.topic] = { total: 0, correct: 0, confidenceSum: 0, timeDevSum: 0 };
    }
    topicMap[q.topic].total += 1;
    if (resp.isCorrect) topicMap[q.topic].correct += 1;
    topicMap[q.topic].confidenceSum += resp.confidenceRating;
    topicMap[q.topic].timeDevSum += resp.timeDeviationSeconds;
  });

  const totalQuestions = questions.length || 1;
  const overallScore = correctCount;
  const accuracyPercentage = Math.round((correctCount / totalQuestions) * 100);
  const calibrationIndex = Math.round((totalCalibrationSum / totalQuestions) * 100);
  const guessingBehaviorRate = Math.round((guessingCount / totalQuestions) * 100);
  const averageTimeDeviationSeconds = Math.round((totalTimeDev / totalQuestions) * 10) / 10;

  const strengths: { topic: string; accuracy: number; confidence: number }[] = [];
  const weaknesses: { topic: string; accuracy: number; confidence: number; recommendation: string }[] = [];

  Object.entries(topicMap).forEach(([topic, data]) => {
    const acc = Math.round((data.correct / data.total) * 100);
    const avgConf = Math.round((data.confidenceSum / data.total) * 10) / 10;
    
    if (acc >= 75) {
      strengths.push({ topic, accuracy: acc, confidence: avgConf });
    } else {
      let rec = 'Review core fundamentals and algorithmic dry-runs.';
      if (avgConf >= 3.8) {
        rec = 'Address conceptual misconceptions: review edge cases and anti-patterns where confidence was ungrounded.';
      } else if (acc >= 50 && avgConf < 2.5) {
        rec = 'Reinforce confidence through timed practice drills; knowledge is present but second-guessing adds friction.';
      } else {
        rec = 'High cognitive load detected. Schedule targeted diagnostic review with foundational code walkthroughs.';
      }
      weaknesses.push({ topic, accuracy: acc, confidence: avgConf, recommendation: rec });
    }
  });

  return {
    overallScore,
    maxScore: totalQuestions,
    accuracyPercentage,
    calibrationIndex,
    guessingBehaviorRate,
    averageTimeDeviationSeconds,
    totalSwitchesCount: totalSwitches,
    tabSwitchViolations,
    strengths,
    weaknesses,
    cognitiveQuadrantBreakdown: quadrantCounts,
  };
}

/**
 * MongoDB Aggregation Pipeline Mock Representation
 * Explains how Quizmo executes high-performance aggregation pipelines on MongoDB.
 */
export const MONGO_AGGREGATION_PIPELINE_CODE = `
// MongoDB Aggregation Pipeline: Teacher Diagnostic Analytics Engine
// Optimized via compound index: { quizId: 1, submittedAt: -1, "responses.questionId": 1 }
db.submissions.aggregate([
  // Step 1: Filter by target quiz and date window
  {
    $match: {
      quizId: ObjectId("64f1a8c9e0123456789abcde"),
      submittedAt: { $gte: ISODate("2024-09-01T00:00:00Z") }
    }
  },

  // Step 2: Unwind responses array for granular question-level analysis
  { $unwind: "$responses" },

  // Step 3: Compute normalized confidence and deviation variance per response
  {
    $addFields: {
      "responses.normalizedConf": {
        $divide: [{ $subtract: ["$responses.confidenceRating", 1] }, 4]
      },
      "responses.isCalibrated": {
        $lte: [
          {
            $abs: {
              $subtract: [
                { $cond: ["$responses.isCorrect", 1.0, 0.0] },
                { $divide: [{ $subtract: ["$responses.confidenceRating", 1] }, 4] }
              ]
            }
          },
          0.25
        ]
      }
    }
  },

  // Step 4: Multi-facet aggregation to deliver cohort benchmarks & topic diagnostic matrix simultaneously
  {
    $facet: {
      // Cohort Summary Metrics
      cohortKPIs: [
        {
          $group: {
            _id: "$studentId",
            studentScore: { $avg: { $cond: ["$responses.isCorrect", 100, 0] } },
            studentAvgConf: { $avg: "$responses.confidenceRating" },
            studentAvgTimeDev: { $avg: "$responses.timeDeviationSeconds" },
            studentSwitches: { $sum: "$responses.switchesCount" }
          }
        },
        {
          $group: {
            _id: null,
            totalStudents: { $sum: 1 },
            classAverageScore: { $avg: "$studentScore" },
            classAverageConfidence: { $avg: "$studentAvgConf" },
            classAverageTimeDeviation: { $avg: "$studentAvgTimeDev" }
          }
        }
      ],

      // Topic-level Knowledge Gap Matrix
      topicBreakdown: [
        {
          $group: {
            _id: "$responses.topic",
            totalAttempts: { $sum: 1 },
            correctAttempts: { $sum: { $cond: ["$responses.isCorrect", 1, 0] } },
            avgConfidence: { $avg: "$responses.confidenceRating" },
            avgTimeDeviation: { $avg: "$responses.timeDeviationSeconds" },
            guessingRate: {
              $avg: {
                $cond: [
                  { $and: [{ $eq: ["$responses.isCorrect", false] }, { $lte: ["$responses.confidenceRating", 2] }] },
                  100,
                  0
                ]
              }
            }
          }
        },
        {
          $project: {
            topic: "$_id",
            accuracyRate: { $multiply: [{ $divide: ["$correctAttempts", "$totalAttempts"] }, 100] },
            avgConfidence: { $round: ["$avgConfidence", 2] },
            avgTimeDeviation: { $round: ["$avgTimeDeviation", 1] },
            guessingRate: { $round: ["$guessingRate", 1] }
          }
        },
        { $sort: { accuracyRate: 1 } } // Prioritize weakest topics for teacher intervention
      ],

      // Cognitive Quadrant Distribution
      cognitiveDistribution: [
        {
          $group: {
            _id: "$responses.classification",
            count: { $sum: 1 }
          }
        }
      ]
    }
  }
]);
`;

/**
 * Simulates running the MongoDB aggregation pipeline on sample student records
 */
export function executeSampleAggregation(submissions: StudentSubmission[]) {
  const startTime = performance.now();
  
  const totalSubmissions = submissions.length;
  let scoreSum = 0;
  let confSum = 0;
  let timeDevSum = 0;
  let calibrationSum = 0;
  let guessingSum = 0;

  const topicStats: Record<string, { total: number; correct: number; confSum: number; devSum: number; guessCount: number }> = {};
  const classificationCounts: Record<string, number> = {};

  submissions.forEach(sub => {
    scoreSum += sub.diagnostics.accuracyPercentage;
    calibrationSum += sub.diagnostics.calibrationIndex;
    guessingSum += sub.diagnostics.guessingBehaviorRate;

    sub.responses.forEach(resp => {
      confSum += resp.confidenceRating;
      timeDevSum += resp.timeDeviationSeconds;
      classificationCounts[resp.classification] = (classificationCounts[resp.classification] || 0) + 1;

      // Extract topic from question ID or fallback
      const topic = resp.questionId.split('-')[0].toUpperCase();
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, correct: 0, confSum: 0, devSum: 0, guessCount: 0 };
      }
      topicStats[topic].total++;
      if (resp.isCorrect) topicStats[topic].correct++;
      topicStats[topic].confSum += resp.confidenceRating;
      topicStats[topic].devSum += resp.timeDeviationSeconds;
      if (resp.classification === 'rushed_guess') topicStats[topic].guessCount++;
    });
  });

  const totalResponses = totalSubmissions * (submissions[0]?.responses.length || 1);
  const execTimeMs = Math.round((performance.now() - startTime + 8.4) * 10) / 10;

  return {
    executionTimeMs: execTimeMs,
    matchedDocuments: totalSubmissions,
    totalResponsesProcessed: totalResponses,
    classAverageScore: Math.round(scoreSum / totalSubmissions),
    averageCalibrationIndex: Math.round(calibrationSum / totalSubmissions),
    averageConfidence: Math.round((confSum / totalResponses) * 10) / 10,
    averageTimeDeviation: Math.round((timeDevSum / totalResponses) * 10) / 10,
    averageGuessingRate: Math.round(guessingSum / totalSubmissions),
    classificationCounts,
    topicResults: Object.entries(topicStats).map(([topic, stat]) => ({
      topic,
      accuracyRate: Math.round((stat.correct / stat.total) * 100),
      avgConfidence: Math.round((stat.confSum / stat.total) * 10) / 10,
      avgTimeDeviation: Math.round((stat.devSum / stat.total) * 10) / 10,
      guessingRate: Math.round((stat.guessCount / stat.total) * 100),
    })),
  };
}
