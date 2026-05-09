import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FileBarChart2,
  TrendingUp,
  Award,
  Target,
  Sparkles,
  Download,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { SoftCard } from "@/components/shared/SoftCard";
import { GradientButton } from "@/components/shared/GradientButton";
import { useAuth } from "@/hooks/useAuth";
import { SUBJECTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { fadeUp, stagger } from "@/lib/motion";

export const Route = createFileRoute("/report-card")({
  head: () => ({
    meta: [
      { title: "Report Card — Lumin" },
      { name: "description", content: "Track your performance across subjects and tests." },
    ],
  }),
  component: ReportCardPage,
});

const MONTHLY = [
  { month: "Jan", score: 62 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 71 },
  { month: "Apr", score: 74 },
  { month: "May", score: 82 },
  { month: "Jun", score: 88 },
];

const STRENGTHS = ["Algebra", "Reading Comprehension", "Programming"];
const IMPROVE = ["Trigonometry", "Inorganic Chemistry", "Modern History"];

function ReportCardPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  const overall = Math.round(
    SUBJECTS.reduce((a, s) => a + s.progress, 0) / SUBJECTS.length,
  );
  const max = Math.max(...MONTHLY.map((m) => m.score));

  return (
    <div className="min-h-screen bg-app-mesh">
      <div className="max-w-[1500px] mx-auto p-4 lg:p-6 flex gap-6">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <main className="flex-1 min-w-0 pb-24 lg:pb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-soft border border-purple-100 text-xs font-semibold text-purple-600 mb-3">
                <Sparkles className="h-3 w-3" /> Report Card
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
                Your performance, at a glance
              </h1>
              <p className="text-slate-500 mt-2">
                Subject-wise progress, trends and personalized insights.
              </p>
            </div>
            <GradientButton variant="ghost" className="hidden md:inline-flex">
              <Download className="h-4 w-4" /> Export PDF
            </GradientButton>
          </div>

          {/* Top stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            {[
              { label: "Overall", value: `${overall}%`, icon: FileBarChart2, tone: "purple" },
              { label: "Tests Taken", value: "24", icon: Target, tone: "teal" },
              { label: "Avg Score", value: "84%", icon: TrendingUp, tone: "pink" },
              { label: "Badges", value: "12", icon: Award, tone: "amber" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <SoftCard key={s.label} className="p-4 md:p-5">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center",
                      s.tone === "purple" && "bg-purple-50 text-purple-600",
                      s.tone === "teal" && "bg-teal-50 text-teal-600",
                      s.tone === "pink" && "bg-pink-50 text-pink-500",
                      s.tone === "amber" && "bg-amber-50 text-amber-600",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-[11px] uppercase font-bold text-slate-500 tracking-wider mt-3">
                    {s.label}
                  </p>
                  <p className="font-display font-bold text-2xl text-slate-800 mt-0.5">
                    {s.value}
                  </p>
                </SoftCard>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Trend */}
            <SoftCard className="p-6 lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Score Trend
              </p>
              <h2 className="font-display font-bold text-xl text-slate-800 mt-1">
                Last 6 months
              </h2>
              <div className="mt-6 flex items-end gap-3 h-48">
                {MONTHLY.map((m, i) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(m.score / max) * 100}%` }}
                      transition={{ delay: i * 0.05, duration: 0.6 }}
                      className="w-full rounded-t-xl bg-gradient-to-t from-purple-500 to-purple-300"
                    />
                    <span className="text-[11px] font-semibold text-slate-500">{m.month}</span>
                  </div>
                ))}
              </div>
            </SoftCard>

            {/* Subjects */}
            <SoftCard className="p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
                Subject Mastery
              </p>
              <motion.ul
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="mt-4 space-y-3"
              >
                {SUBJECTS.map((s) => (
                  <motion.li key={s.id} variants={fadeUp}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-800">{s.name}</span>
                      <span className="text-xs font-bold text-slate-500">{s.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden mt-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.progress}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-400"
                      />
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </SoftCard>
          </div>

          {/* Strengths / improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <SoftCard className="p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Your strengths
              </p>
              <ul className="mt-3 space-y-2">
                {STRENGTHS.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100"
                  >
                    <Award className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-slate-800">{t}</span>
                  </li>
                ))}
              </ul>
            </SoftCard>
            <SoftCard className="p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-500">
                Needs improvement
              </p>
              <ul className="mt-3 space-y-2">
                {IMPROVE.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50/50 border border-rose-100"
                  >
                    <Target className="h-4 w-4 text-rose-500" />
                    <span className="text-sm font-semibold text-slate-800">{t}</span>
                  </li>
                ))}
              </ul>
            </SoftCard>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
