import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { HeroProgressCard } from "@/components/dashboard/HeroProgressCard";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { SubjectsGrid } from "@/components/dashboard/SubjectsGrid";
import { TodayProgressRing } from "@/components/dashboard/TodayProgressRing";
import { ArenaRanking } from "@/components/dashboard/ArenaRanking";
import { DailyGoals } from "@/components/dashboard/DailyGoals";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { SoftCard } from "@/components/shared/SoftCard";
import { useAuth } from "@/hooks/useAuth";
import { getDashboard, type DashboardData } from "@/services/apiClient";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Lumin" },
      { name: "description", content: "Your personal learning hub on Lumin." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  useEffect(() => {
    let cancelled = false;
    getDashboard(user?.id ?? "u_001").then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const className = user?.classId ? `Class ${user.classId}` : data?.user.className ?? "Class 10";
  const firstName = user?.name?.split(" ")[0] ?? data?.user.name.split(" ")[0] ?? "Student";

  return (
    <div className="min-h-screen bg-app-mesh">
      <div className="max-w-[1500px] mx-auto p-4 lg:p-6 flex gap-6">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

        <main className="flex-1 min-w-0 pb-24 lg:pb-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6 gap-3">
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center shadow-glow">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="font-display font-bold text-lg text-slate-800">Lumin</span>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white rounded-2xl shadow-soft px-4 py-2.5 flex-1 max-w-md border border-slate-100">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                placeholder="Search lessons, chapters, tests…"
                className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <button className="h-10 w-10 rounded-2xl bg-white shadow-soft border border-slate-100 flex items-center justify-center text-slate-500 hover:text-purple-600 transition">
              <Bell className="h-5 w-5" />
            </button>
          </div>

          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 flex-wrap"
          >
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800">
              Welcome back, {firstName} 👋
            </h1>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
              {className}
            </span>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
            {/* Center column */}
            <div className="space-y-6 min-w-0">
              {!data ? (
                <DashboardSkeleton />
              ) : (
                <>
                  <HeroProgressCard
                    youXp={data.heroProgress.youXp}
                    topXp={data.heroProgress.topXp}
                    topName={data.heroProgress.topName}
                    youAvatar={data.user.avatar}
                    topAvatar={data.leaderboard[0].avatar}
                  />
                  <QuickStats
                    totalXp={data.quickStats.totalXp}
                    watchTimeMin={data.quickStats.watchTimeMin}
                    lessonsCompleted={data.quickStats.lessonsCompleted}
                  />
                  <SubjectsGrid subjects={data.subjects} />
                </>
              )}
            </div>

            {/* Right panel */}
            <div className="space-y-6 min-w-0">
              {!data ? (
                <>
                  <SoftCard className="p-6">
                    <div className="skeleton h-32 w-32 rounded-full mx-auto" />
                    <div className="skeleton h-3 w-3/4 rounded mt-4 mx-auto" />
                  </SoftCard>
                  <SoftCard className="p-6 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="skeleton h-8 w-full rounded-xl" />
                    ))}
                  </SoftCard>
                </>
              ) : (
                <>
                  <TodayProgressRing
                    percent={data.todayProgress.percent}
                    tasksDone={data.todayProgress.tasksDone}
                    tasksTotal={data.todayProgress.tasksTotal}
                  />
                  <ArenaRanking
                    leaderboard={data.leaderboard}
                    myRank={data.myRank}
                  />
                  <DailyGoals initial={data.dailyGoals} />
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
