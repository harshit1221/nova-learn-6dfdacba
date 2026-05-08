import { useEffect, useState } from "react";
import { createFileRoute, Link, linkOptions, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { SoftCard } from "@/components/shared/SoftCard";
import { StatIcon } from "@/components/shared/StatIcon";
import { useAuth } from "@/hooks/useAuth";
import { SUBJECTS_FULL } from "@/lib/learningData";
import {
  Sigma,
  FlaskConical,
  BookOpen,
  Globe2,
  Languages,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";

const iconMap: Record<string, LucideIcon> = {
  Sigma,
  FlaskConical,
  BookOpen,
  Globe2,
  Languages,
  Cpu,
};

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "Subjects — Lumin" },
      { name: "description", content: "Pick a subject and start learning." },
    ],
  }),
  component: SubjectsIndex,
});

function SubjectsIndex() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

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

          <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
                Your subjects
              </h1>
              <p className="text-slate-500 mt-2">Class 10 syllabus · 6 subjects · 71 chapters</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white rounded-2xl shadow-soft px-4 py-2.5 border border-slate-100 w-72">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                placeholder="Search chapter…"
                className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {SUBJECTS_FULL.map((s) => {
              const total = s.chapters.length;
              const completed = s.chapters.filter((c) => c.progress >= 100).length;
              const overall = Math.round(
                s.chapters.reduce((acc, c) => acc + c.progress, 0) / total,
              );
              const Icon = iconMap[s.icon] ?? BookOpen;
              const subjectLink = linkOptions({
                to: "/subjects/$subjectId",
                params: { subjectId: s.id },
              });
              return (
                <motion.div key={s.id} variants={fadeUp}>
                  <SoftCard className="p-6 hover:shadow-soft-lg transition h-full">
                    <Link
                      {...subjectLink}
                      className="block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <StatIcon
                          icon={Icon}
                          tone={s.color as "purple" | "teal" | "pink" | "amber" | "rose" | "cyan"}
                          size="lg"
                        />
                        <ChevronRight className="h-5 w-5 text-slate-300" />
                      </div>
                      <h3 className="font-display font-bold text-slate-800 mt-4 text-lg hover:text-purple-600 transition">
                        {s.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {completed}/{total} chapters completed
                      </p>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-500 font-medium">Overall</span>
                          <span className="text-slate-700 font-bold">{overall}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${overall}%` }}
                            transition={{ duration: 0.9 }}
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                          />
                        </div>
                      </div>
                    </Link>
                  </SoftCard>
                </motion.div>
              );
            })}
          </motion.div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
