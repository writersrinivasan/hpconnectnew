import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Icon from "@/components/Icon";
import DayToggle from "@/components/home/DayToggle";
import Orbit from "@/components/home/Orbit";
import { Eyebrow, SectionHead } from "@/components/ui";
import { AGENTS, MAIN_FLOW } from "@/lib/agents";

const ERAS = [
  { n: "2000s", t: "Software", d: "You click every button. The computer only stores what you type.", e: "Tally, Excel, billing software", c: "#64748b", icon: "Server" },
  { n: "2023", t: "Chatbots / GenAI", d: "You ask, it answers. But you still copy-paste and do the work yourself.", e: "ChatGPT, Claude, Gemini chats", c: "#0ea5e9", icon: "Bot" },
  { n: "Now", t: "Agentic AI", d: "You set the GOAL. A team of AI agents plans, uses your tools, checks rules, and finishes the job. You approve what matters.", e: "Agents that book, order, file, follow up", c: "#a855f7", icon: "Network" },
];

const INDUSTRIES = [
  { icon: "Factory", t: "Manufacturing", d: "Agent reads the purchase order → checks raw-material stock → schedules the machine → alerts the supervisor on delay.", c: "#f59e0b" },
  { icon: "Shirt", t: "Textiles & Garments", d: "Agent matches buyer specs to fabric inventory, drafts the quote, tracks the export documents.", c: "#ec4899" },
  { icon: "Store", t: "Retail & Distribution", d: "Agent predicts which items will run out, raises the reorder, and WhatsApps the distributor.", c: "#10b981" },
  { icon: "Truck", t: "Logistics", d: "Agent plans routes, updates customers on delivery time, and handles POD & e-way bill paperwork.", c: "#0ea5e9" },
  { icon: "Landmark", t: "Finance & CA firms", d: "Agent collects invoices, reconciles GST, flags mismatches, drafts the client reminder.", c: "#8b5cf6" },
  { icon: "Wheat", t: "Food processing", d: "Agent tracks batch quality, expiry and FSSAI records; alerts before a compliance miss.", c: "#f97316" },
];

