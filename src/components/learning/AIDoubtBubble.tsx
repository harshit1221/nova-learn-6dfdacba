import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Mic, Image as ImageIcon, X, Sparkles, Lightbulb } from "lucide-react";
import { askSocratic, type SocraticReply } from "@/services/apiClient";
import { cn } from "@/lib/utils";

/**
 * Floating AI Doubt Bubble — Socratic mode.
 * Pinned to the bottom-right of the lesson screen.
 */
export function AIDoubtBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<SocraticReply[]>([
    {
      role: "ai",
      text: "Hi! I'm in **Socratic Mode** — I won't just hand you the answer. Tell me where you're stuck and I'll guide you with questions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [recording, setRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking, open]);

  const send = async () => {
    if (!input.trim() || thinking) return;
    const next = [...messages, { role: "user" as const, text: input.trim() }];
    setMessages(next);
    setInput("");
    setThinking(true);
    const reply = await askSocratic(next, input.trim());
    setMessages((prev) => [...prev, reply]);
    setThinking(false);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-40 h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-400 text-white shadow-glow flex items-center justify-center"
        aria-label="Open AI doubt solver"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-pink-400 border-2 border-white" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-44 right-4 lg:bottom-24 lg:right-6 z-40 w-[calc(100vw-2rem)] sm:w-96 max-h-[70vh] bg-white rounded-3xl shadow-soft-lg border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-400 text-white flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Lumin AI</p>
                <p className="text-[11px] text-white/80 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Socratic Mode · here to make you think
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-white/15 flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} text={m.text} />
              ))}
              {thinking && (
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Bot className="h-4 w-4 text-purple-500" />
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" />
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </span>
                  Thinking…
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-100 bg-white">
              {recording && (
                <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold">
                  <span className="flex gap-0.5 items-end h-3">
                    {[3, 6, 4, 7, 5].map((h, i) => (
                      <motion.span
                        key={i}
                        animate={{ height: [`${h}px`, `${h + 6}px`, `${h}px`] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        className="w-0.5 bg-red-500 rounded-full"
                      />
                    ))}
                  </span>
                  Listening… (mock)
                </div>
              )}
              <div className="flex items-end gap-2">
                <div className="flex-1 flex items-center gap-1 bg-slate-50 rounded-2xl px-3 py-2 border border-slate-200 focus-within:border-purple-400 focus-within:bg-white transition">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="Ask a doubt…"
                    className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                  />
                  <button className="text-slate-400 hover:text-purple-600 p-1" title="Upload image">
                    <ImageIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setRecording((r) => !r)}
                    className={cn(
                      "p-1 transition",
                      recording ? "text-red-500" : "text-slate-400 hover:text-purple-600",
                    )}
                    title="Voice"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={send}
                  disabled={!input.trim() || thinking}
                  className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-400 text-white shadow-glow disabled:opacity-50 flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                <Lightbulb className="h-3 w-3" />
                Tip: AI will ask guiding questions, not give straight answers.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, text }: { role: "ai" | "user"; text: string }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] px-3.5 py-2 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-400 text-white text-sm shadow-soft">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <div className="h-7 w-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
        <Bot className="h-4 w-4" />
      </div>
      <div className="max-w-[85%] px-3.5 py-2 rounded-2xl bg-white text-slate-800 text-sm shadow-soft border border-slate-100">
        {text.split("**").map((part, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="text-purple-600">
              {part}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </div>
    </div>
  );
}
