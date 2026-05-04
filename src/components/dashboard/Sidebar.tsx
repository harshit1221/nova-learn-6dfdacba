import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Bot,
  FileBarChart2,
  Trophy,
  User,
  ChevronDown,
  Sparkles,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { id: "subjects", label: "Subjects", icon: BookOpen, expandable: true },
  { id: "tests", label: "Tests", icon: ClipboardList },
  { id: "ai", label: "AI Doubt Solver", icon: Bot },
  { id: "report", label: "Report Card", icon: FileBarChart2 },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "profile", label: "Profile", icon: User },
];

const subjectChapters = [
  "Mathematics",
  "Science",
  "English",
  "Social Studies",
  "Hindi",
  "Computer",
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [subjectsOpen, setSubjectsOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col bg-white rounded-3xl shadow-soft border border-slate-100/60 sticky top-4 self-start transition-all",
        collapsed ? "w-20 p-3" : "w-64 p-5",
      )}
      style={{ maxHeight: "calc(100vh - 2rem)" }}
    >
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center shadow-glow shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-800">Lumin</span>
          </Link>
        )}
        {collapsed && (
          <div className="h-9 w-9 mx-auto rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition self-center mb-3"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.to ? path === item.to : false;

          if (item.expandable && !collapsed) {
            return (
              <div key={item.id}>
                <button
                  onClick={() => setSubjectsOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      subjectsOpen && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {subjectsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-9 mt-1 space-y-0.5 border-l border-slate-100 pl-3">
                        {subjectChapters.map((s) => (
                          <button
                            key={s}
                            className="w-full text-left text-xs text-slate-500 hover:text-purple-600 py-1.5"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          const inner = (
            <span
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition",
                isActive
                  ? "bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-glow"
                  : "text-slate-600 hover:bg-slate-50",
                collapsed && "justify-center px-0",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="text-sm font-semibold">{item.label}</span>}
            </span>
          );

          if (item.to) {
            return (
              <Link key={item.id} to={item.to}>
                {inner}
              </Link>
            );
          }
          return (
            <button key={item.id} className="w-full text-left">
              {inner}
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => {
          logout();
          navigate({ to: "/" });
        }}
        className={cn(
          "mt-4 flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition",
          collapsed && "justify-center px-0",
        )}
      >
        <LogOut className="h-5 w-5" />
        {!collapsed && <span className="text-sm font-semibold">Logout</span>}
      </button>
    </aside>
  );
}
