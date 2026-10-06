"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { AGENTS } from "@/lib/agents";
import { MCP_SERVERS } from "@/lib/mcp";
import type { RunState } from "./useRunner";

const TABS = [
  { id: "chat", label: "Agent Talk", icon: "Bot" },
  { id: "rag", label: "RAG", icon: "BookOpenText" },
  { id: "mcp", label: "MCP", icon: "Plug" },
  { id: "guard", label: "Guardrails", icon: "ShieldCheck" },
  { id: "audit", label: "Audit Trail", icon: "Fingerprint" },
  { id: "trace", label: "Trace", icon: "Activity" },
  { id: "evals", label: "Evals", icon: "FlaskConical" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const TONE: Record<string, string> = {
  info: "border-white/10 bg-white/[.04]",
  success: "border-emerald-400/30 bg-emerald-400/[.07]",
  warn: "border-amber-400/40 bg-amber-400/[.08]",
  danger: "border-rose-500/50 bg-rose-500/[.1]",
};

const GUARD: Record<string, { c: string; t: string }> = {
  pass: { c: "#22c55e", t: "PASS" },
  masked: { c: "#38bdf8", t: "MASKED" },
  warn: { c: "#f59e0b", t: "WARN" },
  block: { c: "#ef4444", t: "BLOCKED" },
};

export default function Inspector({ state }: { state: RunState }) {
  const [tab, setTab] = useState<Tab>("chat");
  const scroller = useRef<HTMLDivElement>(null);
  const counts: Record<Tab, number> = {
    chat: state.messages.length,
    rag: state.rag.length,
    mcp: state.mcp.length,
    guard: state.guards.length,
    audit: state.audit.length,
    trace: state.spans.length,
    evals: state.final?.evals.length ?? 0,
  };

  const [seenFinal, setSeenFinal] = useState<RunState["final"]>(undefined);
  if (state.final !== seenFinal) {
    setSeenFinal(state.final);
    if (state.final) setTab("evals");
  }

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [state.messages.length, state.audit.length, state.mcp.length, tab]);

  return (
    <div className="glass flex h-full min-h-[520px] flex-col overflow-hidden rounded-3xl">
      <div className="scroll-thin flex gap-1 overflow-x-auto border-b border-line p-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition ${tab === t.id ? "bg-white/12 text-white" : "text-muted hover:bg-white/5"}`}
          >
            <Icon name={t.icon} className="h-4 w-4" />
            {t.label}
            {counts[t.id] > 0 && <span className="rounded-full bg-cyan-400/20 px-1.5 font-mono text-[10px] text-cyan-200">{counts[t.id]}</span>}
          </button>
        ))}
      </div>
      <div ref={scroller} className="scroll-thin flex-1 space-y-2.5 overflow-y-auto p-4">
        {counts[tab] === 0 && <Empty tab={tab} />}

        {tab === "chat" &&
          state.messages.map((m, i) => {
            const a = AGENTS[m.node];
            return (
              <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className={`flex gap-3 rounded-2xl border p-3 ${TONE[m.tone ?? "info"]}`}>
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: `${a.color}33`, color: a.color }}>
                  <Icon name={a.icon} className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold" style={{ color: a.color }}>
                    {a.name}
                  </div>
                  <div className="text-[14px] leading-snug text-white/90">{m.text}</div>
                </div>
              </motion.div>
            );
          })}

        {tab === "rag" &&
          state.rag.map((r, i) => (
            <div key={i} className="rounded-2xl border border-amber-300/20 bg-amber-300/[.04] p-3">
              <div className="mb-2 text-xs text-muted">
                <b style={{ color: AGENTS[r.node].color }}>{AGENTS[r.node].name}</b> searched the clinic knowledge base for:
                <div className="mt-1 font-mono text-[12px] text-white/80">“{r.query.slice(0, 120)}”</div>
              </div>
              {r.hits.map((h, j) => (
                <div key={h.id} className="mb-2 rounded-xl bg-black/30 p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-amber-400 px-1.5 font-mono text-[11px] font-bold text-black">{h.id}</span>
                    <span className="text-sm font-semibold">{h.title}</span>
                    <span className="ml-auto font-mono text-xs text-amber-200">#{j + 1}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${h.score * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
                  </div>
                  <div className="mt-1.5 text-[12px] leading-snug text-white/65">{h.snippet.slice(0, 170)}…</div>
                  <div className="mt-1 text-[11px] text-muted">📄 {h.source} · relevance {Math.round(h.score * 100)}%</div>
                </div>
              ))}
            </div>
          ))}

        {tab === "mcp" &&
          state.mcp.map((m, i) => {
            const srv = MCP_SERVERS.find((s) => s.id === m.server)!;
            return (
              <details key={i} className="group rounded-2xl border border-white/10 bg-white/[.03] p-3" open={i === state.mcp.length - 1}>
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm">
                  <span className="rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold text-black" style={{ background: srv.color }}>
                    {srv.label}
                  </span>
                  <span className="font-mono font-semibold">{m.tool}()</span>
                  <span className="ml-auto font-mono text-xs text-emerald-300">200 · {m.latencyMs}ms</span>
                </summary>
                <div className="mt-2 grid gap-2 text-[11px]">
                  <div>
                    <div className="mb-1 font-bold text-cyan-300">→ request · {AGENTS[m.node].name}</div>
                    <pre className="scroll-thin overflow-x-auto rounded-lg bg-black/40 p-2 font-mono text-white/75">{JSON.stringify(m.request, null, 2)}</pre>
                  </div>
                  <div>
                    <div className="mb-1 font-bold text-emerald-300">← response · {srv.system}</div>
                    <pre className="scroll-thin max-h-48 overflow-auto rounded-lg bg-black/40 p-2 font-mono text-white/75">
                      {JSON.stringify((m.response as { result: { structuredContent: unknown } }).result.structuredContent, null, 2)}
                    </pre>
                  </div>
                </div>
              </details>
            );
          })}

        {tab === "guard" &&
          state.guards.map((g, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-3">
              <span className="mt-0.5 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold text-black" style={{ background: GUARD[g.status].c }}>
                {GUARD[g.status].t}
              </span>
              <div>
                <div className="text-sm font-semibold">
                  {g.check} <span className="text-xs font-normal text-muted">· {g.node === "input_guardrail" ? "input" : "output"}</span>
                </div>
                <div className="text-[13px] text-white/70">{g.detail}</div>
              </div>
            </motion.div>
          ))}

        {tab === "audit" && state.audit.length > 0 && (
          <>
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-2.5 text-[12px] text-emerald-100">
              🔗 Every entry carries the SHA-256 hash of the one before it. Change one past record and every hash after it breaks: a tamper-proof register.
            </div>
            {state.audit.map((e) => (
              <div key={e.seq} className="rounded-xl border border-white/10 bg-black/25 p-2.5 font-mono text-[11px]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted">#{String(e.seq).padStart(2, "0")}</span>
                  <span className="text-white/50">{e.ts.slice(11, 23)}</span>
                  <span className="font-bold text-cyan-300">{e.actor}</span>
                  <span className="rounded bg-violet-500/25 px-1.5 font-bold text-violet-200">{e.action}</span>
                </div>
                <div className="mt-1 text-white/75">{e.detail}</div>
                <div className="mt-1 truncate text-[10px] text-white/35">
                  prev {e.prevHash.slice(0, 10)}… → hash <span className="text-emerald-300/80">{e.hash.slice(0, 16)}…</span>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "trace" && <Trace state={state} />}

        {tab === "evals" && state.final && (
          <div className="space-y-2">
            {state.final.evals.map((e) => (
              <div key={e.name} className="rounded-2xl border border-white/10 bg-white/[.03] p-3">
                <div className="flex items-center gap-2">
                  <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-black ${e.pass ? "bg-emerald-500" : "bg-rose-500"}`}>{e.pass ? "✓" : "!"}</span>
                  <span className="font-semibold">{e.name}</span>
                  <span className="ml-auto font-mono text-sm font-bold text-emerald-300">{Math.round(e.score * 100)}%</span>
                </div>
                <div className="mt-1 pl-8 text-[13px] text-white/65">{e.detail}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Trace({ state }: { state: RunState }) {
  if (!state.spans.length || !state.startTs) return null;
  const t0 = state.startTs;
  const end = Math.max(...state.spans.map((s) => s.ts), ...state.waits.map((w) => w.end ?? w.start));
  const total = Math.max(1, end - t0);
  const tokens = state.spans.reduce((s, x) => s + x.tokensIn + x.tokensOut, 0);
  const cost = state.spans.reduce((s, x) => s + x.costUsd, 0);
  return (
    <div>
      <div className="mb-3 grid grid-cols-3 gap-2 text-center">
        {[
          ["Spans", state.spans.length],
          ["Tokens (est.)", tokens.toLocaleString()],
          ["Cost (est.)", `₹${(cost * 88).toFixed(2)}`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white/5 p-2">
            <div className="text-lg font-bold">{v}</div>
            <div className="text-[11px] text-muted">{k}</div>
          </div>
        ))}
      </div>
      <div className="mb-1 font-mono text-[10px] text-muted">trace_id {state.threadId}</div>
      {state.spans.map((s) => {
        const a = AGENTS[s.node];
        const left = ((s.startTs - t0) / total) * 100;
        const width = Math.max(1.2, (s.durationMs / total) * 100);
        return (
          <div key={s.spanId} className="mb-1.5 flex items-center gap-2">
            <div className="w-24 shrink-0 truncate text-[11px] font-semibold" style={{ color: a.color }}>
              {a.short}
            </div>
            <div className="relative h-5 flex-1 rounded bg-white/5">
              <div className="absolute top-0 h-full rounded" style={{ left: `${left}%`, width: `${width}%`, background: a.color }} />
            </div>
            <div className="w-14 shrink-0 text-right font-mono text-[10px] text-white/60">{(s.durationMs / 1000).toFixed(2)}s</div>
          </div>
        );
      })}
      {state.waits.map((w, i) => (
        <div key={i} className="mb-1.5 flex items-center gap-2">
          <div className="w-24 shrink-0 text-[11px] font-semibold text-pink-300">Human wait</div>
          <div className="relative h-5 flex-1 rounded bg-white/5">
            <div className="absolute top-0 h-full rounded border border-dashed border-pink-400 bg-pink-400/20" style={{ left: `${((w.start - t0) / total) * 100}%`, width: `${(((w.end ?? end) - w.start) / total) * 100}%` }} />
          </div>
          <div className="w-14 shrink-0 text-right font-mono text-[10px] text-white/60">{(((w.end ?? end) - w.start) / 1000).toFixed(1)}s</div>
        </div>
      ))}
      <p className="mt-3 text-[12px] text-muted">Parallel agents overlap in time. That&apos;s why 3 specialists finish as fast as 1. In production these spans go to LangSmith / OpenTelemetry.</p>
    </div>
  );
}

function Empty({ tab }: { tab: Tab }) {
  const text: Record<Tab, string> = {
    chat: "Pick a scenario and press Run. Each agent will explain what it is doing, in plain words.",
    rag: "When an agent needs facts, it searches the clinic's OWN documents. Retrieved pages appear here with relevance scores.",
    mcp: "Every time an agent uses a tool (records, pharmacy, calendar, insurance, WhatsApp) the exact MCP message appears here.",
    guard: "Safety checks on what comes IN and what goes OUT will show up here.",
    audit: "A tamper-proof log of every action: who did what, when, and why.",
    trace: "A timeline of every agent step, with time, tokens and cost.",
    evals: "After the run, the system grades itself: accuracy, safety, compliance.",
  };
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid h-full place-items-center p-8 text-center text-sm text-muted">
        {text[tab]}
      </motion.div>
    </AnimatePresence>
  );
}
