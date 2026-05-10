import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  Lock,
  Clock,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { SoftCard } from "@/components/shared/SoftCard";
import { GradientButton } from "@/components/shared/GradientButton";
import { VideoPlayer } from "@/components/learning/VideoPlayer";
import { useAuth } from "@/hooks/useAuth";
import { getChapter } from "@/services/apiClient";
import type { Chapter, SubjectFull, Lesson } from "@/lib/learningData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/player/$subjectId/$chapterId")({
  head: () => ({
    meta: [{ title: "Video Player — Lumin" }],
  }),
  component: PlayerScreen,
});

function PlayerScreen() {
  const { subjectId, chapterId } = Route.useParams();
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(true);
  const [data, setData] = useState<{
    subject: SubjectFull;
    chapter: Chapter;
  } | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  useEffect(() => {
    let cancelled = false;
    getChapter(subjectId, chapterId).then((res) => {
      if (cancelled || !res) return;
      setData(res);
      setActiveLessonId(res.chapter.lessons[0]?.id ?? null);
      // Seed completion from mock "watched" flag
      const seed: Record<string, boolean> = {};
      res.chapter.lessons.forEach((l) => (seed[l.id] = l.watched));
      setCompleted(seed);
    });
    return () => {
      cancelled = true;
    };
  }, [subjectId, chapterId]);

  const activeLesson: Lesson | null = useMemo(
    () => data?.chapter.lessons.find((l) => l.id === activeLessonId) ?? null,
    [data, activeLessonId],
  );

  const lessonIdx = useMemo(() => {
    if (!data || !activeLessonId) return -1;
    return data.chapter.lessons.findIndex((l) => l.id === activeLessonId);
  }, [data, activeLessonId]);

  const chapterIdx = useMemo(() => {
    if (!data) return -1;
    return data.subject.chapters.findIndex((c) => c.id === chapterId);
  }, [data, chapterId]);

  const prevChapter =
    data && chapterIdx > 0 ? data.subject.chapters[chapterIdx - 1] : null;
  const nextChapter =
    data && chapterIdx >= 0 && chapterIdx < data.subject.chapters.length - 1
      ? data.subject.chapters[chapterIdx + 1]
      : null;

  const totalLessons = data?.chapter.lessons.length ?? 0;
  const doneLessons = data
    ? data.chapter.lessons.filter((l) => completed[l.id]).length
    : 0;
  const chapterProgress = totalLessons
    ? Math.round((doneLessons / totalLessons) * 100)
    : 0;

  const goToLesson = (offset: number) => {
    if (!data || lessonIdx < 0) return;
    const next = data.chapter.lessons[lessonIdx + offset];
    if (next) setActiveLessonId(next.id);
  };

  const markComplete = () => {
    if (!activeLessonId) return;
    setCompleted((c) => ({ ...c, [activeLessonId]: true }));
    setJustCompleted(true);
    setTimeout(() => setJustCompleted(false), 1800);
    // Auto-advance to next lesson if available
    setTimeout(() => goToLesson(1), 600);
  };

  return (
    <div className="min-h-screen bg-app-mesh">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6 flex gap-6">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

        <main className="flex-1 min-w-0 pb-24 lg:pb-6">
          {/* Breadcrumb */}
          <Link
            to="/subjects/$subjectId/$chapterId"
            params={{ subjectId, chapterId }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to chapter
          </Link>

          {!data || !activeLesson ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
              <div className="skeleton aspect-video w-full rounded-3xl" />
              <div className="skeleton h-96 w-full rounded-3xl" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
              {/* LEFT: Player + description + nav */}
              <div className="space-y-5 min-w-0">
                <VideoPlayer
                  key={activeLesson.id}
                  src={activeLesson.videoUrl}
                />

                {/* Title + meta */}
                <SoftCard className="p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                        Chapter {data.chapter.number} · Lesson {lessonIdx + 1} of{" "}
                        {totalLessons}
                      </p>
                      <h1 className="font-display font-bold text-2xl text-slate-800 mt-1">
                        {activeLesson.title}
                      </h1>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {activeLesson.duration}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {data.subject.name} · {data.chapter.title}
                        </span>
                      </div>
                    </div>

                    {/* Mark complete button */}
                    <div className="relative">
                      <GradientButton
                        onClick={markComplete}
                        disabled={completed[activeLesson.id]}
                        variant={completed[activeLesson.id] ? "ghost" : "primary"}
                      >
                        {completed[activeLesson.id] ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" /> Completed
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" /> Mark as complete
                          </>
                        )}
                      </GradientButton>
                      <AnimatePresence>
                        {justCompleted && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.9 }}
                            animate={{ opacity: 1, y: -8, scale: 1 }}
                            exit={{ opacity: 0, y: -16 }}
                            className="absolute right-0 -top-7 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold shadow-soft"
                          >
                            <Sparkles className="h-3 w-3" /> +10 XP
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-5 pt-5 border-t border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800 mb-2">
                      About this lesson
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {data.chapter.description}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                      <span>Chapter progress</span>
                      <span className="text-purple-600">
                        {doneLessons}/{totalLessons} · {chapterProgress}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${chapterProgress}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                </SoftCard>

                {/* Lesson prev/next */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => goToLesson(-1)}
                    disabled={lessonIdx <= 0}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition",
                      lessonIdx <= 0
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-white text-slate-700 hover:bg-purple-50 shadow-soft",
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous lesson
                  </button>
                  <button
                    onClick={() => goToLesson(1)}
                    disabled={lessonIdx >= totalLessons - 1}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition",
                      lessonIdx >= totalLessons - 1
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-white text-slate-700 hover:bg-purple-50 shadow-soft",
                    )}
                  >
                    Next lesson <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Chapter prev/next */}
                <SoftCard className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Chapter navigation
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {prevChapter ? (
                      <Link
                        to="/player/$subjectId/$chapterId"
                        params={{ subjectId, chapterId: prevChapter.id }}
                        className="group flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/40 transition"
                      >
                        <span className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-100">
                          <ChevronLeft className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[11px] font-bold uppercase text-slate-500">
                            Previous chapter
                          </span>
                          <span className="block text-sm font-semibold text-slate-800 truncate">
                            {prevChapter.number}. {prevChapter.title}
                          </span>
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
                        <Lock className="h-4 w-4" /> No previous chapter
                      </div>
                    )}
                    {nextChapter ? (
                      <Link
                        to="/player/$subjectId/$chapterId"
                        params={{ subjectId, chapterId: nextChapter.id }}
                        className="group flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/40 transition justify-end text-right"
                      >
                        <span className="min-w-0">
                          <span className="block text-[11px] font-bold uppercase text-slate-500">
                            Next chapter
                          </span>
                          <span className="block text-sm font-semibold text-slate-800 truncate">
                            {nextChapter.number}. {nextChapter.title}
                          </span>
                        </span>
                        <span className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-100">
                          <ChevronRight className="h-5 w-5" />
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center justify-end gap-3 p-3 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
                        Last chapter <Lock className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </SoftCard>
              </div>

              {/* RIGHT: Lessons in this chapter */}
              <aside className="min-w-0">
                <SoftCard className="p-5 lg:sticky lg:top-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-slate-800">
                      Up next
                    </h3>
                    <span className="text-xs font-semibold text-purple-600">
                      {doneLessons}/{totalLessons}
                    </span>
                  </div>
                  <ul className="space-y-2 max-h-[70vh] overflow-y-auto scrollbar-hide pr-1">
                    {data.chapter.lessons.map((l, i) => {
                      const active = l.id === activeLessonId;
                      const isDone = completed[l.id];
                      return (
                        <li key={l.id}>
                          <button
                            onClick={() => setActiveLessonId(l.id)}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition",
                              active && "border-purple-300 bg-purple-50",
                              !active &&
                                "border-slate-100 bg-white hover:border-purple-200",
                            )}
                          >
                            <span
                              className={cn(
                                "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold",
                                active &&
                                  "bg-gradient-to-br from-purple-500 to-purple-400 text-white shadow-glow",
                                !active && isDone &&
                                  "bg-emerald-100 text-emerald-600",
                                !active && !isDone &&
                                  "bg-purple-50 text-purple-600",
                              )}
                            >
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <PlayCircle className="h-4 w-4" />
                              )}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm font-semibold truncate text-slate-800">
                                {i + 1}. {l.title}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {l.duration}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </SoftCard>
              </aside>
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
