"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Smartphone } from "lucide-react";
import Icon from "@/components/Icon";
import { AGENTS, type AgentId } from "@/lib/agents";
import { EDGES, type GraphNodeId, type RunState } from "./useRunner";

const W = 1000;
const H = 600;

const POS: Record<GraphNodeId, [number, number]> = {
  patient_in: [55, 300],
  input_guardrail: [175, 300],
  blocked_response: [175, 500],
  supervisor: [320, 300],
  triage_agent: [480, 120],
  records_agent: [480, 300],
  pharmacy_agent: [480, 480],
  care_coordinator: [630, 300],
  human_review: [755, 140],
  output_guardrail: [800, 300],
  communicator: [925, 300],
  patient_out: [925, 490],
};

function path(a: GraphNodeId, b: GraphNodeId) {
  const [x1, y1] = POS[a];
  const [x2, y2] = POS[b];
  if (x1 === x2) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function edgeColor(a: GraphNodeId, b: GraphNodeId) {
  if (b === "blocked_response") return "#ef4444";
  const src = a === "patient_in" ? "input_guardrail" : (a as AgentId);
  return b === "patient_out" ? "#22c55e" : AGENTS[src].color;
}

const EDGE_LABEL: Record<string, string> = {
  "input_guardrail>blocked_response": "threat",
  "input_guardrail>supervisor": "safe",
  "care_coordinator>human_review": "high risk",
  "care_coordinator>output_guardrail": "low risk",
};

export default function AgentGraph({ state }: { state: RunState }) {
  return (
    <div className="@container relative w-full" style={{ aspectRatio: `${W}/${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* parallel zone */}
        <rect x={415} y={55} width={130} height={490} rx={22} fill="rgba(139,92,246,0.05)" stroke="rgba(139,92,246,0.35)" strokeDasharray="5 6" />
        <text x={480} y={44} textAnchor="middle" fill="#a78bfa" fontSize={13} fontWeight={700} letterSpacing={2}>
          PARALLEL
        </text>
        {EDGES.map(([a, b]) => {
          const id = `${a}>${b}`;
          const lit = state.lit.includes(id);
          const d = path(a, b);
          const color = edgeColor(a, b);
          return (
            <g key={id}>
              <path d={d} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={3} />
              {lit && (
                <>
                  <path d={d} fill="none" stroke={color} strokeWidth={3.5} filter="url(#glow)" opacity={0.9} className="edge-flow" />
                  <circle r={6} fill="#fff" filter="url(#glow)">
                    <animateMotion dur="1.3s" repeatCount="indefinite" path={d} />
                  </circle>
                </>
              )}
              {EDGE_LABEL[id] && (
                <text
                  x={(POS[a][0] + POS[b][0]) / 2 + (b === "blocked_response" ? 12 : 0)}
                  y={(POS[a][1] + POS[b][1]) / 2 - (b === "blocked_response" ? 0 : 10)}
                  fill={lit ? color : "rgba(255,255,255,0.3)"}
                  fontSize={12}
                  fontWeight={600}
                  textAnchor={b === "blocked_response" ? "start" : "middle"}
                >
                  {EDGE_LABEL[id]}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {(Object.keys(POS) as GraphNodeId[]).map((id) => {
        const [x, y] = POS[id];
        const status = state.nodes[id] ?? "idle";
        if (id === "patient_in" || id === "patient_out") {
          const on = status === "done";
          return (
            <div key={id} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}>
              <div className={`mx-auto grid h-[6.2cqw] w-[6.2cqw] place-items-center rounded-2xl border-2 transition ${on ? "border-green-400 bg-green-500/20 shadow-[0_0_30px_rgba(34,197,94,.5)]" : "border-white/15 bg-white/5"}`}>
                <Smartphone className={on ? "text-green-300" : "text-white/50"} />
              </div>
              <div className="mt-1 whitespace-nowrap text-[max(9px,1.25cqw)] font-bold text-white/80">{id === "patient_in" ? "Patient asks" : "Patient gets reply"}</div>
            </div>
          );
        }
        const a = AGENTS[id];
        const tool = state.nodeTool[id];
        return (
          <div key={id} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, zIndex: status === "active" ? 5 : 1 }}>
            <div className="relative mx-auto h-[7.4cqw] w-[7.4cqw]">
              {(status === "active" || status === "waiting") && (
                <>
                  <span className="pulse-ring absolute inset-0 rounded-full" style={{ border: `3px solid ${a.color}` }} />
                  <span className="pulse-ring absolute inset-0 rounded-full" style={{ border: `3px solid ${a.color}`, animationDelay: ".7s" }} />
                </>
              )}
              <motion.div
                animate={{ scale: status === "active" || status === "waiting" ? 1.12 : 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="relative grid h-full w-full place-items-center rounded-full border-2 transition-colors duration-500"
                style={{
                  borderColor: status === "idle" ? "rgba(255,255,255,.14)" : a.color,
                  background: status === "idle" ? "rgba(255,255,255,.04)" : `radial-gradient(circle at 30% 30%, ${a.color}66, ${a.color}22)`,
                  boxShadow: status === "idle" ? "none" : `0 0 ${status === "active" ? 42 : 20}px ${a.color}${status === "active" ? "aa" : "55"}`,
                }}
              >
                <Icon name={a.icon} className="h-[45%] w-[45%]" style={{ color: status === "idle" ? "rgba(255,255,255,.4)" : "#fff" }} />
                {(status === "done" || status === "blocked") && (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white shadow" style={{ background: status === "blocked" ? "#ef4444" : "#22c55e" }}>
                    {status === "blocked" ? "✕" : <Check className="h-3 w-3" strokeWidth={4} />}
                  </span>
                )}
              </motion.div>
            </div>
            <div className="mt-1 whitespace-nowrap text-[max(9px,1.35cqw)] font-bold" style={{ color: status === "idle" ? "rgba(255,255,255,.55)" : "#fff" }}>
              {a.short}
            </div>
            <AnimatePresence>
              {status === "active" && tool && (
                <motion.div
                  key={tool}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold text-black"
                  style={{ background: a.color }}
                >
                  {tool}
                </motion.div>
              )}
              {status === "waiting" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-bold">
                  ⏸ waiting for doctor
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
