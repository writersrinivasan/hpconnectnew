"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const AIS = [
  { t: "Triage agent", c: "#f59e0b" },
  { t: "Pharmacy agent", c: "#10b981" },
  { t: "Coordinator", c: "#6366f1" },
  { t: "Messenger", c: "#06b6d4" },
];
const TOOLS = [
  { t: "Hospital EHR", c: "#0ea5e9" },
  { t: "Pharmacy stock", c: "#10b981" },
  { t: "Google Calendar", c: "#6366f1" },
  { t: "Insurance TPA", c: "#a855f7" },
  { t: "WhatsApp", c: "#22c55e" },
  { t: "Tally / GST", c: "#f97316" },
];

const yA = (i: number) => 60 + i * 95;
const yT = (i: number) => 35 + i * 66;

export default function McpExplainer() {
  const [mcp, setMcp] = useState(true);
  const lines = mcp ? AIS.length + TOOLS.length : AIS.length * TOOLS.length;
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <div className="flex rounded-full bg-white/5 p-1.5 font-bold">
          <button onClick={() => setMcp(false)} className={`rounded-full px-5 py-2 ${!mcp ? "bg-rose-500" : "text-muted"}`}>
            Without MCP 🍝
          </button>
          <button onClick={() => setMcp(true)} className={`rounded-full px-5 py-2 ${mcp ? "bg-sky-500" : "text-muted"}`}>
            With MCP 🔌
          </button>
        </div>
        <div className="text-center text-lg">
          <b className={mcp ? "text-sky-300" : "text-rose-300"}>{lines} custom connections</b> <span className="text-muted">to build and maintain</span>
        </div>
      </div>

      <div className="glass rounded-3xl p-4">
        <svg viewBox="0 0 900 420" className="w-full">
          {AIS.map((a, i) =>
            mcp ? (
              <motion.path key={`a${i}`} d={`M 190 ${yA(i)} C 300 ${yA(i)}, 330 210, 410 210`} stroke={a.c} strokeWidth={3} fill="none" className="edge-flow" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            ) : (
              TOOLS.map((t, j) => <motion.path key={`${i}-${j}`} d={`M 190 ${yA(i)} C 420 ${yA(i)}, 480 ${yT(j)}, 700 ${yT(j)}`} stroke={a.c} strokeOpacity={0.55} strokeWidth={2} fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: (i * 6 + j) * 0.02 }} />)
            ),
          )}
          {mcp && TOOLS.map((t, j) => <motion.path key={`t${j}`} d={`M 490 210 C 570 210, 600 ${yT(j)}, 700 ${yT(j)}`} stroke={t.c} strokeWidth={3} fill="none" className="edge-flow" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />)}
          {AIS.map((a, i) => (
            <g key={a.t}>
              <rect x={20} y={yA(i) - 24} width={170} height={48} rx={14} fill={`${a.c}30`} stroke={a.c} strokeWidth={2} />
              <text x={105} y={yA(i) + 5} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={700}>
                🤖 {a.t}
              </text>
            </g>
          ))}
          {TOOLS.map((t, j) => (
            <g key={t.t}>
              <rect x={700} y={yT(j) - 22} width={180} height={44} rx={12} fill={`${t.c}30`} stroke={t.c} strokeWidth={2} />
              <text x={790} y={yT(j) + 5} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
                {t.t}
              </text>
            </g>
          ))}
          {mcp && (
            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "450px 210px" }}>
              <circle cx={450} cy={210} r={62} fill="url(#mcpg)" stroke="#38bdf8" strokeWidth={3} />
              <defs>
                <radialGradient id="mcpg">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.6} />
                </radialGradient>
              </defs>
              <text x={450} y={206} textAnchor="middle" fill="#fff" fontSize={26} fontWeight={900}>
                MCP
              </text>
              <text x={450} y={230} textAnchor="middle" fill="#bae6fd" fontSize={12} fontWeight={600}>
                one standard plug
              </text>
            </motion.g>
          )}
        </svg>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass rounded-3xl p-6">
          <div className="text-4xl">🔌</div>
          <h4 className="mt-2 text-xl font-extrabold">Like USB-C for AI</h4>
          <p className="mt-2 text-white/75">One charger fits every phone. MCP (Model Context Protocol) is one open standard so any AI agent can plug into any business tool, safely.</p>
        </div>
        <div className="glass rounded-3xl p-6">
          <div className="text-4xl">🧩</div>
          <h4 className="mt-2 text-xl font-extrabold">Why MSMEs should care</h4>
          <p className="mt-2 text-white/75">Your Tally, WhatsApp, Google Sheets or HIS can be connected once and reused by every agent. Lower cost, less vendor lock-in, easier to switch AI models.</p>
        </div>
        <div className="glass rounded-3xl p-6">
          <div className="text-4xl">🛂</div>
          <h4 className="mt-2 text-xl font-extrabold">Control what agents can touch</h4>
          <p className="mt-2 text-white/75">Each MCP server exposes only the actions you allow, e.g. <i>read</i> records but never <i>delete</i>. Every call is logged.</p>
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <div className="mb-2 text-sm font-bold uppercase tracking-wider text-sky-300">What actually travels over the wire (from our live demo)</div>
        <div className="grid gap-3 md:grid-cols-2">
          <pre className="scroll-thin overflow-x-auto rounded-2xl bg-black/40 p-4 font-mono text-[13px] text-cyan-100">{`// Agent → EHR server
{
  "jsonrpc": "2.0", "id": 101,
  "method": "tools/call",
  "params": {
    "name": "get_patient_summary",
    "arguments": {
      "patient_id": "P-1042",
      "fields": ["conditions","medicines",
                 "allergies","recent_labs"]
    }
  }
}`}</pre>
          <pre className="scroll-thin overflow-x-auto rounded-2xl bg-black/40 p-4 font-mono text-[13px] text-emerald-100">{`// EHR server → Agent
{
  "jsonrpc": "2.0", "id": 101,
  "result": {
    "structuredContent": {
      "age": 58,
      "conditions": ["Type 2 diabetes", "Hypertension"],
      "allergies": ["Penicillin"],
      "recent_labs": [{ "test": "HbA1c", "value": "7.9 %" }],
      "note": "minimum-necessary set (DPDP)"
    }
  }
}`}</pre>
        </div>
      </div>
    </div>
  );
}
