import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Microscope,
  Mic,
  Swords,
  Brain,
  Sparkles,
  Play,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Clock,
  Trophy,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { SoftCard } from "@/components/shared/SoftCard";
import { StatIcon } from "@/components/shared/StatIcon";
import { GradientButton } from "@/components/shared/GradientButton";
import { useAuth } from "@/hooks/useAuth";
import { getAutopsy, getCognitiveMirror } from "@/services/apiClient";
import { cn } from "@/lib/utils";
import { fadeUp, stagger } from "@/lib/motion";

export const Route = createFileRoute("/ai-lab")({
  head: () => ({
    meta: [
      { title: "AI Lab — Lumin" },
      {
        name: "description",
        content:
          "Autopsy mode, voice tests, doubt battles, and cognitive insights powered by AI.",
      },
    ],
  }),
  component: AILab,
});

type Mode = "autopsy" | "oral" | "battle" | "mirror";

function AILab() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [mode, setMode] = useState<Mode>("autopsy");

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  const tabs: { id: Mode; label: string; icon: typeof Microscope; tone: "purple" | "teal" | "pink" | "amber" }[] = [
    { id: "autopsy", label: "Autopsy", icon: Microscope, tone: "purple" },
    { id: "oral", label: "Oral Test", icon: Mic, tone: "teal" },
    { id: "battle", label: "Doubt Battle", icon: Swords, tone: "pink" },
    { id: "mirror", label: "Cognitive Mirror", icon: Brain, tone: "amber" },
  ];

  return (
    <div className="min-h-screen bg-app-mesh">
      <div className="max-w-[1500px] mx-auto p-4 lg:p-6 flex gap-6">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

        <main className="flex-1 min-w-0 pb-24 lg:pb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-soft border border-purple-100 text-xs font-semibold text-purple-600 mb-3">
              <Sparkles className="h-3 w-3" /> AI Lab · Beta
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
              Powered by AI, made for you
            </h1>
            <p className="text-slate-500 mt-2 max-w-xl">
              Four next-gen tools that turn your study sessions into a smart,
              personalized experience.
            </p>
          </motion.div>

          {/* Tab pills */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
          >
            {tabs.map((t) => {
              const active = mode === t.id;
              return (
                <motion.button
                  key={t.id}
                  variants={fadeUp}
                  onClick={() => setMode(t.id)}
                  whileHover={{ y: -2 }}
                  className={cn(
                    "p-4 rounded-2xl text-left border transition shrink-0",
                    active
                      ? "bg-gradient-to-br from-purple-500 to-purple-400 border-transparent text-white shadow-glow"
                      : "bg-white border-slate-100 hover:border-purple-200 shadow-soft",
                  )}
                >
                  <t.icon
                    className={cn("h-5 w-5", active ? "text-white" : "text-purple-600")}
                  />
                  <p className={cn("font-bold text-sm mt-2", active ? "text-white" : "text-slate-800")}>
                    {t.label}
                  </p>
                  <p
                    className={cn(
                      "text-[11px] mt-0.5",
                      active ? "text-white/80" : "text-slate-500",
                    )}
                  >
                    {t.id === "autopsy" && "Why you got it wrong"}
                    {t.id === "oral" && "Speak your answers"}
                    {t.id === "battle" && "1v1 live MCQs"}
                    {t.id === "mirror" && "Your study habits"}
                  </p>
                </motion.button>
              );
            })}
          </motion.div>

          {mode === "autopsy" && <AutopsyView />}
          {mode === "oral" && <OralTestView />}
          {mode === "battle" && <DoubtBattleView />}
          {mode === "mirror" && <CognitiveMirrorView />}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

// ── Autopsy ────────────────────────────────────────────────────────
function AutopsyView() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getAutopsy>> | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAutopsy("test_001").then((d) => !cancelled && setData(d));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return (
      <SoftCard className="p-8">
        <div className="skeleton h-6 w-48 rounded" />
        <div className="skeleton h-32 w-full rounded-2xl mt-4" />
        <div className="skeleton h-20 w-full rounded-2xl mt-3" />
      </SoftCard>
    );
  }

  const pct = Math.round((data.score / data.total) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <SoftCard className="p-6 lg:col-span-2">
        <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
          Test Autopsy
        </p>
        <h2 className="font-display font-bold text-2xl text-slate-800 mt-1">
          {data.testTitle}
        </h2>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
            <p className="text-[11px] uppercase font-bold text-purple-600">Score</p>
            <p className="font-display font-bold text-2xl text-slate-800 mt-1">
              {data.score}/{data.total}
            </p>
            <p className="text-xs text-slate-500">{pct}% accuracy</p>
          </div>
          <div className="p-4 rounded-2xl bg-pink-50 border border-pink-100 col-span-2">
            <p className="text-[11px] uppercase font-bold text-pink-600">
              Concept Gap Detected
            </p>
            <p className="font-bold text-slate-800 mt-1">{data.conceptGap}</p>
            <p className="text-xs text-slate-500 mt-1">{data.weakness}</p>
          </div>
        </div>

        <h3 className="font-bold text-slate-800 mt-6 mb-3">Question breakdown</h3>
        <ul className="space-y-2">
          {data.questionBreakdown.map((q, i) => (
            <li
              key={i}
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl border",
                q.correct ? "border-emerald-100 bg-emerald-50/40" : "border-red-100 bg-red-50/40",
              )}
            >
              {q.correct ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              )}
              <span className="text-sm font-semibold text-slate-800 flex-1">
                {q.q}
              </span>
              {!q.correct && q.reason && (
                <span className="text-xs text-red-500 font-semibold">{q.reason}</span>
              )}
            </li>
          ))}
        </ul>
      </SoftCard>

      <SoftCard className="p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
          <Lightbulb className="h-3.5 w-3.5" /> Suggested revision
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Watch these to close the gap. ~17 mins total.
        </p>
        <ul className="space-y-3 mt-4">
          {data.suggestedVideos.map((v) => (
            <li
              key={v.id}
              className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/40 border border-purple-100 hover:bg-purple-50 transition cursor-pointer"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center shadow-glow">
                <Play className="h-4 w-4 text-white" fill="currentColor" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {v.title}
                </p>
                <p className="text-xs text-slate-500">{v.duration}</p>
              </div>
            </li>
          ))}
        </ul>
        <GradientButton className="w-full mt-5">Start revision plan</GradientButton>
      </SoftCard>
    </div>
  );
}

