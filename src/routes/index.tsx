import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Trophy,
  Brain,
  Target,
  PlayCircle,
  GraduationCap,
  Rocket,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { GradientButton } from "@/components/shared/GradientButton";
import { SoftCard } from "@/components/shared/SoftCard";
import { StatIcon } from "@/components/shared/StatIcon";
import { LoginModal } from "@/components/auth/LoginModal";
import { fadeUp, stagger } from "@/lib/motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumin — Learning that feels like a game" },
      {
        name: "description",
        content:
          "A premium, gamified e-learning platform for classes 1–12. Watch lessons, take tests, climb the arena, and earn XP every day.",
      },
      { property: "og:title", content: "Lumin — Learning that feels like a game" },
      {
        property: "og:description",
        content: "Premium gamified e-learning for classes 1–12.",
      },
    ],
  }),
  component: LandingPage,
});

const features = [
  {
    icon: PlayCircle,
    tone: "purple" as const,
    title: "Bite-sized video lessons",
    desc: "Crisp explainers from top educators, mapped to your class & syllabus.",
  },
  {
    icon: Brain,
    tone: "teal" as const,
    title: "AI Doubt Solver",
    desc: "Stuck on a question? Snap or type — get a step-by-step solution instantly.",
  },
  {
    icon: Trophy,
    tone: "pink" as const,
    title: "Arena & Leaderboards",
    desc: "Compete with peers, climb ranks weekly, and earn XP for every win.",
  },
  {
    icon: Target,
    tone: "amber" as const,
    title: "Daily goals & streaks",
    desc: "Tiny daily wins compound. Build a study habit that actually sticks.",
  },
];

function LandingPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-app-mesh">
      {/* Header */}
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-slate-800">
            Lumin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
          >
            Login
          </button>
          <GradientButton onClick={() => setOpen(true)}>
            Get Started
          </GradientButton>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 lg:px-12 pt-10 lg:pt-20 pb-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-soft border border-purple-100 text-sm font-medium text-purple-700 mb-6"
          >
            <Rocket className="h-4 w-4" />
            Learning, reimagined for Gen-Z
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-display font-extrabold text-slate-800 leading-tight"
          >
            Master your class.{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Beat the leaderboard.
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Lumin turns your school syllabus into a game — videos, mock tests,
            an AI doubt solver, daily quests, and weekly arenas. Built for
            classes 1 to 12.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <GradientButton size="lg" onClick={() => setOpen(true)}>
              Start free — log in with phone
            </GradientButton>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <GraduationCap className="h-4 w-4" />
              Trusted by 50,000+ students
            </div>
          </motion.div>

          {/* Floating preview card */}
          <motion.div
            variants={fadeUp}
            className="mt-16 max-w-3xl mx-auto"
          >
            <SoftCard className="p-6 md:p-8 text-left">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
                    Today's progress
                  </p>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">
                    You: 450 XP · Top: 600 XP
                  </h3>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                  🔥 7-day streak
                </div>
              </div>
              <div className="mt-5 h-3 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <StatIcon icon={Trophy} tone="purple" size="sm" />
                  <div>
                    <p className="text-xs text-slate-500">Total XP</p>
                    <p className="text-sm font-bold text-slate-800">450</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatIcon icon={PlayCircle} tone="teal" size="sm" />
                  <div>
                    <p className="text-xs text-slate-500">Watch time</p>
                    <p className="text-sm font-bold text-slate-800">1h 24m</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatIcon icon={Target} tone="pink" size="sm" />
                  <div>
                    <p className="text-xs text-slate-500">Lessons</p>
                    <p className="text-sm font-bold text-slate-800">37 done</p>
                  </div>
                </div>
              </div>
            </SoftCard>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-12 pb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
              Everything you need to ace your class
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              No more boring PDFs. Lumin turns studying into something you'll
              actually open every day.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <SoftCard className="p-6 h-full">
                  <StatIcon icon={f.icon} tone={f.tone} />
                  <h3 className="font-bold text-slate-800 mt-4">{f.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {f.desc}
                  </p>
                </SoftCard>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 text-center"
          >
            <SoftCard className="p-8 md:p-12 inline-block max-w-2xl">
              <h3 className="text-2xl font-display font-bold text-slate-800">
                Ready to level up your studies?
              </h3>
              <p className="text-slate-500 mt-2">
                Sign up in under 30 seconds. No credit card needed.
              </p>
              <GradientButton
                size="lg"
                onClick={() => setOpen(true)}
                className="mt-6"
              >
                Get Started Free
              </GradientButton>
            </SoftCard>
          </motion.div>
        </div>
      </section>

      <footer className="px-6 lg:px-12 py-8 border-t border-slate-200/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-slate-800">Lumin</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 Lumin Learning. Built with ✨ for students.
          </p>
        </div>
      </footer>

      <LoginModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
