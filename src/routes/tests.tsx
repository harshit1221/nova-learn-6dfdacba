import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Clock,
  Trophy,
  Play,
  CheckCircle2,
  Sparkles,
  Filter,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { SoftCard } from "@/components/shared/SoftCard";
import { GradientButton } from "@/components/shared/GradientButton";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { fadeUp, stagger } from "@/lib/motion";

export const Route = createFileRoute("/tests")({
  head: () => ({
    meta: [
      { title: "Tests — Lumin" },
      { name: "description", content: "Mock tests, chapter quizzes and timed practice." },
    ],
  }),
  component: TestsPage,
});

type TestStatus = "available" | "completed" | "upcoming";
type TestItem = {
  id: string;
  title: string;
  subject: string;
  questions: number;
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard";
  status: TestStatus;
  score?: number;
};

const TESTS: TestItem[] = [
  { id: "t1", title: "Real Numbers — Chapter Test", subject: "Mathematics", questions: 20, duration: 30, difficulty: "Medium", status: "available" },
  { id: "t2", title: "Light & Reflection Quiz", subject: "Science", questions: 15, duration: 20, difficulty: "Easy", status: "completed", score: 87 },
  { id: "t3", title: "Polynomials Mock", subject: "Mathematics", questions: 25, duration: 45, difficulty: "Hard", status: "available" },
  { id: "t4", title: "Grammar Fundamentals", subject: "English", questions: 30, duration: 35, difficulty: "Medium", status: "completed", score: 92 },
  { id: "t5", title: "Indian Constitution", subject: "Social Studies", questions: 20, duration: 25, difficulty: "Medium", status: "upcoming" },
  { id: "t6", title: "Computer Networks Basics", subject: "Computer", questions: 18, duration: 22, difficulty: "Easy", status: "available" },
];

const FILTERS = ["All", "Available", "Completed", "Upcoming"] as const;

function TestsPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  const filtered = TESTS.filter((t) =>
    filter === "All" ? true : t.status === filter.toLowerCase(),
  );

  const stats = {
    completed: TESTS.filter((t) => t.status === "completed").length,
    avg: Math.round(
      TESTS.filter((t) => t.score).reduce((a, b) => a + (b.score ?? 0), 0) /
        Math.max(1, TESTS.filter((t) => t.score).length),
    ),
    available: TESTS.filter((t) => t.status === "available").length,
  };

  return (
    <div className="min-h-screen bg-app-mesh">
      <div className="max-w-[1500px] mx-auto p-4 lg:p-6 flex gap-6">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <main className="flex-1 min-w-0 pb-24 lg:pb-6">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-soft border border-purple-100 text-xs font-semibold text-purple-600 mb-3">
              <Sparkles className="h-3 w-3" /> Tests
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
              Sharpen with practice tests
            </h1>
            <p className="text-slate-500 mt-2">
              Chapter quizzes, mock tests and timed challenges to keep you exam-ready.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
            <SoftCard className="p-4 md:p-5">
              <div className="flex items-center gap-2 text-purple-600">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-[11px] uppercase font-bold tracking-wider">Completed</p>
              </div>
              <p className="font-display font-bold text-2xl md:text-3xl text-slate-800 mt-1">
                {stats.completed}
              </p>
            </SoftCard>
            <SoftCard className="p-4 md:p-5">
              <div className="flex items-center gap-2 text-teal-600">
                <Trophy className="h-4 w-4" />
                <p className="text-[11px] uppercase font-bold tracking-wider">Avg Score</p>
              </div>
              <p className="font-display font-bold text-2xl md:text-3xl text-slate-800 mt-1">
                {stats.avg}%
              </p>
            </SoftCard>
            <SoftCard className="p-4 md:p-5">
              <div className="flex items-center gap-2 text-pink-500">
                <ClipboardList className="h-4 w-4" />
                <p className="text-[11px] uppercase font-bold tracking-wider">Available</p>
              </div>
              <p className="font-display font-bold text-2xl md:text-3xl text-slate-800 mt-1">
                {stats.available}
              </p>
            </SoftCard>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border",
                  filter === f
                    ? "bg-gradient-to-r from-purple-500 to-purple-400 text-white border-transparent shadow-glow"
                    : "bg-white text-slate-600 border-slate-100 hover:border-purple-200",
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filtered.map((t) => (
              <motion.div key={t.id} variants={fadeUp}>
                <SoftCard className="p-5 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase font-bold tracking-wider text-purple-600">
                        {t.subject}
                      </p>
                      <h3 className="font-bold text-slate-800 text-lg mt-1">{t.title}</h3>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase px-2 py-1 rounded-full",
                        t.difficulty === "Easy" && "bg-emerald-50 text-emerald-600",
                        t.difficulty === "Medium" && "bg-amber-50 text-amber-600",
                        t.difficulty === "Hard" && "bg-rose-50 text-rose-600",
                      )}
                    >
                      {t.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-3">
                    <span className="flex items-center gap-1">
                      <ClipboardList className="h-3.5 w-3.5" /> {t.questions} Qs
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {t.duration} min
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    {t.status === "completed" ? (
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase font-bold text-slate-500">Score</p>
                          <p className="font-bold text-slate-800">{t.score}%</p>
                        </div>
                      </div>
                    ) : t.status === "upcoming" ? (
                      <span className="text-xs font-semibold text-amber-600">
                        Unlocks soon
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-purple-600">
                        Ready to start
                      </span>
                    )}
                    <GradientButton
                      variant={t.status === "completed" ? "ghost" : "primary"}
                      disabled={t.status === "upcoming"}
                    >
                      {t.status === "completed" ? (
                        "Review"
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5" /> Start
                        </>
                      )}
                    </GradientButton>
                  </div>
                </SoftCard>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
