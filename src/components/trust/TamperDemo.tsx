"use client";

import { useEffect, useState } from "react";

const SEED = [
  { actor: "Guardian Agent", action: "INPUT_SCANNED", detail: "pii_masked=1; verdict=ALLOW" },
  { actor: "Triage Agent", action: "TRIAGE_DECISION", detail: "severity=HIGH; cited=[CP-01]" },
  { actor: "Pharmacy Agent", action: "REFILL_DRAFTED", detail: "Metformin 500mg x30d" },
  { actor: "Dr. Meena Krishnan", action: "HUMAN_APPROVED", detail: "note=ECG on arrival" },
  { actor: "Patient Messenger", action: "MESSAGE_SENT", detail: "channel=whatsapp" },
];

async function sha(s: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

async function chain(rows: typeof SEED) {
  let prev = "0".repeat(64);
  const out: string[] = [];
  for (const [i, r] of rows.entries()) {
    prev = await sha(`${i + 1}|${r.actor}|${r.action}|${r.detail}|${prev}`);
    out.push(prev);
  }
  return out;
}

export default function TamperDemo() {
  const [rows, setRows] = useState(SEED);
  const [orig, setOrig] = useState<string[]>([]);
  const [now, setNow] = useState<string[]>([]);

  useEffect(() => {
    void chain(SEED).then(setOrig);
  }, []);
  useEffect(() => {
    void chain(rows).then(setNow);
  }, [rows]);

  const firstBad = now.findIndex((h, i) => orig[i] && h !== orig[i]);
  const tampered = firstBad >= 0;

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-emerald-300">Try it: be the fraudster</div>
          <div className="text-white/75">Edit any record below (e.g. change “HUMAN_APPROVED” or the severity). Watch the chain break.</div>
        </div>
        <div className={`ml-auto rounded-full px-4 py-2 font-black ${tampered ? "bg-rose-500/25 text-rose-200" : "bg-emerald-500/20 text-emerald-200"}`}>{tampered ? `⚠ TAMPERING DETECTED at #${firstBad + 1}` : "🔗 Chain verified"}</div>
        {tampered && (
          <button onClick={() => setRows(SEED)} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
            Restore
          </button>
        )}
      </div>
      <div className="mt-5 space-y-2">
        {rows.map((r, i) => {
          const bad = tampered && i >= firstBad;
          return (
            <div key={i} className="grid items-center gap-2 rounded-2xl border p-3 transition md:grid-cols-[40px_170px_1fr_220px]" style={{ borderColor: bad ? "#ef444488" : "rgba(255,255,255,.08)", background: bad ? "rgba(239,68,68,.08)" : "rgba(255,255,255,.02)" }}>
              <span className="font-mono text-sm text-muted">#{i + 1}</span>
              <span className="text-sm font-bold text-cyan-300">{r.actor}</span>
              <div className="flex gap-2">
                <input value={r.action} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, action: e.target.value } : x)))} className="w-44 rounded-lg bg-black/30 px-2 py-1 font-mono text-sm text-violet-200 outline-none focus:ring-1 focus:ring-violet-400" />
                <input value={r.detail} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, detail: e.target.value } : x)))} className="flex-1 rounded-lg bg-black/30 px-2 py-1 font-mono text-sm outline-none focus:ring-1 focus:ring-violet-400" />
              </div>
              <span className={`truncate font-mono text-xs ${bad ? "text-rose-300 line-through" : "text-emerald-300"}`}>{now[i]?.slice(0, 24)}…</span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-muted">Each hash is computed from the record <i>and the previous hash</i>, like a register where every page is signed together with the page before it. Nobody, not even an admin, can quietly rewrite history.</p>
    </div>
  );
}
