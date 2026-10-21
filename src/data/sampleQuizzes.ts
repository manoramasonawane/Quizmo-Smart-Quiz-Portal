import { Quiz, StudentSubmission } from '../types/quizmo';

export const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: 'quiz-fullstack-01',
    title: 'Full-Stack Node.js, Express & MongoDB Diagnostics',
    category: 'Full-Stack Web Engineering',
    description: 'Assesses Node.js asynchronous architecture, Express middleware lifecycles, and MongoDB aggregation performance under load.',
    timeLimitMinutes: 10,
    questions: [
      {
        id: 'node-01',
        topic: 'Node.js Event Loop',
        subtopic: 'Phases & Microtasks',
        difficulty: 'medium',
        question: 'In Node.js event loop processing, when does process.nextTick() callbacks execute relative to setImmediate() and Promise microtasks?',
        codeSnippet: `console.log('1');
setTimeout(() => console.log('2'), 0);
setImmediate(() => console.log('3'));
process.nextTick(() => console.log('4'));
Promise.resolve().then(() => console.log('5'));
console.log('6');`,
        options: [
          { id: 'opt-a', text: 'Output: 1, 6, 4, 5, 2, 3 (nextTick executes before Promises and next phase timers)' },
          { id: 'opt-b', text: 'Output: 1, 6, 2, 3, 4, 5 (macrotasks execute before nextTick)' },
          { id: 'opt-c', text: 'Output: 1, 6, 5, 4, 3, 2 (Promise microtask takes precedence over nextTick)' },
          { id: 'opt-d', text: 'Output: 1, 4, 5, 6, 2, 3 (nextTick resolves synchronously before console.log(6))' }
        ],
        correctOptionIndex: 0,
        explanation: 'In Node.js, process.nextTick queue is processed immediately after the current operation completes, before the microtask queue (Promises), and well before macro-task timers or check phase (setImmediate).',
        benchmarkMedianSeconds: 38,
        standardDeviationSeconds: 12
      },
      {
        id: 'mongo-02',
        topic: 'MongoDB Aggregations',
        subtopic: 'Index Optimization & $unwind',
        difficulty: 'hard',
        question: 'Why can an aggregation pipeline featuring an un-indexed $unwind before a $match stage cause severe cluster degradation on large collections?',
        codeSnippet: `// Problematic aggregation pattern
db.orders.aggregate([
  { $unwind: "$items" },
  { $match: { "items.status": "fulfilled", createdAt: { $gte: ISODate("2024-01-01") } } },
  { $group: { _id: "$items.category", revenue: { $sum: "$items.price" } } }
]);`,
        options: [
          { id: 'opt-a', text: 'Unwinding array elements first prevents the engine from utilizing B-tree index scans on createdAt and forces full document array deconstruction in memory' },
          { id: 'opt-b', text: 'MongoDB syntax prohibits $unwind without an explicit $project stage beforehand' },
          { id: 'opt-c', text: '$unwind acquires an exclusive write lock on the collection preventing concurrent read replicas' },
          { id: 'opt-d', text: 'The $group stage will fail with a BSON object overflow limit exceeding 16MB' }
        ],
        correctOptionIndex: 0,
        explanation: 'Placing $match as the very first stage allows MongoDB to leverage indexes to filter down candidate documents before performing memory-intensive $unwind operations.',
        benchmarkMedianSeconds: 45,
        standardDeviationSeconds: 14
      },
      {
        id: 'express-03',
        topic: 'Express.js Architecture',
        subtopic: 'Error Handling Middleware',
        difficulty: 'easy',
        question: 'What is the mandatory function signature that tells Express an error-handling middleware is registered rather than a standard routing handler?',
        codeSnippet: `// Which signature correctly captures unhandled route errors?
app.use((???) => {
  res.status(500).json({ error: 'Internal Server Error' });
});`,
        options: [
          { id: 'opt-a', text: '(err, req, res, next) with exactly 4 formal parameters' },
          { id: 'opt-b', text: '(req, res, next) while attaching err to the req object' },
          { id: 'opt-c', text: '(err, req, res) without the next callback' },
          { id: 'opt-d', text: 'An async function returning a custom Error payload' }
        ],
        correctOptionIndex: 0,
        explanation: 'Express inspects the function.length property. Exactly 4 parameters (err, req, res, next) are required for Express to recognize the middleware as an error handler.',
        benchmarkMedianSeconds: 22,
        standardDeviationSeconds: 7
      },
      {
        id: 'security-04',
        topic: 'Web Security & Auth',
        subtopic: 'JWT & Session Token Storage',
        difficulty: 'medium',
        question: 'When storing JWT authentication tokens in a single-page web application, why is an HttpOnly, Secure, SameSite=Strict cookie preferred over localStorage?',
        options: [
          { id: 'opt-a', text: 'HttpOnly cookies cannot be read by client-side JavaScript, effectively neutralizing Cross-Site Scripting (XSS) token theft' },
          { id: 'opt-b', text: 'HttpOnly cookies encrypt the JWT payload automatically using RSA-4096' },
          { id: 'opt-c', text: 'localStorage has a 4KB capacity limit while cookies support up to 5MB' },
          { id: 'opt-d', text: 'Browsers automatically refresh expired tokens when stored in cookies' }
        ],
        correctOptionIndex: 0,
        explanation: 'Tokens stored in localStorage are directly accessible to any malicious script injected through an XSS vulnerability, whereas HttpOnly cookies cannot be accessed via document.cookie.',
        benchmarkMedianSeconds: 30,
        standardDeviationSeconds: 9
      },
      {
        id: 'react-05',
        topic: 'React & Client State',
        subtopic: 'Reconciliation & Keys',
        difficulty: 'medium',
        question: 'What runtime bug occurs when using array indices as the key prop in dynamic, reorderable lists?',
        codeSnippet: `{items.map((item, index) => (
  <ListItem key={index} data={item} />
))}`,
        options: [
          { id: 'opt-a', text: 'Component local state (e.g. uncontrolled inputs, focus) remains tied to the position rather than the data item, causing visual desync during deletions or reorders' },
          { id: 'opt-b', text: 'React throws a fatal compilation error because indices are reserved keywords' },
          { id: 'opt-c', text: 'Virtual DOM diffing terminates prematurely and skips rendering the list' },
          { id: 'opt-d', text: 'Memory leak occurs because React cannot garbage collect keyed DOM nodes' }
        ],
        correctOptionIndex: 0,
        explanation: 'When items are inserted or reordered, matching keys by index causes React to preserve child component instances and internal state associated with that index rather than the item itself.',
        benchmarkMedianSeconds: 32,
        standardDeviationSeconds: 10
      }
    ]
  },
  {
    id: 'quiz-dsa-02',
    title: 'Data Structures, Algorithms & Complexity',
    category: 'Computer Science Core',
    description: 'Tests asymptotic analysis, recursion call stacks, amortized time complexity, and graph traversal trade-offs.',
    timeLimitMinutes: 10,
    questions: [
      {
        id: 'dsa-01',
        topic: 'Algorithm Analysis',
        subtopic: 'Amortized Complexity',
        difficulty: 'medium',
        question: 'Why does a dynamic array (like JavaScript Array or C++ std::vector) have O(1) amortized insertion time despite an occasional O(n) resize reallocation?',
        options: [
          { id: 'opt-a', text: 'Doubling the capacity upon reaching full limit distributes the O(n) resize cost over n subsequent insertions, making the average cost per push constant' },
          { id: 'opt-b', text: 'Modern CPU hardware predicts array bounds and copies elements in zero cycles' },
          { id: 'opt-c', text: 'The array uses a linked list pointer under the hood to bypass reallocation' },
          { id: 'opt-d', text: 'Memory paging automatically doubles the allocation space without copying existing elements' }
        ],
        correctOptionIndex: 0,
        explanation: 'By using geometric expansion (e.g., doubling capacity), the total cost of all reallocations for N elements is bounded by 2N - 1, which averages to <= 3 operations per insertion (O(1) amortized).',
        benchmarkMedianSeconds: 35,
        standardDeviationSeconds: 11
      },
      {
        id: 'dsa-02',
        topic: 'Graph Theory',
        subtopic: 'BFS vs DFS Traversal',
        difficulty: 'easy',
        question: 'For unweighted graphs, which algorithm guarantees finding the shortest path (minimum edge count) between two vertices?',
        options: [
          { id: 'opt-a', text: 'Breadth-First Search (BFS) using a FIFO queue' },
          { id: 'opt-b', text: 'Depth-First Search (DFS) using recursion or a LIFO stack' },
          { id: 'opt-c', text: 'Topological Sort using Kahn’s in-degree counter' },
          { id: 'opt-d', text: 'Bellman-Ford algorithm with negative cycle detection' }
        ],
        correctOptionIndex: 0,
        explanation: 'BFS explores vertices in order of their distance from the source, layer by layer, ensuring the first time the target vertex is visited is along the shortest path in unweighted graphs.',
        benchmarkMedianSeconds: 20,
        standardDeviationSeconds: 6
      }
    ]
  }
];

