import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { SoftCard } from "@/components/shared/SoftCard";
import { useAuth } from "@/hooks/useAuth";
import { getSubject } from "@/services/apiClient";
import type { SubjectFull, Chapter } from "@/lib/learningData";
import { ChapterRoadmap } from "@/components/learning/ChapterRoadmap";

export const Route = createFileRoute("/subjects/$subjectId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.subjectId} — Lumin` },
      { name: "description", content: "Choose a chapter and start learning." },
    ],
  }),
  component: SubjectDetail,
});

function SubjectDetail() {
  const { subjectId } = Route.useParams();
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [subject, setSubject] = useState<SubjectFull | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSubject(subjectId).then((s) => {
      if (!cancelled) {
        setSubject(s);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  // Sequential unlocking logic — chapter N unlocked only if chapter N-1 has 100% progress.
  const chaptersWithLock = useMemo(() => {
    if (!subject) return [];
    return subject.chapters.map((c, i, arr) => ({
      ...c,
      locked: i === 0 ? false : arr[i - 1].progress < 100,
    }));
  }, [subject]);

  const handleSelectChapter = (chapter: Chapter & { locked: boolean }) => {
    if (chapter.locked) return;
    navigate({
      to: "/subjects/$subjectId/$chapterId",
      params: { subjectId, chapterId: chapter.id },
    });
  };

  return (
    <div className="min-h-screen bg-app-mesh">
      <div className="max-w-[1500px] mx-auto p-4 lg:p-6 flex gap-6">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

        <main className="flex-1 min-w-0 pb-24 lg:pb-6">
          <Link
            to="/subjects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> All subjects
          </Link>

          {loading || !subject ? (
            <div className="space-y-4">
              <div className="skeleton h-9 w-64 rounded" />
              <div className="skeleton h-4 w-96 rounded" />
              <div className="skeleton h-32 w-full rounded-3xl mt-6" />
              <div className="skeleton h-32 w-full rounded-3xl" />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center gap-3 flex-wrap"
              >
                <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
                  {subject.name}
                </h1>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                  {subject.chapters.length} chapters
                </span>
              </motion.div>

              <SoftCard className="p-5 mb-6 flex items-start gap-3 bg-purple-50/40 border-purple-100">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    Sequential learning enabled
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Each chapter unlocks only after you finish the previous one
                    100%. Complete the lessons to keep moving forward.
                  </p>
                </div>
              </SoftCard>

              <ChapterRoadmap
                subjectId={subjectId}
                chapters={chaptersWithLock}
              />
            </>
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
