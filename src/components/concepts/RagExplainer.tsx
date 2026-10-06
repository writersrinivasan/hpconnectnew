"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import type { RagHit } from "@/lib/rag";

const STEPS = [
  { icon: "MessageCircle", t: "1. Question", d: "“Can I refill metformin before my angiography?”", c: "#22d3ee" },
  { icon: "Search", t: "2. Search YOUR documents", d: "Protocols, formulary, insurance rules, SOPs: searched in milliseconds.", c: "#f59e0b" },
  { icon: "FileText", t: "3. Pick the best pages", d: "Top 3 most relevant passages are handed to the AI as evidence.", c: "#a855f7" },
  { icon: "BadgeCheck", t: "4. Answer + citation", d: "“Hold metformin 48h around contrast [RX-07]”: grounded, checkable.", c: "#10b981" },
];

const PRESETS = ["Patient has chest pain climbing stairs", "Does insurance cover HbA1c test?", "Can metformin be taken before angiography?", "Can I export all patient data?"];

export default function RagExplainer() {
  const [step, setStep] = useState(0);
  const [q, setQ] = useState(PRESETS[2]);
  const [hits, setHits] = useState<RagHit[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 2200);
    return () => clearInterval(t);
  }, []);

  async function search(query = q) {
    setLoading(true);
    setQ(query);
    const r = await fetch("/api/rag", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
    setHits((await r.json()).hits);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-3xl border-rose-400/30 p-6">
          <div className="text-sm font-bold uppercase tracking-wider text-rose-300">Without RAG = closed-book exam</div>
          <p className="mt-2 text-lg text-white/85">The AI answers from memory of the internet. It sounds confident but doesn&apos;t know <b>your</b> clinic&apos;s rules, prices or patients, and may <b>make things up</b>.</p>
          <div className="mt-4 rounded-2xl bg-black/30 p-4 text-[15px] italic text-white/70">“Metformin is generally safe; continue as usual.” ❌ ignores your formulary&apos;s contrast rule</div>
        </div>
        <div className="glass rounded-3xl p-6" style={{ borderColor: "#10b98166" }}>
          <div className="text-sm font-bold uppercase tracking-wider text-emerald-300">With RAG = open-book exam</div>
          <p className="mt-2 text-lg text-white/85">Before answering, the AI <b>looks up your own documents</b> and answers only from them, with a page reference you can check.</p>
          <div className="mt-4 rounded-2xl bg-black/30 p-4 text-[15px] text-white/85">“Hold metformin 48 hours before and after the angiography.” <span className="rounded bg-amber-400 px-1.5 font-mono text-xs font-bold text-black">RX-07</span> ✅</div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.div key={s.t} animate={{ scale: step === i ? 1.04 : 1, opacity: step >= i ? 1 : 0.45 }} className="glass relative rounded-2xl p-5" style={{ borderColor: step === i ? s.c : undefined, boxShadow: step === i ? `0 0 40px ${s.c}44` : undefined }}>
            <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `${s.c}25`, color: s.c }}>
              <Icon name={s.icon} className="h-5 w-5" />
            </div>
            <div className="mt-3 font-extrabold">{s.t}</div>
            <div className="mt-1 text-sm text-white/70">{s.d}</div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-3xl p-6">
        <div className="mb-3 text-sm font-bold uppercase tracking-wider text-amber-300">Try it: search Sunrise Clinic&apos;s 12 documents</div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void search();
          }}
          className="flex gap-2"
        >
          <input value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 rounded-xl border border-line bg-black/30 px-4 py-3 text-lg outline-none focus:border-amber-400" />
          <button className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 font-bold text-black">
            <Search className="h-5 w-5" /> Search
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p} onClick={() => void search(p)} className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/75 hover:bg-white/5">
              {p}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {loading && <div className="text-muted">Searching…</div>}
            {!loading &&
              hits?.map((h, i) => (
                <motion.div key={h.id + q} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} className="rounded-2xl border border-amber-300/20 bg-black/30 p-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-400 px-1.5 font-mono text-xs font-bold text-black">{h.id}</span>
                    <span className="text-xs text-muted">{h.category}</span>
                    <span className="ml-auto font-mono text-sm font-bold text-amber-200">{Math.round(h.score * 100)}%</span>
                  </div>
                  <div className="mt-2 font-bold">{h.title}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${h.score * 100}%` }} className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
                  </div>
                  <p className="mt-2 text-sm text-white/70">{h.snippet}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {h.matched.map((m) => (
                      <span key={m} className="rounded bg-white/10 px-1.5 text-[11px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            {!loading && hits?.length === 0 && <div className="text-muted">No matching document, so a well-built agent says “I don&apos;t know” instead of guessing.</div>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
