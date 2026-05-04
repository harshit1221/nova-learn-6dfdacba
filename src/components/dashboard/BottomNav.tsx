import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, ClipboardList, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", icon: LayoutDashboard, to: "/dashboard" as const },
  { label: "Subjects", icon: BookOpen, to: "/dashboard" as const },
  { label: "Tests", icon: ClipboardList, to: "/dashboard" as const },
  { label: "Arena", icon: Trophy, to: "/dashboard" as const },
  { label: "Profile", icon: User, to: "/dashboard" as const },
];

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-white rounded-3xl shadow-soft-lg border border-slate-100 px-2 py-2 flex items-center justify-around">
      {items.map((item, i) => {
        const Icon = item.icon;
        const active = i === 0 && path === item.to;
        return (
          <Link
            key={item.label}
            to={item.to}
            className="flex-1 flex flex-col items-center gap-0.5 py-1.5"
          >
            <div
              className={cn(
                "h-9 w-9 flex items-center justify-center rounded-xl transition",
                active
                  ? "bg-gradient-to-br from-purple-500 to-purple-400 text-white shadow-glow"
                  : "text-slate-400",
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "text-[10px] font-semibold",
                active ? "text-purple-600" : "text-slate-400",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
