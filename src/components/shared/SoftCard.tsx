import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function SoftCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white rounded-3xl shadow-soft border border-slate-100/60",
        className,
      )}
      {...props}
    />
  );
}
