"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Icon from "@/components/Icon";

interface Layer {
  id: string;
  name: string;
  plain: string;
  icon: string;
  c: string;
  items: string[];
  tech: string[];
  tip: string;
}

const LAYERS: Layer[] = [
  { id: "ch", name: "Channels", plain: "Where patients and staff talk to the system.", icon: "Smartphone", c: "#22c55e", items: ["WhatsApp", "Web portal", "Voice (IVR)", "Staff dashboard", "Kiosk"], tech: ["WhatsApp Business API", "Next.js web app", "Voice AI"], tip: "Start with the channel your customers already use. In India that is usually WhatsApp." },
  { id: "gw", name: "Gateway & Identity", plain: "The front door: who are you, are you allowed, how fast can you knock?", icon: "KeyRound", c: "#94a3b8", items: ["OTP / SSO login", "Consent check", "Rate limiting", "Web firewall"], tech: ["API gateway", "OAuth 2.0 / OIDC", "WAF"], tip: "Never let an AI agent be reachable without authentication and rate limits." },
  { id: "gr", name: "Guardrails", plain: "Security guards on the way in AND on the way out.", icon: "ShieldCheck", c: "#f43f5e", items: ["PII masking", "Prompt-injection filter", "Scope & toxicity", "Output policy checks", "Groundedness check"], tech: ["Rule engine", "PII detectors (e.g. Presidio)", "Safety classifiers"], tip: "Guardrails are cheap insurance. Build them before the first agent, not after the first incident." },
  { id: "or", name: "Orchestration", plain: "The manager that runs the team: plan, assign, wait, retry, pause for humans.", icon: "Network", c: "#8b5cf6", items: ["State machine (graph)", "Parallel fan-out", "Human-in-the-loop interrupts", "Checkpoints & resume", "Retries & timeouts"], tech: ["LangGraph", "Postgres checkpointer", "Queue for long jobs"], tip: "Orchestration is what turns a demo into a dependable process. It's where your business rules live." },
  { id: "ag", name: "Specialist Agents", plain: "Each agent does one job well, with only the tools it needs.", icon: "Bot", c: "#f59e0b", items: ["Triage", "Records", "Pharmacy", "Coordinator", "Compliance", "Messenger"], tech: ["LLM + prompt + tools", "Least-privilege tool access"], tip: "Small, focused agents are easier to test, trust and replace than one giant 'do-everything' bot." },
  { id: "kt", name: "Knowledge & Tools", plain: "What agents know (RAG) and what they can do (MCP).", icon: "Plug", c: "#0ea5e9", items: ["Vector search over SOPs & protocols", "MCP: EHR, pharmacy, calendar", "MCP: insurance, WhatsApp, SecOps"], tech: ["pgvector / Qdrant", "Embeddings", "MCP servers"], tip: "Your documents are your competitive advantage. Clean them up; RAG is only as good as what it reads." },
  { id: "md", name: "AI Models", plain: "The 'brains': swappable, so you're never locked in.", icon: "Brain", c: "#a855f7", items: ["Large model for reasoning", "Small model for classification", "Fallback model", "Model gateway & cost caps"], tech: ["Claude (Anthropic)", "Open-source models", "Model router"], tip: "Use the big model only where reasoning matters; small models cut cost by 10× for simple steps." },
  { id: "dt", name: "Data", plain: "Your systems of record, protected and kept in India.", icon: "Database", c: "#06b6d4", items: ["HIS / EHR", "Pharmacy DB", "Encrypted backups", "Data residency (India region)"], tech: ["Postgres", "Encrypted object storage", "KMS"], tip: "Agents should READ through controlled tools, never get raw database passwords." },
];

const CROSS = [
  { name: "Observability", icon: "Activity", c: "#22d3ee", d: "Traces, metrics, cost & latency for every agent step (LangSmith / OpenTelemetry / Grafana)." },
  { name: "Security", icon: "Lock", c: "#f43f5e", d: "Encryption, secrets vault, least privilege, pen-testing, incident response." },
  { name: "Governance", icon: "Scale", c: "#facc15", d: "AI policy, risk tiers, audit trail, model & prompt registry, evals before every release." },
];

export default function LayerDiagram() {
  const [sel, setSel] = useState("or");
  const L = LAYERS.find((l) => l.id === sel)!;
  return (
    <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          {LAYERS.map((l, i) => (
            <motion.button
              key={l.id}
              onClick={() => setSel(l.id)}
              whileHover={{ x: 4 }}
              className="flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition"
              style={{ borderColor: sel === l.id ? l.c : "rgba(255,255,255,.08)", background: sel === l.id ? `${l.c}22` : "rgba(255,255,255,.03)", boxShadow: sel === l.id ? `0 0 30px ${l.c}44` : "none" }}
            >
              <span className="w-5 font-mono text-xs text-muted">{i + 1}</span>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `${l.c}30`, color: l.c }}>
                <Icon name={l.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold">{l.name}</div>
                <div className="hidden truncate text-[12px] text-muted sm:block">{l.items.join(" · ")}</div>
              </div>
            </motion.button>
          ))}
        </div>
        <div className="flex w-16 flex-col gap-2 sm:w-20">
          {CROSS.map((c) => (
            <div key={c.name} title={c.d} className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border p-2" style={{ borderColor: `${c.c}55`, background: `${c.c}12` }}>
              <Icon name={c.icon} className="h-5 w-5" style={{ color: c.c }} />
              <span className="text-[11px] font-bold [writing-mode:vertical-rl]" style={{ color: c.c }}>
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={L.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="glass rounded-3xl p-6" style={{ borderColor: `${L.c}66` }}>
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: `${L.c}30`, color: L.c }}>
              <Icon name={L.icon} className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-extrabold">{L.name}</h3>
          </div>
          <p className="mt-4 text-xl text-white/90">{L.plain}</p>
          <div className="mt-5 text-xs font-bold uppercase tracking-wider text-muted">Components</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {L.items.map((x) => (
              <span key={x} className="rounded-full px-3 py-1 text-sm font-semibold" style={{ background: `${L.c}22`, color: L.c }}>
                {x}
              </span>
            ))}
          </div>
          <div className="mt-5 text-xs font-bold uppercase tracking-wider text-muted">Typical technology</div>
          <div className="mt-1 text-white/80">{L.tech.join(" · ")}</div>
          <div className="mt-5 rounded-2xl bg-white/5 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300">💡 MSME tip</div>
            <div className="mt-1 text-white/85">{L.tip}</div>
          </div>
          <div className="mt-5 grid gap-2">
            {CROSS.map((c) => (
              <div key={c.name} className="flex gap-2 text-sm">
                <Icon name={c.icon} className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.c }} />
                <span>
                  <b style={{ color: c.c }}>{c.name}</b> <span className="text-white/65">wraps every layer: {c.d}</span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
