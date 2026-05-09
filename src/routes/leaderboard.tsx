import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Crown, Flame, Sparkles, Medal } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { SoftCard } from "@/components/shared/SoftCard";
import { useAuth } from "@/hooks/useAuth";
import { LEADERBOARD, MOCK_USER } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { fadeUp, stagger } from "@/lib/motion";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Lumin" },
      { name: "description", content: "See how you rank against other learners." },
    ],
  }),
  component: LeaderboardPage,
});

const TABS = ["Weekly", "Monthly", "All Time"] as const;

const FULL_BOARD = [
  ...LEADERBOARD,
  { rank: 6, name: "Diya Mehta", xp: 488, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diya" },
  { rank: 7, name: "Vihaan Rao", xp: 472, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vihaan" },
  { rank: 8, name: "Saanvi Pillai", xp: 460, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Saanvi" },
  { rank: 9, name: "Arjun Nair", xp: 455, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun" },
  { rank: 10, name: "Meera Joshi", xp: 451, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera" },
];

function LeaderboardPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Weekly");

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  const top3 = FULL_BOARD.slice(0, 3);
  const rest = FULL_BOARD.slice(3);

  return (
    <div className="min-h-screen bg-app-mesh">
      <div className="max-w-[1500px] mx-auto p-4 lg:p-6 flex gap-6">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <main className="flex-1 min-w-0 pb-24 lg:pb-6">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-soft border border-purple-100 text-xs font-semibold text-purple-600 mb-3">
              <Sparkles className="h-3 w-3" /> Leaderboard
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
              Climb the ranks
            </h1>
            <p className="text-slate-500 mt-2">
              Earn XP by completing lessons, tests and daily goals.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-5 overflow-x-auto scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition border",
                  tab === t
                    ? "bg-gradient-to-r from-purple-500 to-purple-400 text-white border-transparent shadow-glow"
                    : "bg-white text-slate-600 border-slate-100 hover:border-purple-200",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Podium */}
          <SoftCard className="p-6 md:p-8 mb-5 bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <div className="grid grid-cols-3 gap-3 items-end">
              {[top3[1], top3[0], top3[2]].map((u, idx) => {
                const realIdx = idx === 0 ? 1 : idx === 1 ? 0 : 2;
                const heights = ["h-24", "h-32", "h-20"];
                const tones = [
                  "from-slate-300 to-slate-200",
                  "from-amber-400 to-yellow-300",
                  "from-orange-300 to-amber-200",
                ];
                return (
                  <motion.div
                    key={u.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative">
                      {realIdx === 0 && (
                        <Crown className="absolute -top-5 left-1/2 -translate-x-1/2 h-6 w-6 text-amber-500 fill-amber-400" />
                      )}
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className={cn(
                          "rounded-full bg-white shadow-soft-lg border-4",
                          realIdx === 0 ? "h-20 w-20 border-amber-300" : "h-16 w-16 border-white",
                        )}
                      />
                    </div>
                    <p className="font-bold text-slate-800 text-sm mt-2 text-center truncate max-w-full">
                      {u.name}
                    </p>
                    <p className="text-xs text-slate-500 font-semibold">{u.xp} XP</p>
                    <div
                      className={cn(
                        "w-full mt-3 rounded-t-2xl bg-gradient-to-t flex items-start justify-center pt-2",
                        heights[idx],
                        tones[idx],
                      )}
                    >
                      <span className="font-display font-bold text-xl text-white drop-shadow">
                        #{realIdx + 1}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SoftCard>

          {/* My rank highlight */}
          <SoftCard className="p-4 mb-5 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-2xl text-purple-600 w-10 text-center">
                #14
              </span>
              <img
                src={MOCK_USER.avatar}
                alt={MOCK_USER.name}
                className="h-11 w-11 rounded-full bg-white shadow-soft"
              />
              <div className="flex-1">
                <p className="font-bold text-slate-800">{MOCK_USER.name} (You)</p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Flame className="h-3 w-3 text-orange-500" /> 7 day streak
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase font-bold text-purple-600">XP</p>
                <p className="font-bold text-slate-800">{MOCK_USER.totalXp}</p>
              </div>
            </div>
          </SoftCard>

          {/* List */}
          <SoftCard className="p-3">
            <motion.ul
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="divide-y divide-slate-100"
            >
              {rest.map((u) => (
                <motion.li
                  key={u.rank}
                  variants={fadeUp}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition"
                >
                  <span className="font-display font-bold text-lg text-slate-400 w-8 text-center">
                    {u.rank}
                  </span>
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="h-10 w-10 rounded-full bg-white shadow-soft"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{u.name}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600">
                    <Medal className="h-3.5 w-3.5" />
                    {u.xp} XP
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </SoftCard>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
            <Trophy className="h-4 w-4 text-amber-500" />
            Updated daily at midnight IST.
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
