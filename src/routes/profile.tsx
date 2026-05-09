import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  Mail,
  Phone,
  GraduationCap,
  Flame,
  Trophy,
  Clock,
  Bell,
  Moon,
  Volume2,
  LogOut,
  Pencil,
  Award,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { SoftCard } from "@/components/shared/SoftCard";
import { GradientButton } from "@/components/shared/GradientButton";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_USER } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Lumin" },
      { name: "description", content: "Your account, stats and learning preferences." },
    ],
  }),
  component: ProfilePage,
});

const BADGES = [
  { name: "First Lesson", color: "from-purple-500 to-purple-300" },
  { name: "7-day Streak", color: "from-orange-500 to-amber-300" },
  { name: "Quiz Master", color: "from-teal-500 to-cyan-300" },
  { name: "Top 10", color: "from-pink-500 to-rose-300" },
  { name: "Night Owl", color: "from-indigo-500 to-blue-300" },
  { name: "Perfect Score", color: "from-emerald-500 to-lime-300" },
];

function ProfilePage() {
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [notif, setNotif] = useState(true);
  const [dark, setDark] = useState(false);
  const [sound, setSound] = useState(true);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  const name = user?.name ?? MOCK_USER.name;
  const phone = user?.phone ?? MOCK_USER.phone;

  return (
    <div className="min-h-screen bg-app-mesh">
      <div className="max-w-[1500px] mx-auto p-4 lg:p-6 flex gap-6">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <main className="flex-1 min-w-0 pb-24 lg:pb-6">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-soft border border-purple-100 text-xs font-semibold text-purple-600 mb-3">
              <Sparkles className="h-3 w-3" /> Profile
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
              Your account
            </h1>
          </div>

          {/* Hero */}
          <SoftCard className="p-6 md:p-8 mb-5 bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-200/40 blur-2xl" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="relative">
                <img
                  src={MOCK_USER.avatar}
                  alt={name}
                  className="h-24 w-24 rounded-3xl bg-white shadow-soft-lg border-4 border-white"
                />
                <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 text-white flex items-center justify-center shadow-glow">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-2xl text-slate-800">{name}</h2>
                <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" /> {MOCK_USER.className}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> aarav@lumin.app
                  </span>
                </div>
              </div>
              <GradientButton variant="ghost">Edit profile</GradientButton>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { label: "Total XP", value: MOCK_USER.totalXp, icon: Trophy, tone: "purple" },
                { label: "Streak", value: "7d", icon: Flame, tone: "amber" },
                { label: "Watch time", value: "84m", icon: Clock, tone: "teal" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="p-3 md:p-4 rounded-2xl bg-white/80 backdrop-blur border border-white shadow-soft"
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center",
                        s.tone === "purple" && "bg-purple-50 text-purple-600",
                        s.tone === "amber" && "bg-amber-50 text-amber-600",
                        s.tone === "teal" && "bg-teal-50 text-teal-600",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-[11px] uppercase font-bold text-slate-500 tracking-wider mt-2">
                      {s.label}
                    </p>
                    <p className="font-display font-bold text-xl text-slate-800">{s.value}</p>
                  </div>
                );
              })}
            </div>
          </SoftCard>

          {/* Badges + settings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <SoftCard className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  Achievements
                </p>
                <span className="text-xs text-slate-400">6 / 24 unlocked</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {BADGES.map((b, i) => (
                  <motion.div
                    key={b.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={cn(
                        "h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-soft",
                        b.color,
                      )}
                    >
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-[10px] font-semibold text-slate-600 text-center leading-tight">
                      {b.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </SoftCard>

            <SoftCard className="p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-3">
                Preferences
              </p>
              <ul className="space-y-1">
                <ToggleRow
                  icon={Bell}
                  label="Notifications"
                  value={notif}
                  onChange={setNotif}
                />
                <ToggleRow icon={Moon} label="Dark mode" value={dark} onChange={setDark} />
                <ToggleRow
                  icon={Volume2}
                  label="Sound effects"
                  value={sound}
                  onChange={setSound}
                />
              </ul>

              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                className="w-full mt-5 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-rose-500 bg-rose-50 hover:bg-rose-100 font-semibold text-sm transition"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </SoftCard>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: typeof Bell;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <li className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition">
      <div className="h-9 w-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
        <Icon className="h-4 w-4" />
      </div>
      <span className="flex-1 text-sm font-semibold text-slate-800">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          "h-6 w-11 rounded-full transition relative",
          value ? "bg-gradient-to-r from-purple-500 to-purple-400" : "bg-slate-200",
        )}
        aria-pressed={value}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
            value ? "left-[22px]" : "left-0.5",
          )}
        />
      </button>
    </li>
  );
}