const CHAPTERS = [
  { href: "/concepts", n: "02", t: "RAG · MCP · Orchestration", d: "The 3 building blocks, explained with everyday analogies.", c: "#f59e0b", icon: "Brain" },
  { href: "/live", n: "03", t: "Live Agents", d: "Watch 9 agents handle real clinic requests and pause for the doctor.", c: "#22d3ee", icon: "Play" },
  { href: "/architecture", n: "04", t: "Architecture", d: "How it's built: layers, tools, deployment and documentation.", c: "#6366f1", icon: "Layers" },
  { href: "/trust", n: "05", t: "Trust & Safety", d: "Guardrails, security, governance, evals, observability, audit.", c: "#f43f5e", icon: "ShieldCheck" },
  { href: "/takeaways", n: "06", t: "Take Home", d: "7 lessons, readiness check, ROI calculator and a 90-day plan.", c: "#10b981", icon: "Rocket" },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-4 pb-16 pt-12 md:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-20">
        <div>
          <Eyebrow>Agentic AI · Healthcare · For MSME leaders</Eyebrow>
          <h1 className="text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
            Your business.
            <br />
            Run by a <span className="grad-text shimmer">team of AI agents.</span>
            <br />
            <span className="text-white/60">Supervised by you.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">
            Follow one small clinic in Coimbatore through a single morning and watch AI agents read, decide, use tools, follow rules and ask the doctor before anything risky. Then take the same pattern back to <b className="text-white">your</b> business.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/live" className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-6 py-4 text-lg font-extrabold shadow-xl shadow-violet-500/30 hover:brightness-110">
              Watch the agents live <ArrowRight />
            </Link>
            <a href="#shift" className="rounded-2xl border border-line px-6 py-4 text-lg font-bold hover:bg-white/5">
              Start the story
            </a>
          </div>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
            {[
              ["9", "AI agents"],
              ["6", "tools via MCP"],
              ["1", "doctor in charge"],
            ].map(([n, l]) => (
              <div key={l} className="glass rounded-2xl p-4 text-center">
                <div className="grad-text text-4xl font-black">{n}</div>
                <div className="text-xs font-semibold text-muted">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <Orbit />
      </section>

      {/* THE SHIFT */}
      <section id="shift" className="mx-auto max-w-[1300px] scroll-mt-20 px-4 py-16 md:px-6">
        <SectionHead eyebrow="The shift" title={<>From tools you <i>use</i> → to a team that <span className="grad-text">works</span></>} sub="This is the biggest change in business software since the internet, and it is already affordable for small businesses." color="#a855f7" />
        <div className="grid gap-5 md:grid-cols-3">
          {ERAS.map((e, i) => (
            <div key={e.t} className="glass relative overflow-hidden rounded-3xl p-7" style={i === 2 ? { borderColor: `${e.c}88`, boxShadow: `0 0 60px ${e.c}33` } : undefined}>
              <div className="font-mono text-sm font-bold" style={{ color: e.c }}>
                {e.n}
              </div>
              <div className="mt-3 grid h-14 w-14 place-items-center rounded-2xl" style={{ background: `${e.c}25`, color: e.c }}>
                <Icon name={e.icon} className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-2xl font-extrabold">{e.t}</h3>
              <p className="mt-2 text-white/75">{e.d}</p>
              <p className="mt-4 text-sm text-muted">e.g. {e.e}</p>
              {i === 2 && <span className="absolute right-5 top-5 rounded-full bg-violet-500 px-3 py-1 text-xs font-black">YOU ARE HERE</span>}
            </div>
          ))}
        </div>
        <div className="glass mx-auto mt-8 max-w-4xl rounded-3xl p-6 text-center text-lg md:text-xl">
          An <b className="text-violet-300">AI agent</b> = an AI model + <b className="text-amber-300">knowledge</b> (RAG) + <b className="text-sky-300">tools</b> (MCP) + <b className="text-emerald-300">a goal</b> + <b className="text-rose-300">rules</b> (guardrails).
          <br />
          <span className="text-muted">Many agents working together, coordinated by an orchestrator = a </span>
          <b>multi-agent system</b>.
        </div>
      </section>

      {/* DAY IN THE LIFE */}
      <section className="mx-auto max-w-[1300px] px-4 py-16 md:px-6">
        <SectionHead eyebrow="A day at Sunrise Clinic" title={<>Dr. Meena runs a 20-bed clinic. <span className="text-white/60">Here&apos;s her day.</span></>} sub="Toggle between today's reality and the agentic version. The doctor's job doesn't disappear; the busywork does." color="#f59e0b" />
        <DayToggle />
      </section>

      {/* TEAM */}
      <section className="mx-auto max-w-[1300px] px-4 py-16 md:px-6">
        <SectionHead eyebrow="Meet the team" title={<>9 AI agents. <span className="grad-text">Each with one job.</span></>} sub="Just like your staff: each agent has a role, the tools it is allowed to use, and a manager it reports to." color="#22d3ee" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MAIN_FLOW.map((id, i) => {
            const a = AGENTS[id];
            return (
              <div key={id} className="glass group rounded-3xl p-5 transition hover:-translate-y-1" style={{ borderTop: `3px solid ${a.color}` }}>
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: `${a.color}25`, color: a.color }}>
                    <Icon name={a.icon} className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-mono text-xs text-muted">Agent {i + 1}</div>
                    <div className="text-lg font-extrabold">{a.name}</div>
                  </div>
                </div>
                <p className="mt-3 text-[15px] text-white/80">{a.role}</p>
                <div className="mt-3 rounded-xl bg-white/5 px-3 py-2 text-sm">
                  <span className="text-muted">Human equivalent: </span>
                  <b style={{ color: a.color }}>{a.human}</b>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {a.uses.map((u) => (
                    <span key={u} className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-white/70">
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="mx-auto max-w-[1300px] px-4 py-16 md:px-6">
        <SectionHead eyebrow="Not just hospitals" title={<>The <span className="grad-text">same pattern</span> works in your industry</>} sub="Guard the input → orchestrate → specialist agents use your tools → a human approves the risky part → act and record. Swap the tools, keep the pattern." color="#10b981" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((x) => (
            <div key={x.t} className="glass rounded-3xl p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `${x.c}25`, color: x.c }}>
                  <Icon name={x.icon} className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold">{x.t}</h3>
              </div>
              <p className="mt-3 text-white/75">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CHAPTERS */}
      <section className="mx-auto max-w-[1300px] px-4 pb-24 pt-10 md:px-6">
        <SectionHead eyebrow="Today's journey" title="Where we go next" color="#a78bfa" />
        <div className="grid gap-4 md:grid-cols-5">
          {CHAPTERS.map((c) => (
            <Link key={c.href} href={c.href} className="glass group rounded-3xl p-5 transition hover:-translate-y-1 hover:bg-white/[.07]">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `${c.c}25`, color: c.c }}>
                  <Icon name={c.icon} className="h-5 w-5" />
                </div>
                <span className="font-mono text-sm text-muted">{c.n}</span>
              </div>
              <div className="mt-4 text-lg font-extrabold leading-tight">{c.t}</div>
              <p className="mt-2 text-sm text-muted">{c.d}</p>
              <div className="mt-3 flex items-center gap-1 text-sm font-bold opacity-0 transition group-hover:opacity-100" style={{ color: c.c }}>
                Open <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
