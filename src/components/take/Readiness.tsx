"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const Q = [
  "Our key processes are written down (SOPs, price lists, policies)",
  "Our customer & operations data is digital, not only in registers",
  "We know 2–3 repetitive tasks that eat our team's time every day",
  "Our main software (billing, CRM, HIS, Tally) can export data or has an API",
  "Someone in the business can own an AI project (even part-time)",
  "We have basic cyber hygiene: passwords, backups, access control",
  "We know which decisions must ALWAYS stay with a human",
  "We understand our data-protection obligations (DPDP Act)",
];

const OPTS = [
  { l: "Yes", v: 2, c: "#22c55e" },
  { l: "Partly", v: 1, c: "#f59e0b" },
  { l: "No", v: 0, c: "#ef4444" },
];

export default function Readiness() {
  const [a, setA] = useState<Record<number, number>>({});
  const answered = Object.keys(a).length;
  const score = Math.round((Object.values(a).reduce((s, v) => s + v, 0) / (Q.length * 2)) * 100);
  const level =
    score >= 75
      ? { t: "Ready to pilot 🚀", d: "Pick one high-volume, low-risk workflow and launch a 6-week pilot with guardrails and an audit trail.", c: "#22c55e" }
      : score >= 45
        ? { t: "Almost there 🛠️", d: "Spend 30 days digitising SOPs and data for one process. Then pilot a single agent with human approval on everything.", c: "#f59e0b" }
        : { t: "Build the foundation 🧱", d: "Start with digitisation and documentation. AI amplifies your processes, so make sure they're worth amplifying.", c: "#ef4444" };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="glass space-y-2 rounded-3xl p-5">
        {Q.map((q, i) => (
          <div key={q} className="flex flex-col gap-2 rounded-2xl bg-white/[.03] p-3 sm:flex-row sm:items-center">
            <span className="flex-1 text-[15px]">
              <b className="mr-2 font-mono text-muted">{i + 1}.</b>
              {q}
            </span>
            <div className="flex gap-1">
              {OPTS.map((o) => (
                <button key={o.l} onClick={() => setA({ ...a, [i]: o.v })} className="rounded-lg px-3 py-1.5 text-sm font-bold transition" style={{ background: a[i] === o.v ? o.c : "rgba(255,255,255,.06)", color: a[i] === o.v ? "#000" : "#fff" }}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="glass flex flex-col items-center justify-center rounded-3xl p-8 text-center lg:sticky lg:top-24 lg:self-start">
        <div className="text-sm font-bold uppercase tracking-wider text-muted">Your agentic readiness</div>
        <div className="relative my-4 h-48 w-48">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx={50} cy={50} r={42} stroke="rgba(255,255,255,.1)" strokeWidth={10} fill="none" />
            <motion.circle cx={50} cy={50} r={42} stroke={answered ? level.c : "#475569"} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={264} animate={{ strokeDashoffset: 264 - (264 * score) / 100 }} />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div>
              <div className="text-5xl font-black">{score}</div>
              <div className="text-xs text-muted">
                {answered}/{Q.length} answered
              </div>
            </div>
          </div>
        </div>
        {answered >= 4 ? (
          <>
            <div className="text-2xl font-extrabold" style={{ color: level.c }}>
              {level.t}
            </div>
            <p className="mt-2 text-white/80">{level.d}</p>
          </>
        ) : (
          <p className="text-muted">Answer at least 4 questions to see your level.</p>
        )}
      </div>
    </div>
  );
}
