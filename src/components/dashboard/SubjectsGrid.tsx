import { motion } from "framer-motion";
import {
  Sigma,
  FlaskConical,
  BookOpen,
  Globe2,
  Languages,
  Cpu,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Link, linkOptions } from "@tanstack/react-router";
import { SoftCard } from "@/components/shared/SoftCard";
import { StatIcon } from "@/components/shared/StatIcon";
import { fadeUp, stagger } from "@/lib/motion";

const iconMap: Record<string, LucideIcon> = {
  Sigma,
  FlaskConical,
  BookOpen,
  Globe2,
  Languages,
  Cpu,
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
          const subjectLink = linkOptions({
            to: "/subjects/$subjectId",
            params: { subjectId: s.id },
          });
          return (
            <motion.div key={s.id} variants={fadeUp} whileHover={{ y: -3 }}>
              <SoftCard className="p-5 hover:shadow-soft-lg transition h-full">
                <Link
                  {...subjectLink}
                  className="block text-left rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <StatIcon
                        icon={Icon}
                        tone={s.color as "purple" | "teal" | "pink" | "amber" | "rose" | "cyan"}
                      />
                      <div>
                        <p className="font-bold text-slate-800 hover:text-purple-600 transition">
                          {s.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.chapters} chapters</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">Progress</span>
                      <span className="text-slate-700 font-bold">{s.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
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
    </div>
  );
}