export const MOCK_COHORT_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-01',
    quizId: 'quiz-fullstack-01',
    quizTitle: 'Full-Stack Node.js, Express & MongoDB Diagnostics',
    studentId: 'std-101',
    studentName: 'Alex Chen',
    avatarSeed: 'alex',
    submittedAt: '2024-11-14T14:23:10Z',
    responses: [
      {
        questionId: 'node-01',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 34,
        confidenceRating: 5,
        attemptLogs: [{ timestamp: 8000, action: 'select', selectedOptionIndex: 0 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 8.0,
        timeDeviationSeconds: -4.0,
        timeDeviationZScore: -0.33,
        classification: 'effortless_mastery'
      },
      {
        questionId: 'mongo-02',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 42,
        confidenceRating: 4,
        attemptLogs: [
          { timestamp: 12000, action: 'select', selectedOptionIndex: 2 },
          { timestamp: 28000, action: 'change', selectedOptionIndex: 0 }
        ],
        switchesCount: 1,
        firstActionHesitationSeconds: 12.0,
        timeDeviationSeconds: -3.0,
        timeDeviationZScore: -0.21,
        classification: 'effortless_mastery'
      },
      {
        questionId: 'express-03',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 19,
        confidenceRating: 5,
        attemptLogs: [{ timestamp: 4000, action: 'select', selectedOptionIndex: 0 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 4.0,
        timeDeviationSeconds: -3.0,
        timeDeviationZScore: -0.43,
        classification: 'effortless_mastery'
      },
      {
        questionId: 'security-04',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 28,
        confidenceRating: 4,
        attemptLogs: [{ timestamp: 7000, action: 'select', selectedOptionIndex: 0 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 7.0,
        timeDeviationSeconds: -2.0,
        timeDeviationZScore: -0.22,
        classification: 'effortless_mastery'
      },
      {
        questionId: 'react-05',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 31,
        confidenceRating: 4,
        attemptLogs: [{ timestamp: 9000, action: 'select', selectedOptionIndex: 0 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 9.0,
        timeDeviationSeconds: -1.0,
        timeDeviationZScore: -0.1,
        classification: 'effortless_mastery'
      }
    ],
    diagnostics: {
      overallScore: 5,
      maxScore: 5,
      accuracyPercentage: 100,
      calibrationIndex: 95,
      guessingBehaviorRate: 0,
      averageTimeDeviationSeconds: -2.6,
      totalSwitchesCount: 1,
      tabSwitchViolations: 0,
      strengths: [
        { topic: 'Node.js Event Loop', accuracy: 100, confidence: 5.0 },
        { topic: 'MongoDB Aggregations', accuracy: 100, confidence: 4.0 },
        { topic: 'Express.js Architecture', accuracy: 100, confidence: 5.0 },
        { topic: 'Web Security & Auth', accuracy: 100, confidence: 4.0 },
        { topic: 'React & Client State', accuracy: 100, confidence: 4.0 }
      ],
      weaknesses: [],
      cognitiveQuadrantBreakdown: {
        effortlessMastery: 5,
        deliberativeMastery: 0,
        underconfidentMastery: 0,
        overconfidentError: 0,
        rushedGuess: 0,
        strugglingError: 0
      }
    }
  },
  {
    id: 'sub-02',
    quizId: 'quiz-fullstack-01',
    quizTitle: 'Full-Stack Node.js, Express & MongoDB Diagnostics',
    studentId: 'std-102',
    studentName: 'Maya Patel',
    avatarSeed: 'maya',
    submittedAt: '2024-11-14T14:26:40Z',
    responses: [
      {
        questionId: 'node-01',
        selectedOptionIndex: 2,
        isCorrect: false,
        timeSpentSeconds: 49,
        confidenceRating: 5, // High confidence, wrong answer = Overconfident Error / Dunning-Kruger
        attemptLogs: [{ timestamp: 14000, action: 'select', selectedOptionIndex: 2 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 14.0,
        timeDeviationSeconds: 11.0,
        timeDeviationZScore: 0.92,
        classification: 'overconfident_error'
      },
      {
        questionId: 'mongo-02',
        selectedOptionIndex: 1,
        isCorrect: false,
        timeSpentSeconds: 18,
        confidenceRating: 2, // Low confidence, rushed = Rushed Guess
        attemptLogs: [{ timestamp: 4000, action: 'select', selectedOptionIndex: 1 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 4.0,
        timeDeviationSeconds: -27.0,
        timeDeviationZScore: -1.93,
        classification: 'rushed_guess'
      },
      {
        questionId: 'express-03',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 24,
        confidenceRating: 5,
        attemptLogs: [{ timestamp: 5000, action: 'select', selectedOptionIndex: 0 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 5.0,
        timeDeviationSeconds: 2.0,
        timeDeviationZScore: 0.29,
        classification: 'effortless_mastery'
      },
      {
        questionId: 'security-04',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 46,
        confidenceRating: 2, // Low confidence, correct = Underconfident Mastery
        attemptLogs: [
          { timestamp: 10000, action: 'select', selectedOptionIndex: 2 },
          { timestamp: 35000, action: 'change', selectedOptionIndex: 0 }
        ],
        switchesCount: 1,
        firstActionHesitationSeconds: 10.0,
        timeDeviationSeconds: 16.0,
        timeDeviationZScore: 1.78,
        classification: 'underconfident_mastery'
      },
      {
        questionId: 'react-05',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 30,
        confidenceRating: 4,
        attemptLogs: [{ timestamp: 8000, action: 'select', selectedOptionIndex: 0 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 8.0,
        timeDeviationSeconds: -2.0,
        timeDeviationZScore: -0.2,
        classification: 'effortless_mastery'
      }
    ],
    diagnostics: {
      overallScore: 3,
      maxScore: 5,
      accuracyPercentage: 60,
      calibrationIndex: 58,
      guessingBehaviorRate: 20,
      averageTimeDeviationSeconds: 0.0,
      totalSwitchesCount: 1,
      tabSwitchViolations: 1,
      strengths: [
        { topic: 'Express.js Architecture', accuracy: 100, confidence: 5.0 },
        { topic: 'React & Client State', accuracy: 100, confidence: 4.0 }
      ],
      weaknesses: [
        {
          topic: 'Node.js Event Loop',
          accuracy: 0,
          confidence: 5.0,
          recommendation: 'Targeted unlearning: Student exhibits high certainty on mistaken nextTick execution order.'
        },
        {
          topic: 'MongoDB Aggregations',
          accuracy: 0,
          confidence: 2.0,
          recommendation: 'Confidence rebuilding: Student rushed through array pipeline mechanics (<18s).'
        }
      ],
      cognitiveQuadrantBreakdown: {
        effortlessMastery: 2,
        deliberativeMastery: 0,
        underconfidentMastery: 1,
        overconfidentError: 1,
        rushedGuess: 1,
        strugglingError: 0
      }
    }
  },
  {
    id: 'sub-03',
    quizId: 'quiz-fullstack-01',
    quizTitle: 'Full-Stack Node.js, Express & MongoDB Diagnostics',
    studentId: 'std-103',
    studentName: 'Marcus Wright',
    avatarSeed: 'marcus',
    submittedAt: '2024-11-14T14:31:05Z',
    responses: [
      {
        questionId: 'node-01',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 58,
        confidenceRating: 4,
        attemptLogs: [
          { timestamp: 15000, action: 'select', selectedOptionIndex: 2 },
          { timestamp: 40000, action: 'change', selectedOptionIndex: 0 }
        ],
        switchesCount: 1,
        firstActionHesitationSeconds: 15.0,
        timeDeviationSeconds: 20.0,
        timeDeviationZScore: 1.67,
        classification: 'deliberative_mastery'
      },
      {
        questionId: 'mongo-02',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 62,
        confidenceRating: 4,
        attemptLogs: [
          { timestamp: 20000, action: 'select', selectedOptionIndex: 3 },
          { timestamp: 45000, action: 'change', selectedOptionIndex: 0 }
        ],
        switchesCount: 1,
        firstActionHesitationSeconds: 20.0,
        timeDeviationSeconds: 17.0,
        timeDeviationZScore: 1.21,
        classification: 'deliberative_mastery'
      },
      {
        questionId: 'express-03',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 23,
        confidenceRating: 5,
        attemptLogs: [{ timestamp: 4000, action: 'select', selectedOptionIndex: 0 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 4.0,
        timeDeviationSeconds: 1.0,
        timeDeviationZScore: 0.14,
        classification: 'effortless_mastery'
      },
      {
        questionId: 'security-04',
        selectedOptionIndex: 1,
        isCorrect: false,
        timeSpentSeconds: 52,
        confidenceRating: 2,
        attemptLogs: [
          { timestamp: 12000, action: 'select', selectedOptionIndex: 2 },
          { timestamp: 30000, action: 'change', selectedOptionIndex: 1 }
        ],
        switchesCount: 1,
        firstActionHesitationSeconds: 12.0,
        timeDeviationSeconds: 22.0,
        timeDeviationZScore: 2.44,
        classification: 'struggling_error'
      },
      {
        questionId: 'react-05',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 33,
        confidenceRating: 4,
        attemptLogs: [{ timestamp: 7000, action: 'select', selectedOptionIndex: 0 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 7.0,
        timeDeviationSeconds: 1.0,
        timeDeviationZScore: 0.1,
        classification: 'effortless_mastery'
      }
    ],
    diagnostics: {
      overallScore: 4,
      maxScore: 5,
      accuracyPercentage: 80,
      calibrationIndex: 78,
      guessingBehaviorRate: 0,
      averageTimeDeviationSeconds: 12.2,
      totalSwitchesCount: 3,
      tabSwitchViolations: 0,
      strengths: [
        { topic: 'Node.js Event Loop', accuracy: 100, confidence: 4.0 },
        { topic: 'MongoDB Aggregations', accuracy: 100, confidence: 4.0 },
        { topic: 'Express.js Architecture', accuracy: 100, confidence: 5.0 },
        { topic: 'React & Client State', accuracy: 100, confidence: 4.0 }
      ],
      weaknesses: [
        {
          topic: 'Web Security & Auth',
          accuracy: 0,
          confidence: 2.0,
          recommendation: 'Hesitation & switching observed: Review cookie flags and XSS vs CSRF threat models.'
        }
      ],
      cognitiveQuadrantBreakdown: {
        effortlessMastery: 2,
        deliberativeMastery: 2,
        underconfidentMastery: 0,
        overconfidentError: 0,
        rushedGuess: 0,
        strugglingError: 1
      }
    }
  },
  {
    id: 'sub-04',
    quizId: 'quiz-fullstack-01',
    quizTitle: 'Full-Stack Node.js, Express & MongoDB Diagnostics',
    studentId: 'std-104',
    studentName: 'Elena Rostova',
    avatarSeed: 'elena',
    submittedAt: '2024-11-14T14:38:12Z',
    responses: [
      {
        questionId: 'node-01',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 31,
        confidenceRating: 5,
        attemptLogs: [{ timestamp: 6000, action: 'select', selectedOptionIndex: 0 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 6.0,
        timeDeviationSeconds: -7.0,
        timeDeviationZScore: -0.58,
        classification: 'effortless_mastery'
      },
      {
        questionId: 'mongo-02',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 39,
        confidenceRating: 5,
        attemptLogs: [{ timestamp: 8000, action: 'select', selectedOptionIndex: 0 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 8.0,
        timeDeviationSeconds: -6.0,
        timeDeviationZScore: -0.43,
        classification: 'effortless_mastery'
      },
      {
        questionId: 'express-03',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 18,
        confidenceRating: 5,
        attemptLogs: [{ timestamp: 3000, action: 'select', selectedOptionIndex: 0 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 3.0,
        timeDeviationSeconds: -4.0,
        timeDeviationZScore: -0.57,
        classification: 'effortless_mastery'
      },
      {
        questionId: 'security-04',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 27,
        confidenceRating: 5,
        attemptLogs: [{ timestamp: 5000, action: 'select', selectedOptionIndex: 0 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 5.0,
        timeDeviationSeconds: -3.0,
        timeDeviationZScore: -0.33,
        classification: 'effortless_mastery'
      },
      {
        questionId: 'react-05',
        selectedOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 29,
        confidenceRating: 5,
        attemptLogs: [{ timestamp: 7000, action: 'select', selectedOptionIndex: 0 }],
        switchesCount: 0,
        firstActionHesitationSeconds: 7.0,
        timeDeviationSeconds: -3.0,
        timeDeviationZScore: -0.3,
        classification: 'effortless_mastery'
      }
    ],
    diagnostics: {
      overallScore: 5,
      maxScore: 5,
      accuracyPercentage: 100,
      calibrationIndex: 100,
      guessingBehaviorRate: 0,
      averageTimeDeviationSeconds: -4.6,
      totalSwitchesCount: 0,
      tabSwitchViolations: 0,
      strengths: [
        { topic: 'Node.js Event Loop', accuracy: 100, confidence: 5.0 },
        { topic: 'MongoDB Aggregations', accuracy: 100, confidence: 5.0 },
        { topic: 'Express.js Architecture', accuracy: 100, confidence: 5.0 },
        { topic: 'Web Security & Auth', accuracy: 100, confidence: 5.0 },
        { topic: 'React & Client State', accuracy: 100, confidence: 5.0 }
      ],
      weaknesses: [],
      cognitiveQuadrantBreakdown: {
        effortlessMastery: 5,
        deliberativeMastery: 0,
        underconfidentMastery: 0,
        overconfidentError: 0,
        rushedGuess: 0,
        strugglingError: 0
      }
    }
  }
];
