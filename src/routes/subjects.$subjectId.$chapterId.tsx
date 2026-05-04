import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  Bookmark,
  ListChecks,
  StickyNote,
  Network,
  Globe,
  Lock,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { SoftCard } from "@/components/shared/SoftCard";
import { useAuth } from "@/hooks/useAuth";
import { getChapter, getLessonBundle } from "@/services/apiClient";
import { VideoPlayer } from "@/components/learning/VideoPlayer";
import { AIDoubtBubble } from "@/components/learning/AIDoubtBubble";
import type { Chapter, SubjectFull, Lesson } from "@/lib/learningData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/subjects/$subjectId/$chapterId")({
  head: () => ({
    meta: [{ title: "Lesson — Lumin" }],
  }),
  component: ChapterScreen,
});

type Tab = "notes" | "mcqs" | "bookmarks" | "concept";

function ChapterScreen() {
  const { subjectId, chapterId } = Route.useParams();
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(true);
  const [data, setData] = useState<{
    subject: SubjectFull;
    chapter: Chapter;
  } | null>(null);
  const [bundle, setBundle] = useState<Awaited<
    ReturnType<typeof getLessonBundle>
  > | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("notes");
  const [notesLang, setNotesLang] = useState<"en" | "hi">("en");
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  useEffect(() => {
    let cancelled = false;
    getChapter(subjectId, chapterId).then((res) => {
      if (cancelled || !res) return;
      // Sequential lock — confirm previous chapter is 100%
      const idx = res.subject.chapters.findIndex((c) => c.id === chapterId);
      const prev = idx > 0 ? res.subject.chapters[idx - 1] : null;
      if (prev && prev.progress < 100) {
        navigate({ to: "/subjects/$subjectId", params: { subjectId } });
        return;
      }
      setData(res);
      setActiveLessonId(res.chapter.lessons[0]?.id ?? null);
    });
    getLessonBundle().then((b) => {
      if (!cancelled) setBundle(b);
    });
    return () => {
      cancelled = true;
    };
  }, [subjectId, chapterId, navigate]);

  const activeLesson: Lesson | null = useMemo(
    () => data?.chapter.lessons.find((l) => l.id === activeLessonId) ?? null,
    [data, activeLessonId],
  );

  return (
    <div className="min-h-screen bg-app-mesh">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6 flex gap-6">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

        <main className="flex-1 min-w-0 pb-24 lg:pb-6">
          <Link
            to="/subjects/$subjectId"
            params={{ subjectId }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to chapters
          </Link>

          {!data || !activeLesson ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
              <div className="skeleton aspect-video w-full rounded-3xl" />
              <div className="skeleton h-96 w-full rounded-3xl" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
              {/* LEFT — 70% */}
              <div className="space-y-5 min-w-0">
                <VideoPlayer src={activeLesson.videoUrl} />

                <SoftCard className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                    Chapter {data.chapter.number} · {data.subject.name}
                  </p>
                  <h1 className="font-display font-bold text-2xl text-slate-800 mt-1">
                    {data.chapter.title}
                  </h1>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {data.chapter.description}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs">
                    <span className="text-slate-500">Now playing</span>
                    <span className="font-semibold text-slate-800">
                      {activeLesson.title} · {activeLesson.duration}
                    </span>
                  </div>
                </SoftCard>

                {/* Tabs */}
                <SoftCard className="p-2">
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                    <TabBtn active={tab === "notes"} onClick={() => setTab("notes")} icon={StickyNote}>
                      Notes
                    </TabBtn>
                    <TabBtn active={tab === "mcqs"} onClick={() => setTab("mcqs")} icon={ListChecks}>
                      MCQs
                    </TabBtn>
                    <TabBtn active={tab === "bookmarks"} onClick={() => setTab("bookmarks")} icon={Bookmark}>
                      Bookmarks
                    </TabBtn>
                    <TabBtn active={tab === "concept"} onClick={() => setTab("concept")} icon={Network}>
                      Concept Map
                    </TabBtn>
                  </div>
                </SoftCard>

                <SoftCard className="p-6 min-h-[260px]">
                  <AnimatePresence mode="wait">
                    {tab === "notes" && bundle && (
                      <motion.div
                        key="notes"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-display font-bold text-slate-800">
                            Quick Notes
                          </h3>
                          <div className="flex bg-slate-100 rounded-xl p-1">
                            <button
                              onClick={() => setNotesLang("en")}
                              className={cn(
                                "px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition",
                                notesLang === "en"
                                  ? "bg-white text-purple-600 shadow-soft"
                                  : "text-slate-500",
                              )}
                            >
                              <Globe className="h-3 w-3" /> EN
                            </button>
                            <button
                              onClick={() => setNotesLang("hi")}
                              className={cn(
                                "px-3 py-1 text-xs font-semibold rounded-lg transition",
                                notesLang === "hi"
                                  ? "bg-white text-purple-600 shadow-soft"
                                  : "text-slate-500",
                              )}
                            >
                              हिंदी
                            </button>
                          </div>
                        </div>
                        <NoteRender content={bundle.notes[notesLang]} />
                      </motion.div>
                    )}
                    {tab === "mcqs" && bundle && (
                      <motion.div
                        key="mcqs"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-5"
                      >
                        <h3 className="font-display font-bold text-slate-800">
                          Practice MCQs
                        </h3>
                        {bundle.mcqs.map((m, idx) => {
                          const picked = answers[m.id];
                          return (
                            <div key={m.id}>
                              <p className="font-semibold text-slate-800 text-sm">
                                {idx + 1}. {m.q}
                              </p>
                              <div className="grid sm:grid-cols-2 gap-2 mt-3">
                                {m.options.map((opt, i) => {
                                  const chosen = picked === i;
                                  const correct = picked != null && i === m.correct;
                                  const wrong = picked != null && chosen && i !== m.correct;
                                  return (
                                    <button
                                      key={i}
                                      onClick={() =>
                                        setAnswers((a) => ({ ...a, [m.id]: i }))
                                      }
                                      className={cn(
                                        "text-left text-sm px-3 py-2.5 rounded-xl border transition",
                                        picked == null && "border-slate-200 hover:border-purple-300 bg-white text-slate-700",
                                        correct && "border-emerald-200 bg-emerald-50 text-emerald-700",
                                        wrong && "border-red-200 bg-red-50 text-red-600",
                                        picked != null && !chosen && i !== m.correct && "border-slate-100 bg-slate-50 text-slate-500",
                                      )}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                    {tab === "bookmarks" && bundle && (
                      <motion.div
                        key="bm"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <h3 className="font-display font-bold text-slate-800 mb-3">
                          Your Bookmarks
                        </h3>
                        <ul className="space-y-2">
                          {bundle.bookmarks.map((b) => (
                            <li
                              key={b.id}
                              className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/40 border border-purple-100"
                            >
                              <span className="h-9 w-9 rounded-xl bg-white text-purple-600 flex items-center justify-center font-bold text-xs">
                                {b.time}
                              </span>
                              <span className="flex-1 text-sm font-semibold text-slate-800">
                                {b.title}
                              </span>
                              <PlayCircle className="h-5 w-5 text-purple-500" />
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                    {tab === "concept" && bundle && (
                      <motion.div
                        key="cm"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <h3 className="font-display font-bold text-slate-800 mb-3">
                          Concept Map
                        </h3>
                        <ConceptMap nodes={bundle.conceptMap} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SoftCard>
              </div>

              {/* RIGHT — 30% lessons list */}
              <aside className="min-w-0">
                <SoftCard className="p-5 lg:sticky lg:top-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-slate-800">
                      Lessons
                    </h3>
                    <span className="text-xs font-semibold text-purple-600">
                      {data.chapter.lessons.filter((l) => l.watched).length}/
                      {data.chapter.lessons.length} done
                    </span>
                  </div>
                  <ul className="space-y-2 max-h-[70vh] overflow-y-auto scrollbar-hide pr-1">
                    {data.chapter.lessons.map((l, i) => {
                      const active = l.id === activeLessonId;
                      const locked = i > 0 && !data.chapter.lessons[i - 1].watched && !l.watched;
                      return (
                        <li key={l.id}>
                          <button
                            onClick={() => !locked && setActiveLessonId(l.id)}
                            disabled={locked}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition",
                              active && "border-purple-300 bg-purple-50",
                              !active && !locked && "border-slate-100 bg-white hover:border-purple-200",
                              locked && "border-slate-100 bg-slate-50/60 opacity-60 cursor-not-allowed",
                            )}
                          >
                            <span
                              className={cn(
                                "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold",
                                active && "bg-gradient-to-br from-purple-500 to-purple-400 text-white shadow-glow",
                                !active && l.watched && "bg-emerald-100 text-emerald-600",
                                !active && !l.watched && !locked && "bg-purple-50 text-purple-600",
                                locked && "bg-slate-100 text-slate-400",
                              )}
                            >
                              {locked ? (
                                <Lock className="h-4 w-4" />
                              ) : l.watched ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <PlayCircle className="h-4 w-4" />
                              )}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span
                                className={cn(
                                  "block text-sm font-semibold truncate",
                                  active ? "text-slate-800" : "text-slate-700",
                                )}
                              >
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

      <AIDoubtBubble />
      <BottomNav />
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof StickyNote;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2 transition shrink-0",
        active
          ? "bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-glow"
          : "text-slate-500 hover:bg-slate-50",
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function NoteRender({ content }: { content: string }) {
  // Tiny markdown-ish renderer for our seeded notes.
  return (
    <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
      {content.split("\n\n").map((para, i) => {
        if (para.startsWith("### ")) {
          return (
            <h4 key={i} className="font-display font-bold text-slate-800 text-base">
              {para.replace("### ", "")}
            </h4>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line">
            {para.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**"))
                return <strong key={j} className="text-slate-800">{part.slice(2, -2)}</strong>;
              if (part.startsWith("*") && part.endsWith("*"))
                return <em key={j} className="text-purple-600 not-italic font-semibold">{part.slice(1, -1)}</em>;
              if (part.startsWith("`") && part.endsWith("`"))
                return <code key={j} className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-xs font-mono">{part.slice(1, -1)}</code>;
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

function ConceptMap({
  nodes,
}: {
  nodes: { id: string; label: string; x: number; y: number; kind: "current" | "prereq" | "next" }[];
}) {
  const current = nodes.find((n) => n.kind === "current")!;
  return (
    <div className="relative w-full h-[300px] rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 border border-slate-100 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {nodes
          .filter((n) => n.kind !== "current")
          .map((n) => (
            <line
              key={n.id}
              x1={current.x}
              y1={current.y}
              x2={n.x}
              y2={n.y}
              stroke="rgba(168, 85, 247, 0.35)"
              strokeWidth={0.4}
              strokeDasharray="1.5 1"
            />
          ))}
      </svg>
      {nodes.map((n) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shadow-soft",
            n.kind === "current" && "bg-gradient-to-br from-purple-500 to-purple-400 text-white shadow-glow scale-110",
            n.kind === "prereq" && "bg-white text-slate-700 border border-purple-100",
            n.kind === "next" && "bg-white text-pink-600 border border-pink-100",
          )}
        >
          {n.label}
        </motion.div>
      ))}
    </div>
  );
}
