import { motion } from "framer-motion";
import { Lock, Check, Play, BookOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Chapter } from "@/lib/learningData";
import { cn } from "@/lib/utils";

type ChapterWithLock = Chapter & { locked: boolean };

/**
 * Visual roadmap of chapters arranged like a skill tree.
 * Sequential unlocking: a chapter is locked unless the previous one hits 100%.
 * Connecting paths use SVG between alternating nodes.
 */
export function ChapterRoadmap({
  subjectId,
  chapters,
}: {
  subjectId: string;
  chapters: ChapterWithLock[];
}) {
  return (
    <div className="relative">
      <div className="flex flex-col gap-5">
        {chapters.map((c, i) => {
          const align = i % 2 === 0 ? "self-start" : "self-end";
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn("w-full sm:w-[78%] md:w-[68%] relative", align)}
            >
              {/* Connector */}
              {i > 0 && (
                <div
                  className={cn(
                    "hidden sm:block absolute -top-5 h-5 w-0.5 bg-gradient-to-b from-purple-200 to-purple-100",
                    i % 2 === 0 ? "left-12" : "right-12",
                  )}
                />
              )}
              <ChapterNode chapter={c} subjectId={subjectId} index={i + 1} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ChapterNode({
  chapter,
  subjectId,
  index,
}: {
  chapter: ChapterWithLock;
  subjectId: string;
  index: number;
}) {
  const completed = chapter.progress >= 100;
  const inProgress = chapter.progress > 0 && chapter.progress < 100;

  const inner = (
    <div
      className={cn(
        "w-full text-left bg-white rounded-3xl p-5 md:p-6 shadow-soft border border-slate-100 transition-all relative overflow-hidden",
        chapter.locked && "opacity-70 cursor-not-allowed",
        !chapter.locked && "hover:shadow-soft-lg cursor-pointer hover:-translate-y-0.5",
      )}
    >
      {/* Decorative blob */}
      <div
        className={cn(
          "absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl opacity-50",
          completed && "bg-emerald-100",
          inProgress && "bg-purple-100",
          !completed && !inProgress && !chapter.locked && "bg-pink-100",
          chapter.locked && "bg-slate-100",
        )}
      />

      <div className="relative flex items-start gap-4">
        {/* Big numbered icon */}
        <div
          className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center font-display font-bold text-lg shrink-0",
            chapter.locked && "bg-slate-100 text-slate-400",
            completed && "bg-gradient-to-br from-emerald-400 to-teal-400 text-white shadow-glow",
            inProgress && "bg-gradient-to-br from-purple-500 to-purple-400 text-white shadow-glow",
            !chapter.locked && !completed && !inProgress && "bg-purple-50 text-purple-600",
          )}
        >
          {chapter.locked ? (
            <Lock className="h-6 w-6" />
          ) : completed ? (
            <Check className="h-6 w-6" strokeWidth={3} />
          ) : (
            <span>{index}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
              Chapter {chapter.number}
            </span>
            {completed && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                Completed
              </span>
            )}
            {chapter.locked && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                Locked
              </span>
            )}
          </div>
          <h3 className="font-display font-bold text-slate-800 mt-1 text-lg">
            {chapter.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
            {chapter.description}
          </p>

          {!chapter.locked && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-500 font-medium">
                  {chapter.lessons.length} lessons
                </span>
                <span className="text-slate-700 font-bold">{chapter.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${chapter.progress}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                />
              </div>
            </div>
          )}

          {chapter.locked && (
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
              <Lock className="h-3 w-3" /> Complete the previous chapter to unlock
            </p>
          )}
        </div>

        {!chapter.locked && (
          <div className="hidden md:flex h-10 w-10 rounded-xl bg-purple-50 items-center justify-center text-purple-600 shrink-0">
            {inProgress || completed ? (
              <Play className="h-4 w-4" fill="currentColor" />
            ) : (
              <BookOpen className="h-4 w-4" />
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (chapter.locked) {
    return <div aria-disabled="true">{inner}</div>;
  }

  return (
    <Link
      to="/player/$subjectId/$chapterId"
      params={{ subjectId, chapterId: chapter.id }}
      className="block"
    >
      {inner}
    </Link>
  );
}
