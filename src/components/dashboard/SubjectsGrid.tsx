import { motion } from "framer-motion";
import {
  Sigma,
  FlaskConical,
  BookOpen,
  Globe2,
  Languages,
  Cpu,
  ChevronRight,
  Play,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Link, linkOptions } from "@tanstack/react-router";
import { SoftCard } from "@/components/shared/SoftCard";
import { StatIcon } from "@/components/shared/StatIcon";
import { fadeUp, stagger } from "@/lib/motion";
import { SUBJECTS_FULL } from "@/lib/learningData";

const iconMap: Record<string, LucideIcon> = {
  Sigma,
  FlaskConical,
  BookOpen,
  Globe2,
  Languages,
  Cpu,
};

const toneGradients: Record<string, string> = {
  purple: "from-purple-500/15 via-fuchsia-400/10 to-transparent",
  teal: "from-teal-500/15 via-cyan-400/10 to-transparent",
  pink: "from-pink-500/15 via-rose-400/10 to-transparent",
  amber: "from-amber-500/15 via-orange-400/10 to-transparent",
  rose: "from-rose-500/15 via-pink-400/10 to-transparent",
  cyan: "from-cyan-500/15 via-sky-400/10 to-transparent",
};

type Subject = {
  id: string;
  name: string;
  icon: string;
  progress: number;
  color: string;
  chapters: number;
};

export function SubjectsGrid({ subjects }: { subjects: Subject[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-lg text-slate-800">My Subjects</h2>
        <button className="text-xs font-semibold text-purple-600 hover:underline">View all</button>
      </div>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {subjects.map((s) => {
          const Icon = iconMap[s.icon] ?? BookOpen;
          const full = SUBJECTS_FULL.find((sub) => sub.id === s.id);
          const nextChapter =
            full?.chapters.find((c) => c.progress < 100) ?? full?.chapters[0];
          const nextLesson = nextChapter?.lessons.find((l) => !l.watched) ?? nextChapter?.lessons[0];

          const subjectLink = linkOptions({
            to: "/subjects/$subjectId",
            params: { subjectId: s.id },
          });
          const continueLink = nextChapter
            ? linkOptions({
                to: "/player/$subjectId/$chapterId",
                params: { subjectId: s.id, chapterId: nextChapter.id },
              })
            : null;
          const tone = toneGradients[s.color] ?? toneGradients.purple;

          return (
            <motion.div key={s.id} variants={fadeUp} whileHover={{ y: -4 }}>
              <SoftCard className="relative p-5 hover:shadow-soft-lg transition-all h-full overflow-hidden group">
                {/* Decorative gradient glow */}
                <div
                  className={`pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gradient-to-br ${tone} blur-2xl opacity-80 group-hover:opacity-100 transition`}
                />
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/40" />

                <Link
                  {...subjectLink}
                  className="relative block text-left rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <StatIcon
                        icon={Icon}
                        tone={s.color as "purple" | "teal" | "pink" | "amber" | "rose" | "cyan"}
                      />
                      <div>
                        <p className="font-bold text-slate-800 group-hover:text-purple-600 transition">
                          {s.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {s.chapters} chapters · {s.progress}% done
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-purple-400 group-hover:translate-x-0.5 transition" />
                  </div>

                  <div className="mt-4">
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-400 shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                      />
                    </div>
                  </div>
                </Link>

                {/* Continue learning CTA */}
                {continueLink && (
                  <div className="relative mt-4 pt-4 border-t border-dashed border-slate-200/80">
                    <Link
                      {...continueLink}
                      className="flex items-center justify-between gap-3 rounded-2xl p-2.5 -m-1 hover:bg-purple-50/60 transition group/cta"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <div className="absolute inset-0 rounded-xl bg-purple-500/40 blur-md group-hover/cta:bg-purple-500/60 transition" />
                          <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-glow">
                            <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider font-bold text-purple-600 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Continue learning
                          </p>
                          <p className="text-xs font-semibold text-slate-700 truncate">
                            {nextLesson?.title ?? nextChapter?.title}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-purple-600 shrink-0 group-hover/cta:translate-x-0.5 transition">
                        Resume →
                      </span>
                    </Link>
                  </div>
                )}
              </SoftCard>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
