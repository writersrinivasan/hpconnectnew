import type { Metadata } from "next";
import Link from "next/link";
import Readiness from "@/components/take/Readiness";
import RoiCalc from "@/components/take/RoiCalc";
import { PageHero, SectionHead } from "@/components/ui";

export const metadata: Metadata = { title: "Take Home · CareAgents" };

const LESSONS = [
  { t: "Agents do work, not just talk", d: "The shift is from AI that answers to AI that acts: books, orders, files, follows up.", c: "#a78bfa", e: "🤖" },
  { t: "Start with a boring, painful process", d: "High volume, clear rules, low risk. Appointments, reminders, invoices, follow-ups.", c: "#22d3ee", e: "🎯" },
  { t: "Your documents are your moat", d: "RAG makes AI answer from YOUR SOPs and prices. Clean, written processes = smarter agents.", c: "#f59e0b", e: "📚" },
  { t: "Connect once, reuse forever", d: "MCP is the universal plug. Connect Tally, WhatsApp, CRM once; every agent can use them.", c: "#38bdf8", e: "🔌" },
  { t: "A team beats a genius", d: "Small specialist agents plus an orchestrator are more reliable than one giant bot.", c: "#8b5cf6", e: "🎼" },
  { t: "Humans stay in charge of risk", d: "Decide upfront what the AI may do alone, and what needs your approval. Always.", c: "#ec4899", e: "👩‍⚕️" },
  { t: "Trust is built, measured & logged", d: "Guardrails, evals, observability and an audit trail from day one, not after the first incident.", c: "#10b981", e: "🛡️" },
];

const PLAN = [
  { p: "Days 1–30", t: "Discover & prepare", c: "#22d3ee", items: ["Pick ONE workflow & measure today's time/cost", "Write down the SOP and the rules", "Define what needs human approval", "Check data & DPDP obligations"] },
  { p: "Days 31–60", t: "Pilot with guardrails", c: "#a78bfa", items: ["Build 2–3 agents + orchestrator", "Connect 2 tools via MCP", "Human approves 100% at first", "Log everything, run weekly evals"] },
  { p: "Days 61–90", t: "Measure & scale", c: "#22c55e", items: ["Compare against day-1 baseline", "Relax approval for proven low-risk steps", "Train staff as AI supervisors", "Choose the next workflow"] },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Chapter 06 · Take home"
        color="#10b981"
        title={
          <>
            7 things to <span className="grad-text">remember tomorrow morning</span>
          </>
        }
        sub="You don't need to become a technologist. You need to know what's possible, what's safe, and where to start."
      />
      <section className="mx-auto max-w-[1300px] px-4 pb-14 md:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {LESSONS.map((l, i) => (
            <div key={l.t} className={`glass relative overflow-hidden rounded-3xl p-6 ${i === 6 ? "md:col-span-2 lg:col-span-1" : ""}`} style={{ borderTop: `4px solid ${l.c}` }}>
              <div className="absolute -right-3 -top-6 text-[110px] font-black opacity-[.07]">{i + 1}</div>
              <div className="text-4xl">{l.e}</div>
              <div className="mt-3 text-xl font-extrabold leading-tight" style={{ color: l.c }}>
                {l.t}
              </div>
              <p className="mt-2 text-white/80">{l.d}</p>
            </div>
          ))}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-600 p-6">
            <div className="text-sm font-bold uppercase tracking-widest text-white/80">The one-liner</div>
            <div className="mt-3 text-2xl font-black leading-tight">AI agents do the work. Guardrails keep them safe. You stay in charge.</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1300px] px-4 py-14 md:px-6">
        <SectionHead eyebrow="Self-check · 2 minutes" color="#22d3ee" title="How ready is your business?" sub="Answer honestly. There are no wrong answers, only a starting point." />
        <Readiness />
      </section>

      <section className="mx-auto max-w-[1300px] px-4 py-14 md:px-6">
        <SectionHead eyebrow="Back-of-the-envelope ROI" color="#a78bfa" title="What could agents give back to your team?" sub="Move the sliders to match your business." />
        <RoiCalc />
      </section>

      <section className="mx-auto max-w-[1300px] px-4 py-14 md:px-6">
        <SectionHead eyebrow="Your next 90 days" color="#22c55e" title="Start small. Prove it. Then scale." />
        <div className="grid gap-4 md:grid-cols-3">
          {PLAN.map((p, i) => (
            <div key={p.p} className="glass relative rounded-3xl p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl text-xl font-black text-black" style={{ background: p.c }}>
                  {i + 1}
                </span>
                <div>
                  <div className="font-mono text-sm" style={{ color: p.c }}>
                    {p.p}
                  </div>
                  <div className="text-xl font-extrabold">{p.t}</div>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {p.items.map((x) => (
                  <li key={x} className="flex gap-2 text-white/85">
                    <span style={{ color: p.c }}>✔</span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-28 pt-16 text-center">
        <div className="glass relative overflow-hidden rounded-[2.5rem] p-10 md:p-16">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/25 via-transparent to-cyan-500/25" />
          <div className="relative">
            <div className="text-6xl">💡</div>
            <blockquote className="mt-6 text-3xl font-black leading-tight md:text-5xl">
              AI won&apos;t replace MSMEs.
              <br />
              <span className="grad-text">MSMEs that use AI agents wisely</span>
              <br />
              will outpace those that don&apos;t.
            </blockquote>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/live" className="rounded-2xl bg-white px-6 py-4 text-lg font-extrabold text-black">
                Replay the live demo
              </Link>
              <Link href="/" className="rounded-2xl border border-white/20 px-6 py-4 text-lg font-bold">
                Back to the start
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