// ── Oral Test ──────────────────────────────────────────────────────
function OralTestView() {
  const [recording, setRecording] = useState(false);
  const [evaluated, setEvaluated] = useState(false);

  const evaluate = () => {
    setRecording(false);
    setTimeout(() => setEvaluated(true), 800);
  };

  return (
    <SoftCard className="p-6 md:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Oral Test · Polynomials
          </p>
          <h2 className="font-display font-bold text-2xl text-slate-800 mt-1">
            "Define a polynomial in your own words and give one example."
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Tap the mic and speak your answer. Our AI will evaluate clarity,
            correctness, and pronunciation.
          </p>

          <div className="mt-6 flex items-center gap-3">
            {!recording && !evaluated && (
              <GradientButton size="lg" onClick={() => setRecording(true)}>
                <Mic className="h-4 w-4" /> Start speaking
              </GradientButton>
            )}
            {recording && (
              <button
                onClick={evaluate}
                className="px-6 py-3 rounded-2xl bg-red-500 text-white font-semibold shadow-glow flex items-center gap-2"
              >
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Stop & Evaluate
              </button>
            )}
            {evaluated && (
              <GradientButton
                size="lg"
                variant="ghost"
                onClick={() => {
                  setEvaluated(false);
                  setRecording(false);
                }}
              >
                Try again
              </GradientButton>
            )}
          </div>

          {evaluated && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 grid grid-cols-3 gap-3"
            >
              {[
                { label: "Correctness", value: 87, tone: "purple" as const },
                { label: "Clarity", value: 92, tone: "teal" as const },
                { label: "Pronunciation", value: 78, tone: "pink" as const },
              ].map((s) => (
                <div
                  key={s.label}
                  className="p-4 rounded-2xl bg-white border border-slate-100 shadow-soft"
                >
                  <p className="text-[11px] uppercase font-bold text-slate-500">
                    {s.label}
                  </p>
                  <p className="font-display font-bold text-2xl text-slate-800 mt-1">
                    {s.value}
                  </p>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.value}%` }}
                      transition={{ duration: 0.8 }}
                      className={cn(
                        "h-full",
                        s.tone === "purple" && "bg-gradient-to-r from-purple-500 to-purple-400",
                        s.tone === "teal" && "bg-gradient-to-r from-teal-500 to-cyan-400",
                        s.tone === "pink" && "bg-gradient-to-r from-pink-500 to-rose-400",
                      )}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Waveform */}
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "h-44 w-44 rounded-full flex items-center justify-center transition",
              recording
                ? "bg-gradient-to-br from-red-100 to-pink-100"
                : "bg-gradient-to-br from-teal-50 to-cyan-50",
            )}
          >
            <div
              className={cn(
                "h-32 w-32 rounded-full flex items-center justify-center shadow-glow transition",
                recording
                  ? "bg-gradient-to-br from-red-500 to-pink-500"
                  : "bg-gradient-to-br from-teal-400 to-cyan-400",
              )}
            >
              <Mic className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="flex items-end gap-1 h-12">
            {Array.from({ length: 22 }).map((_, i) => (
              <motion.span
                key={i}
                animate={
                  recording
                    ? { height: [`${10 + (i % 5) * 5}px`, `${30 + (i % 4) * 10}px`, `${10 + (i % 5) * 5}px`] }
                    : { height: "8px" }
                }
                transition={{
                  duration: 0.6 + (i % 3) * 0.2,
                  repeat: recording ? Infinity : 0,
                  delay: i * 0.04,
                }}
                className={cn(
                  "w-1 rounded-full",
                  recording ? "bg-gradient-to-t from-red-400 to-pink-400" : "bg-slate-200",
                )}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 font-semibold">
            {recording ? "Listening…" : evaluated ? "Evaluation ready" : "Ready when you are"}
          </p>
        </div>
      </div>
    </SoftCard>
  );
}

// ── Doubt Battle ───────────────────────────────────────────────────
function DoubtBattleView() {
  const [seconds, setSeconds] = useState(15);
  const [you, setYou] = useState(2);
  const [opp, setOpp] = useState(1);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 15));
      if (Math.random() > 0.7) setOpp((o) => o + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const correct = 2;

  return (
    <SoftCard className="p-0 overflow-hidden">
      <div className="grid grid-cols-2">
        {/* YOU */}
        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-r border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav"
              className="h-12 w-12 rounded-full bg-white shadow-soft"
              alt="You"
            />
            <div>
              <p className="text-[11px] uppercase font-bold text-purple-600">You</p>
              <p className="font-bold text-slate-800">Aarav S.</p>
            </div>
            <span className="ml-auto font-display font-bold text-3xl text-purple-600">
              {you}
            </span>
          </div>
        </div>

        {/* OPP */}
        <div className="p-6 bg-gradient-to-br from-amber-50 to-rose-50">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-3xl text-rose-500 mr-auto">
              {opp}
            </span>
            <div className="text-right">
              <p className="text-[11px] uppercase font-bold text-rose-500">Opponent</p>
              <p className="font-bold text-slate-800">Priya V.</p>
            </div>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
              className="h-12 w-12 rounded-full bg-white shadow-soft"
              alt="Opponent"
            />
          </div>
        </div>
      </div>

      {/* Timer + question */}
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Round 4 / 10
          </span>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1",
              seconds <= 5 ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-700",
            )}
          >
            <Clock className="h-3 w-3" /> {seconds}s
          </span>
        </div>

        <h2 className="font-display font-bold text-xl text-slate-800">
          What is the degree of the polynomial 4x³ − 2x + 7?
        </h2>

        <div className="grid sm:grid-cols-2 gap-3 mt-5">
          {["1", "2", "3", "4"].map((opt, i) => {
            const isPicked = picked === i;
            const isCorrect = picked != null && i === correct;
            const isWrong = picked != null && isPicked && i !== correct;
            return (
              <button
                key={i}
                onClick={() => {
                  if (picked != null) return;
                  setPicked(i);
                  if (i === correct) setYou((y) => y + 1);
                }}
                className={cn(
                  "p-4 rounded-2xl border text-left font-semibold transition",
                  picked == null && "bg-white border-slate-200 hover:border-purple-300 text-slate-800",
                  isCorrect && "bg-emerald-50 border-emerald-200 text-emerald-600",
                  isWrong && "bg-red-50 border-red-200 text-red-500",
                  picked != null && !isPicked && i !== correct && "bg-slate-50 border-slate-100 text-slate-500",
                )}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-6 p-3 rounded-2xl bg-purple-50 border border-purple-100 text-xs text-slate-600 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-purple-600" />
          Win to earn <strong className="text-purple-700">+50 XP</strong> and climb the Arena.
        </div>
      </div>
    </SoftCard>
  );
}

// ── Cognitive Mirror ───────────────────────────────────────────────
function CognitiveMirrorView() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getCognitiveMirror>> | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCognitiveMirror("u_001").then((d) => !cancelled && setData(d));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return (
      <SoftCard className="p-8">
        <div className="skeleton h-5 w-64 rounded" />
        <div className="skeleton h-40 w-full rounded-2xl mt-4" />
      </SoftCard>
    );
  }

  const max = Math.max(...data.focusByHour.map((h) => h.focus));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <SoftCard className="p-6 lg:col-span-2">
        <div className="flex items-start gap-3">
          <StatIcon icon={Brain} tone="amber" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Cognitive Mirror
            </p>
            <h2 className="font-display font-bold text-2xl text-slate-800 mt-1">
              {data.headline}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Best focus window: <strong className="text-slate-700">{data.bestTime}</strong>
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Focus level vs time of day
          </p>
          <div className="flex items-end gap-2 h-44 px-1">
            {data.focusByHour.map((h) => (
              <div key={h.hour} className="flex-1 flex flex-col items-center gap-1.5">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(h.focus / max) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.05 }}
                  className={cn(
                    "w-full rounded-t-xl",
                    h.focus >= 85
                      ? "bg-gradient-to-t from-purple-500 to-purple-300"
                      : h.focus >= 65
                      ? "bg-gradient-to-t from-amber-300 to-amber-200"
                      : "bg-gradient-to-t from-slate-300 to-slate-200",
                  )}
                />
                <span className="text-[10px] text-slate-500 font-semibold">{h.hour}</span>
              </div>
            ))}
          </div>
        </div>
      </SoftCard>

      <SoftCard className="p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
          <Lightbulb className="h-3.5 w-3.5" /> Insights
        </p>
        <ul className="mt-4 space-y-3">
          {data.insights.map((ins, i) => (
            <li
              key={i}
              className="p-3 rounded-2xl bg-purple-50/40 border border-purple-100 text-sm text-slate-700 leading-relaxed"
            >
              {ins}
            </li>
          ))}
        </ul>
      </SoftCard>
    </div>
  );
}
