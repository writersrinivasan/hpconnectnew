"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type N = { id: string; x: number; y: number; label: string; c: string };
interface Pattern {
  id: string;
  name: string;
  analogy: string;
  when: string;
  nodes: N[];
  edges: [string, string][];
  order: string[][];
}

const P: Pattern[] = [
  {
    id: "seq",
    name: "Sequential",
    analogy: "An assembly line: each station finishes, then passes it on.",
    when: "Steps depend on each other: check input → book → send.",
    nodes: [
      { id: "a", x: 80, y: 120, label: "Guard", c: "#f43f5e" },
      { id: "b", x: 240, y: 120, label: "Book", c: "#6366f1" },
      { id: "c", x: 400, y: 120, label: "Check", c: "#f97316" },
      { id: "d", x: 560, y: 120, label: "Send", c: "#06b6d4" },
    ],
    edges: [["a", "b"], ["b", "c"], ["c", "d"]],
    order: [["a"], ["b"], ["c"], ["d"]],
  },
  {
    id: "par",
    name: "Parallel fan-out",
    analogy: "A kitchen: the chef calls out orders, and three cooks work at the same time.",
    when: "Independent jobs: triage, records and pharmacy run together, 3× faster.",
    nodes: [
      { id: "s", x: 90, y: 120, label: "Orchestrator", c: "#8b5cf6" },
      { id: "a", x: 320, y: 40, label: "Triage", c: "#f59e0b" },
      { id: "b", x: 320, y: 120, label: "Records", c: "#0ea5e9" },
      { id: "c", x: 320, y: 200, label: "Pharmacy", c: "#10b981" },
      { id: "j", x: 550, y: 120, label: "Coordinator", c: "#6366f1" },
    ],
    edges: [["s", "a"], ["s", "b"], ["s", "c"], ["a", "j"], ["b", "j"], ["c", "j"]],
    order: [["s"], ["a", "b", "c"], ["j"]],
  },
  {
    id: "sup",
    name: "Supervisor / router",
    analogy: "A head nurse who decides which department each patient goes to.",
    when: "Different requests need different specialists. Skip what isn't needed.",
    nodes: [
      { id: "s", x: 120, y: 120, label: "Supervisor", c: "#8b5cf6" },
      { id: "a", x: 420, y: 40, label: "Cardiology", c: "#f43f5e" },
      { id: "b", x: 420, y: 120, label: "Pharmacy", c: "#10b981" },
      { id: "c", x: 420, y: 200, label: "Billing", c: "#a855f7" },
    ],
    edges: [["s", "a"], ["s", "b"], ["s", "c"]],
    order: [["s"], ["a"], ["s"], ["c"]],
  },
  {
    id: "hitl",
    name: "Human-in-the-loop",
    analogy: "A cheque above ₹50,000 needs the owner's signature.",
    when: "High-risk actions (prescriptions, payments, legal) pause for a human.",
    nodes: [
      { id: "a", x: 90, y: 120, label: "Agents", c: "#6366f1" },
      { id: "h", x: 320, y: 120, label: "👩‍⚕️ Doctor", c: "#ec4899" },
      { id: "d", x: 550, y: 120, label: "Act", c: "#22c55e" },
    ],
    edges: [["a", "h"], ["h", "d"]],
    order: [["a"], ["h"], ["h"], ["d"]],
  },
];

export default function OrchestrationExplainer() {
  const [pid, setPid] = useState("par");
  const [tick, setTick] = useState(0);
  const p = P.find((x) => x.id === pid)!;
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const stage = tick % (p.order.length + 1);
  const active = new Set(p.order[stage] ?? []);
  const pos = Object.fromEntries(p.nodes.map((n) => [n.id, n]));

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-4">
        {P.map((x) => (
          <button key={x.id} onClick={() => { setPid(x.id); setTick(0); }} className={`glass rounded-2xl p-4 text-left transition ${pid === x.id ? "ring-2 ring-violet-400" : "hover:bg-white/[.07]"}`}>
            <div className="font-extrabold">{x.name}</div>
            <div className="mt-1 text-sm text-muted">{x.analogy}</div>
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass grid-bg rounded-3xl p-4">
          <svg viewBox="0 0 640 240" className="w-full">
            {p.edges.map(([a, b]) => {
              const A = pos[a];
              const B = pos[b];
              const on = active.has(b) && (p.order[stage - 1]?.includes(a) ?? false);
              return <path key={a + b} d={`M ${A.x} ${A.y} C ${(A.x + B.x) / 2} ${A.y}, ${(A.x + B.x) / 2} ${B.y}, ${B.x} ${B.y}`} stroke={on ? B.c : "rgba(255,255,255,.15)"} strokeWidth={on ? 4 : 2.5} fill="none" className={on ? "edge-flow" : ""} />;
            })}
            {p.nodes.map((n) => (
              <g key={n.id}>
                <motion.circle cx={n.x} cy={n.y} animate={{ r: active.has(n.id) ? 36 : 30 }} fill={active.has(n.id) ? `${n.c}aa` : `${n.c}22`} stroke={n.c} strokeWidth={3} style={{ filter: active.has(n.id) ? `drop-shadow(0 0 14px ${n.c})` : "none" }} />
                <text x={n.x} y={n.y + 56} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="glass rounded-3xl p-6">
          <div className="text-sm font-bold uppercase tracking-wider text-violet-300">{p.name}</div>
          <p className="mt-2 text-2xl font-extrabold leading-snug">{p.analogy}</p>
          <p className="mt-3 text-white/75">
            <b>Use when:</b> {p.when}
          </p>
          <div className="mt-5 text-xs font-bold uppercase tracking-wider text-muted">In LangGraph it&apos;s just a few lines:</div>
          <pre className="scroll-thin mt-2 overflow-x-auto rounded-xl bg-black/40 p-3 font-mono text-[12px] text-violet-100">
            {pid === "seq" && `graph.addEdge("guard", "book")\n     .addEdge("book", "check")\n     .addEdge("check", "send")`}
            {pid === "par" && `graph.addConditionalEdges("supervisor",\n  s => s.plan) // ["triage","records","pharmacy"]\n// all three run in parallel, then:\ngraph.addEdge("triage", "coordinator")`}
            {pid === "sup" && `graph.addConditionalEdges("supervisor",\n  s => s.intent === "refill"\n        ? "pharmacy" : "cardiology")`}
            {pid === "hitl" && `// inside the node:\nconst decision = interrupt(summary)\n// graph pauses + saves state (checkpoint)\n// resumes when the doctor clicks Approve`}
          </pre>
        </div>
      </div>
    </div>
  );
}
