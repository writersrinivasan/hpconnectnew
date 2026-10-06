"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const DAY = [
  { time: "08:00", task: "40 WhatsApp messages & calls for appointments", before: "2 receptionists on phones; patients wait on hold; urgent cases buried in the queue.", after: "Guardian + Triage agents sort every message in seconds; chest-pain cases jump to the top.", bm: 120, am: 3 },
  { time: "09:30", task: "Insurance pre-authorisations", before: "Insurance desk fills forms, calls the TPA, waits 2–4 hours.", after: "Coordinator agent verifies cover and raises cashless pre-auth via MCP in minutes.", bm: 180, am: 8 },
  { time: "11:00", task: "Medicine refills & stock", before: "Pharmacist checks register, misses an interaction warning, stock runs out on Friday.", after: "Pharmacy agent checks stock + interactions; doctor approves refills in one click.", bm: 60, am: 4 },
  { time: "14:00", task: "Lab-report follow-ups", before: "Nurse calls each patient; many unreachable; abnormal results noticed late.", after: "Agents flag abnormal values to the doctor and message patients in their language.", bm: 90, am: 6 },
  { time: "17:00", task: "Billing & claims", before: "Accountant re-types bills into the TPA portal; rejections due to missing papers.", after: "Agents assemble the claim file and check it against the policy before submission.", bm: 120, am: 10 },
  { time: "20:00", task: "Compliance registers & reports", before: "Dr. Meena stays late to sign registers and fill NABH / audit paperwork.", after: "The audit trail is already written. The report is generated, and she just reviews it.", bm: 60, am: 5 },
];

export default function DayToggle() {
  const [after, setAfter] = useState(false);
  const total = DAY.reduce((s, d) => s + (after ? d.am : d.bm), 0);
  return (
    <div>
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="flex rounded-full bg-white/5 p-1.5 text-lg font-bold">
          <button onClick={() => setAfter(false)} className={`rounded-full px-6 py-2.5 transition ${!after ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30" : "text-muted"}`}>
            😓 Today
          </button>
          <button onClick={() => setAfter(true)} className={`rounded-full px-6 py-2.5 transition ${after ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "text-muted"}`}>
            🚀 With AI agents
          </button>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted">Staff time spent on these 6 routines (illustrative)</div>
          <motion.div key={total} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`text-5xl font-black ${after ? "text-emerald-300" : "text-rose-300"}`}>
            {Math.floor(total / 60)}h {total % 60}m
          </motion.div>
        </div>
      </div>
      <div className="relative mx-auto max-w-4xl">
        <div className="absolute bottom-0 left-[68px] top-0 w-0.5 bg-gradient-to-b from-violet-500 via-cyan-400 to-emerald-400 opacity-40 md:left-[88px]" />
        {DAY.map((d, i) => (
          <div key={d.time} className="relative mb-4 flex gap-4 md:gap-8">
            <div className="w-14 shrink-0 pt-4 text-right font-mono text-sm font-bold text-white/70 md:w-16">{d.time}</div>
            <div className={`absolute left-[63px] top-5 h-3 w-3 rounded-full md:left-[83px] ${after ? "bg-emerald-400" : "bg-rose-400"}`} />
            <div className="glass flex-1 rounded-2xl p-4 md:ml-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-lg font-extrabold">{d.task}</div>
                <span className={`ml-auto rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${after ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200"}`}>{after ? d.am : d.bm} min</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p key={String(after)} initial={{ opacity: 0, x: after ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }} className="mt-1 text-white/75">
                  {after ? d.after : d.before}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
