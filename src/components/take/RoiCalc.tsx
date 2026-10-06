"use client";

import { useState } from "react";

function Slider({ label, value, set, min, max, step = 1, fmt }: { label: string; value: number; set: (v: number) => void; min: number; max: number; step?: number; fmt: (v: number) => string }) {
  return (
    <label className="block">
      <div className="flex justify-between text-[15px]">
        <span className="text-white/80">{label}</span>
        <b className="font-mono text-cyan-200">{fmt(value)}</b>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} className="mt-2 w-full accent-cyan-400" />
    </label>
  );
}

const inr = (v: number) => "₹" + Math.round(v).toLocaleString("en-IN");

export default function RoiCalc() {
  const [staff, setStaff] = useState(4);
  const [hours, setHours] = useState(3);
  const [salary, setSalary] = useState(22000);
  const [auto, setAuto] = useState(50);
  const [aiCost, setAiCost] = useState(15000);

  const hourly = salary / (26 * 8);
  const hoursSaved = staff * hours * 26 * (auto / 100);
  const value = hoursSaved * hourly;
  const net = value - aiCost;
  const days = Math.round((staff * hours * 26 * (auto / 100)) / 8);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="glass space-y-6 rounded-3xl p-6">
        <Slider label="Staff doing repetitive work" value={staff} set={setStaff} min={1} max={30} fmt={(v) => `${v} people`} />
        <Slider label="Hours per person per day on it" value={hours} set={setHours} min={0.5} max={8} step={0.5} fmt={(v) => `${v} h`} />
        <Slider label="Average monthly salary" value={salary} set={setSalary} min={10000} max={80000} step={1000} fmt={inr} />
        <Slider label="Share agents can take over" value={auto} set={setAuto} min={10} max={80} step={5} fmt={(v) => `${v}%`} />
        <Slider label="AI running cost per month" value={aiCost} set={setAiCost} min={2000} max={100000} step={1000} fmt={inr} />
        <p className="text-xs text-muted">Simple estimate: 26 working days, 8-hour days. Excludes one-time setup cost. Use it to start a conversation, not to sign a contract.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["Hours freed / month", `${Math.round(hoursSaved)} h`, `≈ ${days} working days`, "#22d3ee"],
          ["Value of time freed", inr(value), "per month", "#a78bfa"],
          ["Net monthly benefit", inr(net), net > 0 ? "after AI costs" : "not worth it yet", net > 0 ? "#22c55e" : "#ef4444"],
          ["Yearly", inr(net * 12), "redeploy people to growth work", "#f59e0b"],
        ].map(([k, v, s, c]) => (
          <div key={k} className="glass flex flex-col justify-center rounded-3xl p-6">
            <div className="text-sm text-muted">{k}</div>
            <div className="mt-1 text-4xl font-black" style={{ color: c }}>
              {v}
            </div>
            <div className="mt-1 text-sm text-white/60">{s}</div>
          </div>
        ))}
        <div className="glass rounded-3xl p-5 sm:col-span-2">
          <b className="text-emerald-300">The real ROI isn&apos;t cutting staff.</b> <span className="text-white/80">It&apos;s faster response, fewer errors, 24×7 service, and your best people doing the work only humans can do.</span>
        </div>
      </div>
    </div>
  );
}
