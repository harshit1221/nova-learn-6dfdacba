/**
 * Centralized API client.
 * All network calls in the app MUST go through this file.
 *
 * Currently every function returns mock data after a simulated network delay
 * so that loading states (spinners / skeletons) can be exercised.
 *
 * Each function is wrapped in a TODO block showing exactly how to swap the
 * mock implementation for a real fetch/axios call once the backend is ready.
 */
import {
  MOCK_USER,
  CLASSES,
  COUPONS,
  SUBJECTS,
  LEADERBOARD,
  TOP_XP,
  DAILY_GOALS,
} from "@/lib/mockData";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

const delay = <T,>(value: T, ms = 1200): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/* eslint-disable @typescript-eslint/no-unused-vars */

export type SendOtpResponse = { success: true; sessionId: string };
export async function sendOtp(phone: string): Promise<SendOtpResponse> {
  // ============================================================
  // TODO: 🚧 REAL API INTEGRATION HERE
  // Step 1: const res = await fetch(`${BASE_URL}/auth/send-otp`, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ phone }),
  //         });
  // Step 2: if (!res.ok) throw new Error("Failed to send OTP");
  // Step 3: return (await res.json()) as SendOtpResponse;
  // ============================================================
  return delay({ success: true, sessionId: "mock_session_" + Date.now() }, 1200);
}

export type VerifyOtpResponse = { success: true; token: string; user: typeof MOCK_USER };
export async function verifyOtp(phone: string, otp: string): Promise<VerifyOtpResponse> {
  // ============================================================
  // TODO: 🚧 REAL API INTEGRATION HERE
  // Step 1: const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ phone, otp }),
  //         });
  // Step 2: if (!res.ok) throw new Error("Invalid OTP");
  // Step 3: const data = await res.json();
  // Step 4: localStorage.setItem("auth_token", data.token);
  // Step 5: return data as VerifyOtpResponse;
  // ============================================================
  if (otp.length !== 6) throw new Error("Invalid OTP");
  return delay({ success: true, token: "mock_token", user: { ...MOCK_USER, phone } }, 1200);
}

export async function getClasses() {
  // ============================================================
  // TODO: 🚧 REAL API INTEGRATION HERE
  // Step 1: const res = await fetch(`${BASE_URL}/classes`);
  // Step 2: if (!res.ok) throw new Error("Failed to load classes");
  // Step 3: return await res.json();
  // ============================================================
  return delay(CLASSES, 600);
}

export type CouponResult =
  | { valid: true; code: string; discountPct: number; discountAmount: number }
  | { valid: false; reason: string };

export async function applyCoupon(code: string, amount: number): Promise<CouponResult> {
  // ============================================================
  // TODO: 🚧 REAL API INTEGRATION HERE
  // Step 1: const res = await fetch(`${BASE_URL}/coupons/apply`, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ code, amount }),
  //         });
  // Step 2: return await res.json() as CouponResult;
  // ============================================================
  await new Promise((r) => setTimeout(r, 900));
  const pct = COUPONS[code.trim().toUpperCase()];
  if (!pct) return { valid: false, reason: "Invalid coupon code" };
  return {
    valid: true,
    code: code.trim().toUpperCase(),
    discountPct: pct,
    discountAmount: Math.round(amount * pct),
  };
}

export type PaymentPayload = {
  classId: number;
  amount: number;
  couponCode?: string;
};
export async function processPayment(payload: PaymentPayload) {
  // ============================================================
  // TODO: 🚧 REAL API INTEGRATION HERE
  // Step 1: const res = await fetch(`${BASE_URL}/payments`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
  //           },
  //           body: JSON.stringify(payload),
  //         });
  // Step 2: if (!res.ok) throw new Error("Payment failed");
  // Step 3: return await res.json();
  // ============================================================
  return delay(
    { success: true, orderId: "ord_" + Date.now(), classId: payload.classId },
    1500,
  );
}

export type DashboardData = {
  user: typeof MOCK_USER;
  heroProgress: { youXp: number; topXp: number; topName: string };
  quickStats: { totalXp: number; watchTimeMin: number; lessonsCompleted: number };
  subjects: typeof SUBJECTS;
  todayProgress: { percent: number; tasksDone: number; tasksTotal: number };
  leaderboard: typeof LEADERBOARD;
  myRank: { rank: number; name: string; xp: number; avatar: string };
  dailyGoals: typeof DAILY_GOALS;
};

