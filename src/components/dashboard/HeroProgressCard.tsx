import { motion } from "framer-motion";
import { Trophy, Flame } from "lucide-react";
import { SoftCard } from "@/components/shared/SoftCard";

export function HeroProgressCard({
  youXp,
  topXp,
  topName,
  youAvatar,
  topAvatar,
}: {
  youXp: number;
  topXp: number;
  topName: string;
  youAvatar: string;
  topAvatar: string;
}) {
  const pct = Math.min(100, Math.round((youXp / topXp) * 100));
  return (
    <SoftCard className="p-6 md:p-8 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-100 blur-3xl opacity-60" />
      <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-pink-100 blur-3xl opacity-60" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5" /> Today's Progress
            </p>
            <h2 className="font-display font-bold text-xl md:text-2xl text-slate-800 mt-1">
              You're {topXp - youXp} XP behind the top student
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Keep going — one more lesson can flip the chart.
            </p>
          </div>
          <div className="hidden sm:flex h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-400 items-center justify-center shadow-glow shrink-0">
            <Trophy className="h-7 w-7 text-white" />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* You */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <img
                  src={youAvatar}
                  alt="You"
                  className="h-7 w-7 rounded-full bg-purple-100"
                />
                <span className="text-sm font-semibold text-slate-800">You</span>
              </div>
              <span className="text-sm font-bold text-purple-600">{youXp} XP</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
              />
            </div>
          </div>

          {/* Top */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <img
                  src={topAvatar}
                  alt={topName}
                  className="h-7 w-7 rounded-full bg-pink-100"
                />
                <span className="text-sm font-semibold text-slate-800">
                  {topName} <span className="text-slate-400 font-normal">· Top</span>
                </span>
              </div>
              <span className="text-sm font-bold text-slate-700">{topXp} XP</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                className="h-full bg-gradient-to-r from-pink-400 to-amber-300"
              />
            </div>
          </div>
        </div>
      </div>
    </SoftCard>
  );
}
