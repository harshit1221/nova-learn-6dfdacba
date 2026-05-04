import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
};

export function GradientButton({
  className,
  loading,
  disabled,
  children,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed select-none";
  const sizes = size === "lg" ? "px-7 py-3.5 text-base" : "px-5 py-2.5 text-sm";
  const styles =
    variant === "primary"
      ? "text-white bg-gradient-to-r from-purple-500 to-purple-400 shadow-glow hover:shadow-soft-lg"
      : "text-purple-600 bg-purple-50 hover:bg-purple-100";

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={cn(base, sizes, styles, className)}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  );
}
