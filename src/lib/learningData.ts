// Mock data for the learning flow: Subject → Chapter → Lesson.
// Consumed only by services/apiClient.ts

export type Lesson = {
  id: string;
  title: string;
  duration: string; // e.g. "8:24"
  watched: boolean;
  videoUrl: string;
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  description: string;
  progress: number; // 0-100
  lessons: Lesson[];
};

export type SubjectFull = {
  id: string;
  name: string;
  icon: string;
  color: string;
  chapters: Chapter[];
};

const sampleVideo =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const makeLessons = (chapterId: string, count: number, watchedUpTo: number): Lesson[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${chapterId}-l${i + 1}`,
    title: [
      "Introduction & key ideas",
      "Worked examples",
      "Common mistakes",
      "Practice walkthrough",
      "Quick recap",
    ][i % 5],
    duration: ["6:12", "8:24", "5:48", "10:02", "4:30"][i % 5],
    watched: i < watchedUpTo,
    videoUrl: sampleVideo,
  }));

export const SUBJECTS_FULL: SubjectFull[] = [
  {
    id: "math",
    name: "Mathematics",
    icon: "Sigma",
    color: "purple",
    chapters: [
      {
        id: "math-c1",
        number: 1,
        title: "Real Numbers",
        description:
          "Understand rational, irrational numbers, Euclid's lemma and the fundamental theorem of arithmetic.",
        progress: 100,
        lessons: makeLessons("math-c1", 4, 4),
      },
      {
        id: "math-c2",
        number: 2,
        title: "Polynomials",
        description:
          "Zeros of polynomials, division algorithm, and relationship between coefficients and zeros.",
        progress: 60,
        lessons: makeLessons("math-c2", 5, 3),
      },
      {
        id: "math-c3",
        number: 3,
        title: "Pair of Linear Equations",
        description:
          "Graphical and algebraic methods, substitution, elimination, and cross-multiplication.",
        progress: 0,
        lessons: makeLessons("math-c3", 5, 0),
      },
      {
        id: "math-c4",
        number: 4,
        title: "Quadratic Equations",
        description:
          "Standard form, factoring, completing the square, and the quadratic formula.",
        progress: 0,
        lessons: makeLessons("math-c4", 4, 0),
      },
      {
        id: "math-c5",
        number: 5,
        title: "Arithmetic Progressions",
        description:
          "nth term, sum of n terms, and applications of arithmetic progressions.",
        progress: 0,
        lessons: makeLessons("math-c5", 4, 0),
      },
      {
        id: "math-c6",
        number: 6,
        title: "Triangles",
        description:
          "Similarity, criteria for similarity, and the Pythagoras theorem.",
        progress: 0,
        lessons: makeLessons("math-c6", 5, 0),
      },
    ],
  },
  {
    id: "science",
    name: "Science",
    icon: "FlaskConical",
    color: "teal",
    chapters: [
      {
        id: "sci-c1",
        number: 1,
        title: "Chemical Reactions",
        description:
          "Types of reactions, balancing chemical equations, and oxidation-reduction.",
        progress: 100,
        lessons: makeLessons("sci-c1", 4, 4),
      },
      {
        id: "sci-c2",
        number: 2,
        title: "Acids, Bases & Salts",
        description: "pH scale, neutralisation reactions, and everyday chemistry.",
        progress: 40,
        lessons: makeLessons("sci-c2", 5, 2),
      },
      {
        id: "sci-c3",
        number: 3,
        title: "Metals & Non-metals",
        description: "Physical & chemical properties, reactivity series, corrosion.",
        progress: 0,
        lessons: makeLessons("sci-c3", 4, 0),
      },
      {
        id: "sci-c4",
        number: 4,
        title: "Life Processes",
        description: "Nutrition, respiration, transportation, and excretion in organisms.",
        progress: 0,
        lessons: makeLessons("sci-c4", 5, 0),
      },
    ],
  },
  {
    id: "english",
    name: "English",
    icon: "BookOpen",
    color: "pink",
    chapters: [
      {
        id: "eng-c1",
        number: 1,
        title: "A Letter to God",
        description: "Story analysis, theme of faith, and character study.",
        progress: 100,
        lessons: makeLessons("eng-c1", 3, 3),
      },
      {
        id: "eng-c2",
        number: 2,
        title: "Nelson Mandela",
        description: "Long Walk to Freedom — historical context and key passages.",
        progress: 80,
        lessons: makeLessons("eng-c2", 4, 3),
      },
      {
        id: "eng-c3",
        number: 3,
        title: "Two Stories About Flying",
        description: "Comparative reading and figurative language.",
        progress: 0,
        lessons: makeLessons("eng-c3", 4, 0),
      },
    ],
  },
  {
    id: "social",
    name: "Social Studies",
    icon: "Globe2",
    color: "amber",
    chapters: [
      {
        id: "soc-c1",
        number: 1,
        title: "The Rise of Nationalism",
        description: "European nationalism, the French Revolution, and key thinkers.",
        progress: 70,
        lessons: makeLessons("soc-c1", 4, 3),
      },
      {
        id: "soc-c2",
        number: 2,
        title: "Resources and Development",
        description: "Classification of resources, sustainable development.",
        progress: 0,
        lessons: makeLessons("soc-c2", 4, 0),
      },
    ],
  },
  {
    id: "hindi",
    name: "Hindi",
    icon: "Languages",
    color: "rose",
    chapters: [
      {
        id: "hin-c1",
        number: 1,
        title: "सूरदास के पद",
        description: "भक्ति काव्य परंपरा और सूरदास की रचनाओं का अध्ययन।",
        progress: 100,
        lessons: makeLessons("hin-c1", 3, 3),
      },
      {
        id: "hin-c2",
        number: 2,
        title: "तुलसीदास",
        description: "रामचरितमानस के चुने हुए दोहे और चौपाइयाँ।",
        progress: 30,
        lessons: makeLessons("hin-c2", 4, 1),
      },
      {
        id: "hin-c3",
        number: 3,
        title: "देव",
        description: "रीतिकालीन काव्य की विशेषताएँ।",
        progress: 0,
        lessons: makeLessons("hin-c3", 3, 0),
      },
    ],
  },
  {
    id: "computer",
    name: "Computer",
    icon: "Cpu",
    color: "cyan",
    chapters: [
      {
        id: "cs-c1",
        number: 1,
        title: "Number Systems",
        description: "Binary, decimal, hex conversions and arithmetic.",
        progress: 100,
        lessons: makeLessons("cs-c1", 3, 3),
      },
      {
        id: "cs-c2",
        number: 2,
        title: "Intro to Python",
        description: "Variables, types, expressions, and basic I/O.",
        progress: 100,
        lessons: makeLessons("cs-c2", 5, 5),
      },
      {
        id: "cs-c3",
        number: 3,
        title: "Conditionals & Loops",
        description: "if/else, for, while, and pattern problems.",
        progress: 50,
        lessons: makeLessons("cs-c3", 4, 2),
      },
    ],
  },
];

export const CONCEPT_MAP_NODES = [
  { id: "current", label: "Polynomials", x: 50, y: 50, kind: "current" as const },
  { id: "n1", label: "Real Numbers", x: 15, y: 25, kind: "prereq" as const },
  { id: "n2", label: "Algebraic Identities", x: 18, y: 75, kind: "prereq" as const },
  { id: "n3", label: "Quadratic Equations", x: 85, y: 30, kind: "next" as const },
  { id: "n4", label: "Linear Equations", x: 82, y: 78, kind: "next" as const },
];

export const SAMPLE_NOTES = {
  en: `### Polynomials — Quick Notes

A **polynomial** in one variable x is an expression of the form
\`p(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + … + a₁x + a₀\`
where the coefficients are real numbers and n is a non-negative integer.

**Key terms**
- *Degree*: highest power of x
- *Zero*: value of x where p(x) = 0
- *Linear*: degree 1 · *Quadratic*: degree 2 · *Cubic*: degree 3

**Relationship between zeros and coefficients**
For a quadratic ax² + bx + c with zeros α and β:
- α + β = −b/a
- αβ = c/a`,
  hi: `### बहुपद — मुख्य बिंदु

एक चर **x** में बहुपद इस रूप का व्यंजक है:
\`p(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + … + a₁x + a₀\`
जहाँ गुणांक वास्तविक संख्याएँ हैं और n एक अऋणात्मक पूर्णांक है।

**मुख्य शब्द**
- *घात*: x का सर्वोच्च घात
- *शून्यक*: वह मान जहाँ p(x) = 0
- *रैखिक*: घात 1 · *द्विघात*: घात 2 · *त्रिघात*: घात 3

**शून्यक और गुणांकों का संबंध**
ax² + bx + c के शून्यक α और β हों तो:
- α + β = −b/a
- αβ = c/a`,
};

