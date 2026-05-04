import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Tone = "purple" | "teal" | "pink" | "amber" | "rose" | "cyan";

const tones: Record<Tone, string> = {
  purple: "bg-purple-100 text-purple-600",
  teal: "bg-teal-100 text-teal-600",
  pink: "bg-pink-100 text-pink-600",
  amber: "bg-amber-100 text-amber-600",
  rose: "bg-rose-100 text-rose-600",
  cyan: "bg-cyan-100 text-cyan-600",
};

export function StatIcon({
  icon: Icon,
  tone = "purple",
  size = "md",
  className,
}: {
  icon: LucideIcon;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-12 w-12";
  const ic = size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl shrink-0",
        dim,
        tones[tone],
        className,
      )}
    >
      <Icon className={ic} strokeWidth={2.2} />
    </div>
  );
}

export const toneClasses = tones;
