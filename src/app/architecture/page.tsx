import type { Metadata } from "next";
import LayerDiagram from "@/components/arch/LayerDiagram";
import Icon from "@/components/Icon";
import { PageHero, SectionHead } from "@/components/ui";

export const metadata: Metadata = { title: "Architecture · CareAgents" };

const LIFECYCLE = [
  { t: "Message arrives", d: "WhatsApp → gateway authenticates & rate-limits", c: "#22c55e", ms: "50 ms" },
  { t: "Input guardrails", d: "Mask phone/Aadhaar, block injection, check scope", c: "#f43f5e", ms: "40 ms" },
  { t: "Orchestrator plans", d: "Detect intents, choose agents, create trace", c: "#8b5cf6", ms: "~1 s" },
  { t: "Specialists in parallel", d: "RAG over protocols + MCP tool calls", c: "#f59e0b", ms: "~2 s" },
  { t: "Coordinate & book", d: "Merge state, hold slot, pre-auth insurance", c: "#6366f1", ms: "~1 s" },
  { t: "Human approval", d: "Graph pauses, state checkpointed, doctor approves", c: "#ec4899", ms: "human" },
  { t: "Output guardrails", d: "PII, groundedness, policy, emergency advice", c: "#f97316", ms: "60 ms" },
  { t: "Act & record", d: "Send WhatsApp, write hash-chained audit, run evals", c: "#06b6d4", ms: "300 ms" },
];

const DEPLOY = [
  { t: "SaaS / managed", cost: "₹", eff: "Days", d: "Use a vendor's agent platform. Fastest start; check where data is stored and who can see it.", best: "First pilot, non-sensitive workflows", c: "#22c55e" },
  { t: "Private cloud (India region)", cost: "₹₹", eff: "Weeks", d: "Your own cloud account, managed AI APIs with no-training data agreements. Best balance.", best: "Most MSMEs handling customer data", c: "#0ea5e9" },
  { t: "On-premise / hybrid", cost: "₹₹₹", eff: "Months", d: "Open-source models on your own servers. Maximum control, needs an IT team.", best: "Strict data rules, large volumes", c: "#a855f7" },
];

const DOCS = [
  { icon: "FileText", t: "Architecture Decision Records", d: "Why we chose LangGraph, which model, where data lives. One page per decision." },
  { icon: "Route", t: "Data-flow diagram", d: "Which data goes where, who sees it, what is masked. Needed for DPDP compliance." },
  { icon: "Bot", t: "Agent registry & model cards", d: "Each agent's purpose, tools, permissions, owner, limitations, version." },
  { icon: "BookOpenText", t: "Prompt & policy library", d: "Versioned prompts and rules, reviewed like any SOP change." },
  { icon: "TriangleAlert", t: "AI risk register", d: "What could go wrong, likelihood, impact, mitigation, owner." },
  { icon: "Wrench", t: "Runbook & incident plan", d: "What staff do if an agent misbehaves: kill-switch, fallback to manual, who to call." },
  { icon: "FlaskConical", t: "Evaluation reports", d: "Test results before every release: accuracy, safety, cost." },
  { icon: "ClipboardCheck", t: "User SOPs & training", d: "How staff review, approve and override agent decisions." },
];

const STACK = [
  ["Frontend", "Next.js 16 · React 19 · Tailwind · Framer Motion"],
  ["Orchestration", "LangGraph.js: StateGraph, conditional fan-out, interrupt(), MemorySaver checkpoints"],
  ["LLM", "Claude via @langchain/anthropic (optional; offline-safe fallback built in)"],
  ["RAG", "BM25 retriever over 12 clinic documents (swap for pgvector in production)"],
  ["Tools", "6 MCP-style servers speaking JSON-RPC 2.0 tools/call"],
  ["Streaming", "Server-Sent Events: every node, tool call and audit entry streamed live"],
  ["Audit", "SHA-256 hash-chained, tamper-evident log"],
  ["Evals", "Automatic post-run checks: groundedness, accuracy, policy, PII, oversight"],
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Chapter 04 · Architecture"
        color="#6366f1"
        title={
          <>
            How it&apos;s <span className="grad-text">built</span>: layer by layer
          </>
        }
        sub="Think of it like a building: a gate, security, a manager, specialists, a library and a toolroom, with CCTV, locks and rules on every floor. Click any layer."
      />
      <section className="mx-auto max-w-[1300px] px-4 pb-14 md:px-6">
        <LayerDiagram />
      </section>

      <section className="mx-auto max-w-[1300px] px-4 py-14 md:px-6">
        <SectionHead eyebrow="Request lifecycle" color="#22d3ee" title="One WhatsApp message, eight steps" sub="Everything below happened in the live demo, in about the time it takes to read this sentence (plus the doctor's click)." />
        <div className="grid gap-3 md:grid-cols-4">
          {LIFECYCLE.map((s, i) => (
            <div key={s.t} className="glass relative rounded-2xl p-5" style={{ borderLeft: `4px solid ${s.c}` }}>
              <div className="flex items-center justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-full font-black text-black" style={{ background: s.c }}>
                  {i + 1}
                </span>
                <span className="font-mono text-xs text-muted">{s.ms}</span>
              </div>
              <div className="mt-3 text-lg font-extrabold">{s.t}</div>
              <div className="mt-1 text-sm text-white/70">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1300px] px-4 py-14 md:px-6">
        <SectionHead eyebrow="Deployment options" color="#22c55e" title="Three ways an MSME can run this" />
        <div className="grid gap-4 md:grid-cols-3">
          {DEPLOY.map((d) => (
            <div key={d.t} className="glass rounded-3xl p-6" style={{ borderTop: `4px solid ${d.c}` }}>
              <h3 className="text-xl font-extrabold">{d.t}</h3>
              <div className="mt-3 flex gap-2 text-sm">
                <span className="rounded-full bg-white/10 px-3 py-1">Cost {d.cost}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Setup: {d.eff}</span>
              </div>
              <p className="mt-3 text-white/75">{d.d}</p>
              <p className="mt-3 text-sm">
                <b style={{ color: d.c }}>Best for:</b> <span className="text-white/75">{d.best}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1300px] px-4 py-14 md:px-6">
        <SectionHead eyebrow="Documentation" color="#facc15" title="If it isn't documented, it isn't governed" sub="The paperwork that makes an AI system auditable, maintainable and handover-ready. Ask every vendor for these." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DOCS.map((d) => (
            <div key={d.t} className="glass rounded-2xl p-5">
              <Icon name={d.icon} className="h-6 w-6 text-amber-300" />
              <div className="mt-3 font-extrabold">{d.t}</div>
              <div className="mt-1 text-sm text-white/70">{d.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 pb-24 pt-14 md:px-6">
        <SectionHead eyebrow="Under the hood of this demo" color="#a78bfa" title="The actual tech stack" />
        <div className="glass overflow-hidden rounded-3xl">
          {STACK.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[140px_1fr] gap-4 border-b border-white/5 p-4 md:grid-cols-[200px_1fr]">
              <div className="font-bold text-violet-300">{k}</div>
              <div className="font-mono text-sm text-white/80">{v}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
