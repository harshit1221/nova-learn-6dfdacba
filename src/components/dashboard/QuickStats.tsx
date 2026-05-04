import { Trophy, Clock, BookCheck } from "lucide-react";
import { SoftCard } from "@/components/shared/SoftCard";
import { StatIcon } from "@/components/shared/StatIcon";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

export function QuickStats({
  totalXp,
  watchTimeMin,
  lessonsCompleted,
}: {
  totalXp: number;
  watchTimeMin: number;
  lessonsCompleted: number;
}) {
  const hours = Math.floor(watchTimeMin / 60);
  const mins = watchTimeMin % 60;

  const items = [
    { label: "Total XP", value: totalXp.toLocaleString(), icon: Trophy, tone: "purple" as const },
    {
      label: "Today's Watch Time",
      value: `${hours}h ${mins}m`,
      icon: Clock,
      tone: "teal" as const,
    },
    {
      label: "Lessons Completed",
      value: String(lessonsCompleted),
      icon: BookCheck,
      tone: "pink" as const,
    },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {items.map((it) => (
        <motion.div key={it.label} variants={fadeUp}>
          <SoftCard className="p-5 flex items-center gap-4">
            <StatIcon icon={it.icon} tone={it.tone} />
            <div>
              <p className="text-xs text-slate-500 font-medium">{it.label}</p>
              <p className="text-xl font-display font-bold text-slate-800 mt-0.5">
                {it.value}
              </p>
            </div>
          </SoftCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
