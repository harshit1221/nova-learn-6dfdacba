import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function VideoPlayer({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onTime = () => setProgress(v.currentTime);
    const onMeta = () => {
      setDuration(v.duration || 0);
      setLoading(false);
    };
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("playing", onPlaying);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("playing", onPlaying);
    };
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${r}`;
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = ref.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * duration;
  };

  return (
    <div
      className={cn(
        "relative bg-slate-900 rounded-3xl overflow-hidden group shadow-soft-lg",
        className,
      )}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted={muted}
        playsInline
        className="w-full aspect-video object-cover"
        onClick={toggle}
      />

      {/* Center play */}
      <AnimatePresence>
        {!playing && !loading && (
          <motion.button
            key="play"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={toggle}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="h-16 w-16 rounded-full bg-white/95 flex items-center justify-center shadow-glow">
              <Play className="h-7 w-7 text-purple-600 ml-1" fill="currentColor" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
      )}

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div
          onClick={seek}
          className="h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer mb-2.5"
        >
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
          />
        </div>
        <div className="flex items-center gap-3 text-white">
          <button onClick={toggle} className="hover:scale-110 transition">
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button onClick={() => setMuted((m) => !m)} className="hover:scale-110 transition">
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <span className="text-xs font-medium tabular-nums">
            {fmt(progress)} / {fmt(duration)}
          </span>
          <div className="ml-auto">
            <button
              onClick={() => ref.current?.requestFullscreen?.()}
              className="hover:scale-110 transition"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
