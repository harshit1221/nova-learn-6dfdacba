import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { SoftCard } from "@/components/shared/SoftCard";
import { cn } from "@/lib/utils";
import { toggleDailyGoal } from "@/services/apiClient";

type Goal = { id: string; title: string; done: boolean; xp: number };

export function DailyGoals({ initial }: { initial: Goal[] }) {
  const [goals, setGoals] = useState<Goal[]>(initial);

  const toggle = async (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g)),
    );
    const g = goals.find((x) => x.id === id);
    if (g) await toggleDailyGoal(id, !g.done);
  };

  return (
    <SoftCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Daily Goals
          </p>
          <p className="font-display font-bold text-slate-800 mt-0.5">
            Tap to complete
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {goals.map((g) => (
          <li key={g.id}>
            <button
              onClick={() => toggle(g.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl border transition text-left",
                g.done
                  ? "bg-purple-50/60 border-purple-100"
                  : "bg-white border-slate-100 hover:border-purple-200",
              )}
            >
              <motion.span
                animate={g.done ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition",
                  g.done
                    ? "bg-gradient-to-br from-purple-500 to-purple-400 text-white shadow-glow"
                    : "bg-slate-100 text-transparent",
                )}
              >
                <Check className="h-4 w-4" />
              </motion.span>
              <span className="flex-1 relative">
                <span
                  className={cn(
                    "text-sm font-medium transition",
                    g.done ? "text-slate-400" : "text-slate-800",
                  )}
                >
                  {g.title}
                </span>
                <motion.span
                  initial={false}
                  animate={{ scaleX: g.done ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ originX: 0 }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-full bg-slate-300"
                />
              </span>
              <span
                className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full shrink-0",
                  g.done
                    ? "bg-purple-100 text-purple-600"
                    : "bg-slate-100 text-slate-500",
                )}
              >
                +{g.xp} XP
              </span>
            </button>
          </li>
        ))}
      </ul>
    </SoftCard>
  );
}