export async function getDashboard(_userId: string): Promise<DashboardData> {
  // ============================================================
  // TODO: 🚧 REAL API INTEGRATION HERE
  // Step 1: const res = await fetch(`${BASE_URL}/dashboard/${_userId}`, {
  //           headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  //         });
  // Step 2: if (!res.ok) throw new Error("Failed to load dashboard");
  // Step 3: return await res.json() as DashboardData;
  // ============================================================
  return delay(
    {
      user: MOCK_USER,
      heroProgress: { youXp: MOCK_USER.totalXp, topXp: TOP_XP, topName: LEADERBOARD[0].name },
      quickStats: { totalXp: MOCK_USER.totalXp, watchTimeMin: 84, lessonsCompleted: 37 },
      subjects: SUBJECTS,
      todayProgress: { percent: 33, tasksDone: 1, tasksTotal: 3 },
      leaderboard: LEADERBOARD,
      myRank: {
        rank: 14,
        name: MOCK_USER.name,
        xp: MOCK_USER.totalXp,
        avatar: MOCK_USER.avatar,
      },
      dailyGoals: DAILY_GOALS,
    },
    1400,
  );
}

export async function toggleDailyGoal(goalId: string, done: boolean) {
  // ============================================================
  // TODO: 🚧 REAL API INTEGRATION HERE
  // Step 1: const res = await fetch(`${BASE_URL}/goals/${goalId}`, {
  //           method: "PATCH",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
  //           },
  //           body: JSON.stringify({ done }),
  //         });
  // Step 2: return await res.json();
  // ============================================================
  return delay({ id: goalId, done }, 400);
}

// ── Learning content (subjects → chapters → lessons) ──────────────
import {
  SUBJECTS_FULL,
  type SubjectFull,
  type Chapter,
  CONCEPT_MAP_NODES,
  SAMPLE_NOTES,
  SAMPLE_MCQS,
  SAMPLE_BOOKMARKS,
  AUTOPSY_RESULT,
  COGNITIVE_INSIGHTS,
} from "@/lib/learningData";

export async function getSubject(subjectId: string): Promise<SubjectFull | null> {
  // ============================================================
  // TODO: 🚧 REAL API INTEGRATION HERE
  // Step 1: const res = await fetch(`${BASE_URL}/subjects/${subjectId}`);
  // Step 2: if (!res.ok) throw new Error("Subject not found");
  // Step 3: return await res.json() as SubjectFull;
  // ============================================================
  const subject = SUBJECTS_FULL.find((s) => s.id === subjectId) ?? null;
  return delay(subject, 800);
}

export async function getChapter(
  subjectId: string,
  chapterId: string,
): Promise<{ subject: SubjectFull; chapter: Chapter } | null> {
  // ============================================================
  // TODO: 🚧 REAL API INTEGRATION HERE
  // Step 1: const res = await fetch(`${BASE_URL}/subjects/${subjectId}/chapters/${chapterId}`);
  // Step 2: return await res.json();
  // ============================================================
  const subject = SUBJECTS_FULL.find((s) => s.id === subjectId);
  if (!subject) return delay(null, 600);
  const chapter = subject.chapters.find((c) => c.id === chapterId);
  if (!chapter) return delay(null, 600);
  return delay({ subject, chapter }, 900);
}

export async function getLessonBundle() {
  // ============================================================
  // TODO: 🚧 REAL API INTEGRATION HERE
  // Step 1: const res = await fetch(`${BASE_URL}/lessons/${lessonId}/bundle`);
  // Step 2: return await res.json();
  // ============================================================
  return delay(
    {
      notes: SAMPLE_NOTES,
      mcqs: SAMPLE_MCQS,
      bookmarks: SAMPLE_BOOKMARKS,
      conceptMap: CONCEPT_MAP_NODES,
    },
    700,
  );
}

// ── Advanced AI / gamification mocks ──────────────────────────────

export type SocraticReply = { role: "ai" | "user"; text: string };
export async function askSocratic(history: SocraticReply[], _question: string): Promise<SocraticReply> {
  // ============================================================
  // TODO: 🚧 REAL API INTEGRATION HERE
  // Step 1: const res = await fetch(`${BASE_URL}/ai/socratic`, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ history, question: _question }),
  //         });
  // Step 2: return await res.json() as SocraticReply;
  // ============================================================
  const followUps = [
    "Good thought. Now — what changes if the leading coefficient is negative?",
    "Interesting. Can you try plugging in x = 1 and tell me what you get?",
    "Almost. What does the sign of the discriminant tell us about the zeros?",
    "Hmm — what's the *definition* of a zero again? Start there.",
    "Right direction. Can you generalize that to any quadratic?",
  ];
  const text = followUps[history.length % followUps.length];
  return delay({ role: "ai", text }, 900);
}

export async function getAutopsy(_testId: string) {
  // ============================================================
  // TODO: 🚧 REAL API INTEGRATION HERE
  // Step 1: const res = await fetch(`${BASE_URL}/tests/${_testId}/autopsy`);
  // Step 2: return await res.json();
  // ============================================================
  return delay(AUTOPSY_RESULT, 1100);
}

export async function getCognitiveMirror(_userId: string) {
  // ============================================================
  // TODO: 🚧 REAL API INTEGRATION HERE
  // Step 1: const res = await fetch(`${BASE_URL}/users/${_userId}/cognitive-mirror`);
  // Step 2: return await res.json();
  // ============================================================
  return delay(COGNITIVE_INSIGHTS, 900);
}