export const SAMPLE_MCQS = [
  {
    id: "q1",
    q: "If α and β are the zeros of x² − 5x + 6, then α + β equals:",
    options: ["5", "-5", "6", "-6"],
    correct: 0,
  },
  {
    id: "q2",
    q: "Degree of the polynomial 4x³ − 2x + 7 is:",
    options: ["1", "2", "3", "4"],
    correct: 2,
  },
  {
    id: "q3",
    q: "A quadratic polynomial has at most how many zeros?",
    options: ["1", "2", "3", "Infinite"],
    correct: 1,
  },
];

export const SAMPLE_BOOKMARKS = [
  { id: "b1", time: "2:14", title: "Definition of degree" },
  { id: "b2", time: "5:48", title: "Sum & product of zeros formula" },
];

// ── Advanced AI / Gamification mocks ──────────────────────────────

export const SOCRATIC_SEED = [
  {
    role: "ai" as const,
    text: "Let's not jump to the answer. What does 'zero of a polynomial' mean to you?",
  },
];

export const AUTOPSY_RESULT = {
  testTitle: "Polynomials — Mock Test 2",
  score: 6,
  total: 10,
  conceptGap: "Relationship between zeros and coefficients",
  weakness:
    "You consistently flipped the sign of α + β. The formula is α + β = −b/a, not b/a.",
  suggestedVideos: [
    { id: "v1", title: "Sum & product of zeros — visual proof", duration: "7:12" },
    { id: "v2", title: "5 trap questions on quadratic zeros", duration: "9:40" },
  ],
  questionBreakdown: [
    { q: "Q1 · zeros of x²−5x+6", correct: true },
    { q: "Q2 · α+β for 2x²+3x−5", correct: false, reason: "Sign error" },
    { q: "Q3 · degree of polynomial", correct: true },
    { q: "Q4 · αβ for x²+7x+12", correct: true },
    { q: "Q5 · find quadratic with zeros 2,3", correct: false, reason: "Concept gap" },
  ],
};

export const COGNITIVE_INSIGHTS = {
  headline: "You score 20% higher in morning sessions ☀️",
  bestTime: "07:00 – 09:30",
  focusByHour: [
    { hour: "6a", focus: 70 },
    { hour: "8a", focus: 92 },
    { hour: "10a", focus: 84 },
    { hour: "12p", focus: 60 },
    { hour: "2p", focus: 55 },
    { hour: "4p", focus: 68 },
    { hour: "6p", focus: 78 },
    { hour: "9p", focus: 50 },
  ],
  insights: [
    "You watch 38% more video time on Mondays.",
    "Your accuracy drops 22% after 11pm — try sleeping earlier.",
    "Math accuracy is highest right after a 5-min break.",
  ],
};
