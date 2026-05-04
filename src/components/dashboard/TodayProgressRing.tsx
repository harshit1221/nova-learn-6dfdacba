import { motion } from "framer-motion";
import { SoftCard } from "@/components/shared/SoftCard";

export function TodayProgressRing({
  percent,
  tasksDone,
  tasksTotal,
}: {
  percent: number;
  tasksDone: number;
  tasksTotal: number;
}) {
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ - (percent / 100) * circ;

  return (
    <SoftCard className="p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
        Today's Progress
      </p>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#F1F5F9"
              strokeWidth="10"
              fill="none"
            />
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              stroke="url(#ringGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-bold text-2xl text-slate-800">
              {percent}%
            </span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              Done
            </span>
          </div>
        </div>
        <div>
          <p className="font-bold text-slate-800">
            {tasksDone}/{tasksTotal} daily tasks
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Finish today's goals to earn bonus XP and keep your streak alive 🔥
          </p>
        </div>
      </div>
    </SoftCard>
  );
}
