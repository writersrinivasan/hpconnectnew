"use client";

import { AnimatePresence, motion } from "framer-motion";
import { STEPS, type StepStatus } from "@/lib/assistant/steps";
import type { Msg } from "./useAssistant";

const STATUS: Record<StepStatus, { label: string; bg: string; fg: string }> = {
  idle: { label: "Waiting", bg: "rgba(255,255,255,.08)", fg: "rgba(255,255,255,.5)" },
  active: { label: "Working…", bg: "#fde047", fg: "#000" },
  done: { label: "Done", bg: "#22c55e", fg: "#000" },
  warn: { label: "Heads-up", bg: "#f59e0b", fg: "#000" },
  blocked: { label: "Stopped", bg: "#ef4444", fg: "#fff" },
  skipped: { label: "Skipped", bg: "rgba(255,255,255,.12)", fg: "rgba(255,255,255,.6)" },
};

const CONFETTI = ["🎉", "✨", "💚", "⭐", "🎊", "💜", "🩺", "✨"];

export default function WorkflowStage({ msg, question, compact = false }: { msg?: Msg; question?: string; compact?: boolean }) {
  if (!msg) return <Idle />;
  const steps = msg.steps ?? {};
  const finished = !msg.pending && !!msg.meta;
  const doneCount = STEPS.filter((s) => ["done", "warn", "blocked", "skipped"].includes(steps[s.id]?.status ?? "")).length;
  const activeId = STEPS.find((s) => steps[s.id]?.status === "active")?.id;
  const stopped = STEPS.some((s) => steps[s.id]?.status === "blocked");

  return (
    <div className="relative flex h-full flex-col">
      {question && (
        <div className="mb-3 rounded-2xl bg-white/[.06] p-3 text-[13px]">
          <span className="text-muted">You asked: </span>
          <span className="font-semibold">“{question.length > 110 ? question.slice(0, 110) + "…" : question}”</span>
        </div>
      )}
      <div className="mb-3">
        <div className="mb-1 flex justify-between text-[11px] font-bold uppercase tracking-wider text-muted">
          <span>Agent workflow · live</span>
          <span>
            {doneCount}/{STEPS.length}
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-[linear-gradient(90deg,#f43f5e,#8b5cf6,#f59e0b,#06b6d4,#10b981)]" animate={{ width: `${(doneCount / STEPS.length) * 100}%` }} transition={{ type: "spring", stiffness: 80 }} />
        </div>
      </div>

      <div className="scroll-thin relative flex-1 overflow-y-auto pr-1">
        {STEPS.map((s, i) => {
          const st = steps[s.id] ?? { status: "idle" as StepStatus };
          const on = st.status !== "idle" && st.status !== "skipped";
          const isActive = st.status === "active";
          const next = STEPS[i + 1];
          const lineOn = ["done", "warn"].includes(st.status) && next && (steps[next.id]?.status ?? "idle") !== "idle" && steps[next.id]?.status !== "skipped";
          return (
            <div key={s.id} className="relative flex gap-3 pb-3">
              {/* connector */}
              {next && (
                <div className="absolute left-[25px] top-[54px] h-[calc(100%-50px)] w-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div className="w-full rounded-full" style={{ background: `linear-gradient(${s.color}, ${next.color})` }} initial={{ height: 0 }} animate={{ height: lineOn ? "100%" : 0 }} transition={{ duration: 0.5 }} />
                </div>
              )}
              {/* station bubble */}
              <div className="relative shrink-0">
                <motion.div
                  className="relative grid h-[54px] w-[54px] place-items-center rounded-full border-[3px] text-2xl"
                  style={{ borderColor: on ? s.color : "rgba(255,255,255,.15)", background: on ? `radial-gradient(circle at 30% 30%, ${s.color}aa, ${s.color}33)` : "rgba(255,255,255,.04)", boxShadow: isActive ? `0 0 34px ${s.color}` : on ? `0 0 14px ${s.color}66` : "none", filter: st.status === "skipped" ? "grayscale(1)" : undefined, opacity: st.status === "skipped" ? 0.45 : 1 }}
                  animate={isActive ? { scale: [1, 1.12, 1], rotate: [0, -8, 8, 0] } : { scale: on ? 1 : 0.92, rotate: 0 }}
                  transition={isActive ? { repeat: Infinity, duration: 1.1 } : { type: "spring", stiffness: 300, damping: 14 }}
                >
                  {st.status === "blocked" ? "⛔" : s.emoji}
                  {isActive && <span className="pulse-ring absolute inset-0 rounded-full" style={{ border: `3px solid ${s.color}` }} />}
                </motion.div>
                {isActive && (
                  <motion.div layoutId={`mascot-${msg.id}`} className="absolute -right-3 -top-3 text-xl" transition={{ type: "spring", stiffness: 200, damping: 18 }}>
                    <motion.span className="inline-block" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>
                      🤖
                    </motion.span>
                  </motion.div>
                )}
                <AnimatePresence>
                  {st.status === "done" && !compact && (
                    <motion.span key="spark" initial={{ opacity: 1, y: 0, scale: 0.6 }} animate={{ opacity: 0, y: -26, scale: 1.3 }} transition={{ duration: 0.9 }} className="pointer-events-none absolute -right-1 top-0 text-sm">
                      ✨
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {/* text */}
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold" style={{ color: on ? s.color : "rgba(255,255,255,.6)" }}>
                    {i + 1}. {s.name}
                  </span>
                  <motion.span key={st.status} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="rounded-full px-2 py-0.5 text-[10px] font-black" style={{ background: STATUS[st.status].bg, color: STATUS[st.status].fg }}>
                    {STATUS[st.status].label}
                  </motion.span>
                  {st.ms != null && <span className="ml-auto font-mono text-[10px] text-white/50">{st.ms} ms</span>}
                </div>
                <div className="text-[12.5px] leading-snug text-white/75">{st.detail ?? s.what}</div>
                {!compact && st.status === "idle" && <div className="mt-0.5 font-mono text-[10px] text-white/35">{s.tech}</div>}
                {st.chips && st.chips.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {st.chips.map((c, j) => (
                      <motion.span key={c} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: j * 0.08 }} className="rounded-full border px-2 py-0.5 text-[11px] font-semibold" style={{ borderColor: `${s.color}66`, background: `${s.color}1f` }}>
                        {c}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* finish line */}
        <div className="relative flex items-center gap-3">
          <motion.div className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-2xl border-[3px] text-2xl" animate={{ scale: finished ? [1, 1.25, 1] : 1, borderColor: finished ? (stopped ? "#ef4444" : "#22c55e") : "rgba(255,255,255,.15)" }} transition={{ duration: 0.6 }}>
            {finished ? (stopped ? "🛡️" : "🎉") : activeId ? "⏳" : "🏁"}
          </motion.div>
          <div>
            <div className="font-extrabold">{finished ? (stopped ? "Safely handled!" : "Answer delivered!") : "Answer"}</div>
            <div className="text-[12px] text-white/60">{finished ? `${(msg.meta!.ms / 1000).toFixed(1)} s total · ${msg.meta!.tokens} tokens${msg.meta!.topic ? ` · ${msg.meta!.topic}` : ""}` : msg.error ? `Oops: ${msg.error}` : "Words stream in as they're written"}</div>
          </div>
          <AnimatePresence>
            {finished && !compact && !stopped && (
              <div className="pointer-events-none absolute left-6 top-0">
                {CONFETTI.map((c, i) => (
                  <motion.span key={i} className="absolute text-lg" initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x: Math.cos((i / CONFETTI.length) * Math.PI * 2) * 90, y: Math.sin((i / CONFETTI.length) * Math.PI * 2) * 60 - 30, opacity: 0, rotate: 200 }} transition={{ duration: 1.4, ease: "easeOut" }}>
                    {c}
                  </motion.span>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Idle() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <motion.div className="text-6xl" animate={{ y: [0, -10, 0], rotate: [0, -6, 6, 0] }} transition={{ repeat: Infinity, duration: 2.4 }}>
        🤖
      </motion.div>
      <div className="mt-3 text-lg font-extrabold">Ask me anything about the clinic!</div>
      <p className="mt-1 max-w-xs text-sm text-muted">When you do, you&apos;ll see my 5 helper agents light up here one by one, like a relay race.</p>
      <div className="mt-5 flex gap-2">
        {STEPS.map((s, i) => (
          <motion.div key={s.id} className="grid h-11 w-11 place-items-center rounded-full border-2 text-xl" style={{ borderColor: s.color, background: `${s.color}22` }} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.15 }}>
            {s.emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function MiniFlow({ msg, onClick, selected }: { msg: Msg; onClick?: () => void; selected?: boolean }) {
  return (
    <button onClick={onClick} className={`mt-2 flex items-center gap-1 rounded-full px-2 py-1 transition ${selected ? "bg-white/12 ring-1 ring-cyan-400/60" : "bg-white/5 hover:bg-white/10"}`} title="Show this answer's workflow">
      {STEPS.map((s, i) => {
        const st = msg.steps?.[s.id]?.status ?? "idle";
        return (
          <span key={s.id} className="flex items-center">
            <span className="grid h-6 w-6 place-items-center rounded-full text-[12px]" style={{ background: st === "idle" || st === "skipped" ? "rgba(255,255,255,.06)" : `${s.color}55`, opacity: st === "skipped" ? 0.4 : 1, outline: st === "active" ? `2px solid ${s.color}` : undefined }}>
              {st === "blocked" ? "⛔" : s.emoji}
            </span>
            {i < STEPS.length - 1 && <span className="mx-0.5 h-0.5 w-2 rounded" style={{ background: st === "done" || st === "warn" ? s.color : "rgba(255,255,255,.15)" }} />}
          </span>
        );
      })}
      {msg.meta && <span className="ml-1.5 font-mono text-[10px] text-white/60">{(msg.meta.ms / 1000).toFixed(1)}s</span>}
    </button>
  );
}
