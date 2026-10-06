import Image from "next/image";
import type { ReactNode } from "react";
import Icon from "@/components/Icon";
import { AGENTS, MAIN_FLOW } from "@/lib/agents";
import { BRAND, Card, Grad, H, Kicker, Sub, Y } from "./kit";

export interface SlideDef {
  id: string;
  section: string;
  live?: { href: string; label: string };
  notes: string;
  render: () => ReactNode;
}

export const SPEAKER = {
  name: "Srinivasan Ramanujam",
  role: "Founder, OneYoto",
  email: "srinivasan@oneyoto.in",
  web: "oneyoto.in",
  tagline: "Ideas move faster",
};

export const AGENDA = [
  { t: "Why agentic AI, why now", s: "shift", c: "#a78bfa", e: "🌊" },
  { t: "A day at Sunrise Clinic", s: "day", c: BRAND.yellow, e: "🏥" },
  { t: "Building blocks: RAG · MCP · Orchestration", s: "rag", c: "#f59e0b", e: "🧱" },
  { t: "LIVE: 9 agents run the clinic", s: "demo1", c: "#22d3ee", e: "▶️" },
  { t: "Architecture, layer by layer", s: "arch", c: "#6366f1", e: "🏗️" },
  { t: "Trust: guardrails, security, governance, evals", s: "trust", c: "#f43f5e", e: "🛡️" },
  { t: "Ask CareBot: watch AI think", s: "carebot", c: "#06b6d4", e: "🤖" },
  { t: "Your take-home plan", s: "take", c: "#22c55e", e: "🚀" },
];

const Big = ({ n, l, c }: { n: string; l: string; c: string }) => (
  <div>
    <div className="text-[64px] font-black leading-none" style={{ color: c }}>
      {n}
    </div>
    <div className="mt-2 text-[22px] font-semibold text-white/60">{l}</div>
  </div>
);

const Bullet = ({ children, c = BRAND.yellow }: { children: ReactNode; c?: string }) => (
  <li className="flex gap-4 text-[30px] leading-snug text-white/85">
    <span style={{ color: c }}>●</span>
    <span>{children}</span>
  </li>
);

function LiveCue({ steps, c }: { steps: string[]; c: string }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      {steps.map((s, i) => (
        <div key={s} className="flex items-start gap-4 rounded-2xl bg-white/[.05] p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[22px] font-black text-black" style={{ background: c }}>
            {i + 1}
          </span>
          <span className="text-[26px] leading-snug text-white/85">{s}</span>
        </div>
      ))}
    </div>
  );
}

export const SLIDES: SlideDef[] = [
  {
    id: "title",
    section: "Welcome",
    notes: "Welcome everyone. Today is not about technology for its own sake. It's about how a small business can get a tireless digital team, safely. Everything I show is live, running right now.",
    render: () => (
      <div className="flex h-full items-center gap-16">
        <div className="flex-1">
          <Image src="/brand/oneyoto-logo.png" alt="OneYoto" width={260} height={108} className="mb-10 h-auto w-[230px]" priority />
          <Kicker>Agentic AI · Healthcare · For MSME leaders</Kicker>
          <h1 className="text-[84px] font-extrabold leading-[1.02] tracking-tight">
            Your business.
            <br />
            Run by a <Grad>team of AI agents.</Grad>
            <br />
            <span className="text-white/55">Supervised by you.</span>
          </h1>
          <div className="mt-12 flex items-center gap-5">
            <Image src="/brand/srinivasan-ramanujam.jpg" alt={SPEAKER.name} width={88} height={88} className="h-[88px] w-[88px] rounded-full border-4 object-cover" style={{ borderColor: BRAND.yellow }} />
            <div>
              <div className="text-[34px] font-extrabold">{SPEAKER.name}</div>
              <div className="text-[24px] text-white/60">{SPEAKER.role}</div>
            </div>
          </div>
        </div>
        <div className="grid w-[400px] shrink-0 grid-cols-3 gap-5">
          {MAIN_FLOW.map((id, i) => (
            <div key={id} className="float grid aspect-square place-items-center rounded-[28px] border-2" style={{ borderColor: AGENTS[id].color, background: `${AGENTS[id].color}26`, boxShadow: `0 0 40px ${AGENTS[id].color}55`, animationDelay: `${i * 0.35}s` }}>
              <Icon name={AGENTS[id].icon} className="h-14 w-14" style={{ color: AGENTS[id].color }} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "speaker",
    section: "Welcome",
    notes: "Brief intro: 25 years building software, 8 years training. I've seen every wave: client-server, web, mobile, cloud. This one, agentic AI, is the one that changes how small businesses operate.",
    render: () => (
      <div className="flex h-full items-center gap-20">
        <div className="relative shrink-0">
          <div className="absolute -inset-4 rounded-[48px] opacity-70 blur-2xl" style={{ background: `linear-gradient(135deg, ${BRAND.yellow}, ${BRAND.red})` }} />
          <Image src="/brand/srinivasan-ramanujam.jpg" alt={SPEAKER.name} width={520} height={520} className="relative h-[520px] w-[520px] rounded-[40px] object-cover" />
        </div>
        <div className="flex-1">
          <Kicker>Your speaker</Kicker>
          <H size={84}>{SPEAKER.name}</H>
          <div className="mt-3 flex items-center gap-5 text-[32px] font-semibold text-white/75">
            Founder · <Image src="/brand/oneyoto-logo.png" alt="OneYoto" width={170} height={71} className="h-auto w-[150px]" />
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8">
            <Big n="25" l="years in software engineering" c={BRAND.yellow} />
            <Big n="40K+" l="professionals trained" c="#22d3ee" />
            <Big n="700+" l="educators trained globally" c="#a78bfa" />
          </div>
          <Sub style={{ marginTop: 48 }}>Building products and training teams at the intersection of deep tech and how people actually learn.</Sub>
        </div>
      </div>
    ),
  },
  {
    id: "agenda",
    section: "Agenda",
    notes: "Here's the journey. Every topic has a live screen next to it. You'll see it working, not just hear about it. Click any item to jump.",
    render: () => null, // rendered by the deck (needs navigation)
  },
  {
    id: "shift",
    section: "Why now",
    live: { href: "/#shift", label: "The shift" },
    notes: "Three eras. In the software era you clicked every button. In the chatbot era you asked, it answered, but you still did the work. In the agent era you set the goal and a team does the work. You approve what matters.",
    render: () => (
      <div>
        <Kicker color="#a78bfa">The shift</Kicker>
        <H>
          From tools you <i>use</i> → to a team that <Grad>works</Grad>
        </H>
        <div className="mt-14 grid grid-cols-3 gap-7">
          {[
            ["2000s", "Software", "You click every button. It only stores what you type.", "#64748b", "Server"],
            ["2023", "Chatbots", "You ask, it answers. You still copy-paste and do the work.", "#0ea5e9", "Bot"],
            ["NOW", "Agentic AI", "You set the GOAL. Agents plan, use your tools, follow rules and finish the job.", "#a855f7", "Network"],
          ].map(([y, t, d, c, ic], i) => (
            <Card key={t} color={c} style={i === 2 ? { boxShadow: `0 0 70px ${c}55`, background: `${c}18` } : undefined}>
              <div className="font-mono text-[24px] font-bold" style={{ color: c }}>
                {y}
              </div>
              <Icon name={ic} className="mt-4 h-16 w-16" style={{ color: c }} />
              <div className="mt-4 text-[44px] font-extrabold">{t}</div>
              <p className="mt-3 text-[27px] leading-snug text-white/75">{d}</p>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "formula",
    section: "Why now",
    notes: "If you remember one definition today, make it this one. An agent is a model plus knowledge plus tools plus a goal plus rules. Many agents with a manager is a multi-agent system.",
    render: () => (
      <div className="flex h-full flex-col justify-center">
        <Kicker color="#22d3ee">One definition to remember</Kicker>
        <H size={70}>What is an AI agent?</H>
        <div className="mt-14 flex flex-wrap items-center gap-5 text-[40px] font-extrabold">
          {[
            ["🧠", "AI model", "#a78bfa"],
            ["📚", "Knowledge", "#f59e0b"],
            ["🔌", "Tools", "#38bdf8"],
            ["🎯", "Goal", "#22c55e"],
            ["🛡️", "Rules", "#f43f5e"],
          ].map(([e, t, c], i) => (
            <span key={t} className="flex items-center gap-5">
              {i > 0 && <span className="text-white/40">+</span>}
              <span className="rounded-3xl border-2 px-7 py-5" style={{ borderColor: c, background: `${c}20`, color: c }}>
                {e} {t}
              </span>
            </span>
          ))}
          <span className="text-white/40">=</span>
          <span className="rounded-3xl px-7 py-5 text-black" style={{ background: BRAND.yellow }}>
            🤖 Agent
          </span>
        </div>
        <Sub style={{ marginTop: 56, fontSize: 36 }}>
          Many agents + a manager (orchestrator) + a human for risky calls = a <b className="text-white">multi-agent system</b>.
        </Sub>
      </div>
    ),
  },
  {
    id: "day",
    section: "Sunrise Clinic",
    live: { href: "/", label: "Day at the clinic" },
    notes: "Meet Dr. Meena: 20-bed clinic in Coimbatore. On the live page, toggle 'Today' vs 'With AI agents' and watch 10 and a half hours of busywork shrink. The doctor's job doesn't disappear. The busywork does.",
    render: () => (
      <div>
        <Kicker>A day at Sunrise Clinic, Coimbatore</Kicker>
        <H>Dr. Meena runs a 20-bed clinic.</H>
        <div className="mt-12 grid grid-cols-[1fr_auto_1fr] items-center gap-10">
          <Card color="#f43f5e" style={{ background: "rgba(244,63,94,.08)" }}>
            <div className="text-[30px] font-extrabold text-rose-300">😓 Today</div>
            <div className="mt-2 text-[96px] font-black leading-none text-rose-300">10h 30m</div>
            <ul className="mt-6 space-y-2 text-[25px] text-white/75">
              <li>• 40 calls & WhatsApps every morning</li>
              <li>• Insurance pre-auth: 2–4 hours</li>
              <li>• Registers, Excel, late-night paperwork</li>
            </ul>
          </Card>
          <div className="text-[80px]">→</div>
          <Card color="#22c55e" style={{ background: "rgba(34,197,94,.08)" }}>
            <div className="text-[30px] font-extrabold text-emerald-300">🚀 With AI agents</div>
            <div className="mt-2 text-[96px] font-black leading-none text-emerald-300">36m</div>
            <ul className="mt-6 space-y-2 text-[25px] text-white/75">
              <li>• Urgent cases jump the queue automatically</li>
              <li>• Pre-auth raised in minutes</li>
              <li>• Audit trail already written</li>
            </ul>
          </Card>
        </div>
        <p className="mt-8 text-[24px] text-white/45">Staff time on 6 daily routines (illustrative)</p>
      </div>
    ),
  },
  {
    id: "team",
    section: "Sunrise Clinic",
    live: { href: "/", label: "Meet the team" },
    notes: "Just like staff: each agent has ONE job, only the tools it's allowed, and someone it reports to. Point out the human equivalents. Owners relate to that instantly.",
    render: () => (
      <div>
        <Kicker color="#22d3ee">Meet the team</Kicker>
        <H size={68}>
          9 AI agents. <Grad>Each with one job.</Grad>
        </H>
        <div className="mt-10 grid grid-cols-3 gap-4">
          {MAIN_FLOW.map((id) => {
            const a = AGENTS[id];
            return (
              <div key={id} className="flex items-center gap-4 rounded-2xl border-2 bg-white/[.04] p-4" style={{ borderColor: `${a.color}55` }}>
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl" style={{ background: `${a.color}2a`, color: a.color }}>
                  <Icon name={a.icon} className="h-9 w-9" />
                </div>
                <div>
                  <div className="text-[26px] font-extrabold">{a.name}</div>
                  <div className="text-[20px]" style={{ color: a.color }}>
                    like a {a.human.toLowerCase()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),
  },
  {
    id: "rag",
    section: "Building blocks",
    live: { href: "/concepts#rag", label: "RAG demo" },
    notes: "RAG = open-book exam. Live: type 'Can metformin be taken before angiography?' and show it pulls RX-07 from the clinic's own formulary. Without RAG, the AI answers from internet memory and may miss your rule.",
    render: () => (
      <div>
        <Kicker color="#f59e0b">Block 1 · RAG</Kicker>
        <H>
          Give the AI <span className="text-amber-300">your</span> rulebook
        </H>
        <div className="mt-12 grid grid-cols-2 gap-8">
          <Card color="#f43f5e">
            <div className="text-[26px] font-bold uppercase tracking-wider text-rose-300">Without RAG</div>
            <div className="mt-2 text-[46px] font-extrabold">📕 Closed-book exam</div>
            <p className="mt-4 text-[27px] text-white/75">Answers from internet memory. Confident, generic, sometimes made up.</p>
          </Card>
          <Card color="#22c55e">
            <div className="text-[26px] font-bold uppercase tracking-wider text-emerald-300">With RAG</div>
            <div className="mt-2 text-[46px] font-extrabold">📖 Open-book exam</div>
            <p className="mt-4 text-[27px] text-white/75">
              Looks up <b>your</b> SOPs & protocols first, and cites the page <span className="rounded bg-amber-400 px-2 font-mono text-[22px] font-bold text-black">RX-07</span>
            </p>
          </Card>
        </div>
        <div className="mt-10 flex items-center gap-4 text-[28px] font-bold">
          {["❓ Question", "🔎 Search your docs", "📄 Best 3 pages", "✅ Cited answer"].map((s, i) => (
            <span key={s} className="flex items-center gap-4">
              {i > 0 && <span className="text-white/30">→</span>}
              <span className="rounded-2xl bg-white/[.06] px-5 py-3">{s}</span>
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "mcp",
    section: "Building blocks",
    live: { href: "/concepts#mcp", label: "MCP demo" },
    notes: "MCP = USB-C for AI. Toggle 'Without MCP' on the live page: spaghetti, 24 custom integrations. With MCP: 10. Connect Tally, WhatsApp, your HIS once, and every agent can use them. And you decide what each tool allows.",
    render: () => (
      <div>
        <Kicker color="#38bdf8">Block 2 · MCP</Kicker>
        <H>
          Give the AI <span className="text-sky-300">hands</span>, safely
        </H>
        <div className="mt-12 grid grid-cols-[1.1fr_1fr] gap-10">
          <div>
            <div className="text-[150px] leading-none">🔌</div>
            <div className="mt-4 text-[52px] font-extrabold">USB-C for AI</div>
            <p className="mt-3 text-[29px] text-white/75">One open standard (Model Context Protocol) lets any agent plug into any business tool.</p>
          </div>
          <div className="space-y-5">
            <Card color="#f43f5e" className="!p-6">
              <div className="text-[26px] text-white/70">Without MCP · 4 agents × 6 tools</div>
              <div className="text-[56px] font-black text-rose-300">24 integrations 🍝</div>
            </Card>
            <Card color="#38bdf8" className="!p-6">
              <div className="text-[26px] text-white/70">With MCP · 4 agents + 6 tools</div>
              <div className="text-[56px] font-black text-sky-300">10 connections ✨</div>
            </Card>
            <div className="text-[25px] text-white/65">🛂 Each tool exposes only allowed actions: <i>read</i> records, never <i>delete</i>.</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "orch",
    section: "Building blocks",
    live: { href: "/concepts#orch", label: "Orchestration patterns" },
    notes: "Orchestration is the manager. Click through the four patterns on the live page. Parallel is the kitchen with three cooks. Human-in-the-loop is the cheque-signing rule. That's LangGraph.",
    render: () => (
      <div>
        <Kicker color="#a78bfa">Block 3 · Orchestration (LangGraph)</Kicker>
        <H>
          Turn single agents into a <span className="text-violet-300">team</span>
        </H>
        <div className="mt-12 grid grid-cols-4 gap-5">
          {[
            ["➡️", "Sequential", "An assembly line", "#f43f5e"],
            ["🔀", "Parallel", "A kitchen: 3 cooks at once", "#f59e0b"],
            ["🧭", "Supervisor", "A head nurse routing patients", "#8b5cf6"],
            ["✋", "Human-in-the-loop", "Big cheques need the owner's signature", "#ec4899"],
          ].map(([e, t, d, c]) => (
            <Card key={t} color={c}>
              <div className="text-[64px]">{e}</div>
              <div className="mt-3 text-[34px] font-extrabold" style={{ color: c }}>
                {t}
              </div>
              <p className="mt-2 text-[25px] text-white/75">{d}</p>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "demo1",
    section: "Live demo",
    live: { href: "/live", label: "Live agents" },
    notes: "Pick 'Chest tightness + refill', speed 'Presenter', press Run. Narrate the caption bar. Pause on the parallel step. When the doctor modal appears, ask the room: 'Should I approve?' Then approve and show the Tamil WhatsApp and the Evals tab.",
    render: () => (
      <div>
        <Kicker color="#22d3ee">▶ Live demo 1</Kicker>
        <H size={70}>Mrs. Lakshmi, 58: chest tightness + medicine refill</H>
        <div className="mt-6 rounded-3xl bg-[#0b3d2e]/70 p-6 text-[28px] leading-snug text-green-50">
          💬 “Since yesterday I get chest tightness when I climb stairs. Can I see a heart doctor today? Also my metformin tablets are almost over…”
        </div>
        <LiveCue
          c="#22d3ee"
          steps={["🛡️ Guardian hides her phone number before any AI sees it", "🔀 Triage, Records & Pharmacy work IN PARALLEL", "📚 Triage cites protocol CP-01 → HIGH priority", "⏸️ System PAUSES: the doctor must approve", "🔌 9 MCP tool calls: calendar, insurance, pharmacy…", "📱 WhatsApp in Tamil + English, 108 advice included"]}
        />
      </div>
    ),
  },
  {
    id: "hitl",
    section: "Live demo",
    live: { href: "/live", label: "Live agents" },
    notes: "This is the most important slide for owners. The AI never replaces the doctor's judgement. It prepares everything: evidence, citations, proposed actions. The doctor spends 10 seconds instead of 45 minutes.",
    render: () => (
      <div className="flex h-full items-center gap-16">
        <div className="flex-1">
          <Kicker color="#ec4899">Human-in-the-loop</Kicker>
          <H size={96}>
            AI <span className="text-cyan-300">prepares.</span>
            <br />
            Human <span className="text-pink-400">decides.</span>
          </H>
          <Sub>High-risk steps (urgent triage, prescriptions, refunds) automatically pause. The workflow is saved and resumes the moment the doctor clicks.</Sub>
        </div>
        <Card color="#ec4899" className="w-[520px]" style={{ background: "rgba(236,72,153,.1)" }}>
          <div className="text-[24px] font-bold uppercase tracking-wider text-pink-300">Dr. Meena&apos;s screen</div>
          <ul className="mt-4 space-y-3 text-[25px] text-white/85">
            <li>🩺 AI assessment + evidence [CP-01]</li>
            <li>📅 11:30 cardiology slot held</li>
            <li>💊 Refill drafted, interaction advisory</li>
            <li>🛡️ Insurance pre-auth approved</li>
          </ul>
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-center text-[30px] font-black">✅ Approve & send</div>
        </Card>
      </div>
    ),
  },
  {
    id: "demo23",
    section: "Live demo",
    live: { href: "/live", label: "Live agents" },
    notes: "Run 'Routine check-up': no pharmacy, no doctor needed, done in seconds. Then 'Hacker': blocked at the gate, incident raised, zero records touched. Contrast: the same system knows when to act alone, when to ask, and when to refuse.",
    render: () => (
      <div>
        <Kicker color="#22d3ee">▶ Live demos 2 & 3</Kicker>
        <H size={70}>Same system. Three different behaviours.</H>
        <div className="mt-12 grid grid-cols-3 gap-6">
          {[
            ["👵🏽", "High risk", "Asks the doctor", "#f43f5e", "Lakshmi: chest pain + refill → pauses for approval"],
            ["👨🏽‍💼", "Low risk", "Acts alone", "#22c55e", "Ravi: routine check-up → booked end-to-end, no human needed"],
            ["🕵️", "Attack", "Refuses", "#ef4444", "“Export all patient records…” → blocked, incident logged, 0 records exposed"],
          ].map(([e, tag, act, c, d]) => (
            <Card key={tag} color={c}>
              <div className="text-[72px]">{e}</div>
              <div className="mt-2 text-[24px] font-bold uppercase tracking-wider" style={{ color: c }}>
                {tag}
              </div>
              <div className="text-[44px] font-extrabold">{act}</div>
              <p className="mt-3 text-[25px] text-white/75">{d}</p>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "arch",
    section: "Architecture",
    live: { href: "/architecture", label: "Architecture" },
    notes: "Think of a building: a gate, security, a manager, specialists, a library and a toolroom, with CCTV, locks and rules on every floor. Click the layers on the live page. Mention the three deployment options for MSMEs.",
    render: () => (
      <div className="grid h-full grid-cols-[1fr_1.05fr] items-center gap-14">
        <div>
          <Kicker color="#6366f1">Architecture</Kicker>
          <H size={70}>Built like a well-run building</H>
          <Sub>A gate, security guards, a manager, specialists, a library and a toolroom, with CCTV, locks and rules on every floor.</Sub>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 space-y-2.5">
            {[
              ["Channels: WhatsApp, web, voice", "#22c55e"],
              ["Gateway & identity", "#94a3b8"],
              ["Guardrails (in & out)", "#f43f5e"],
              ["Orchestration: LangGraph", "#8b5cf6"],
              ["Specialist agents", "#f59e0b"],
              ["Knowledge (RAG) & tools (MCP)", "#0ea5e9"],
              ["AI models: swappable", "#a855f7"],
              ["Data: encrypted, in India", "#06b6d4"],
            ].map(([t, c], i) => (
              <div key={t} className="flex items-center gap-4 rounded-2xl border-2 px-5 py-3 text-[25px] font-bold" style={{ borderColor: `${c}77`, background: `${c}1c` }}>
                <span className="font-mono text-[20px] text-white/50">{i + 1}</span>
                {t}
              </div>
            ))}
          </div>
          <div className="flex w-20 flex-col gap-2.5">
            {[
              ["Observability", "#22d3ee"],
              ["Security", "#f43f5e"],
              ["Governance", "#facc15"],
            ].map(([t, c]) => (
              <div key={t} className="flex flex-1 items-center justify-center rounded-2xl border-2 text-[20px] font-bold [writing-mode:vertical-rl]" style={{ borderColor: `${c}66`, color: c, background: `${c}14` }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "trust",
    section: "Trust & safety",
    live: { href: "/trust", label: "Trust & Safety" },
    notes: "Powerful AI is useless if you can't trust it. These six disciplines separate a risky gadget from a dependable business system. Most AI projects fail here, not on the model.",
    render: () => (
      <div>
        <Kicker color="#f43f5e">Trust & safety</Kicker>
        <H>
          Powerful AI is useless if you <Grad>can&apos;t trust it</Grad>
        </H>
        <div className="mt-12 grid grid-cols-3 gap-5">
          {[
            ["ShieldCheck", "Guardrails", "Checks on what comes in and goes out", "#f43f5e"],
            ["Lock", "Cyber security", "Stop attackers using your AI against you", "#ef4444"],
            ["Scale", "Governance", "Who decides, what's allowed, who's accountable", "#facc15"],
            ["FlaskConical", "Evals", "Test the AI like a new employee", "#a855f7"],
            ["Activity", "Observability", "CCTV for every decision", "#22d3ee"],
            ["Fingerprint", "Audit trail", "Prove who did what, when, why", "#10b981"],
          ].map(([ic, t, d, c]) => (
            <Card key={t} color={c} className="flex items-center gap-5 !p-6">
              <Icon name={ic} className="h-14 w-14 shrink-0" style={{ color: c }} />
              <div>
                <div className="text-[32px] font-extrabold">{t}</div>
                <div className="text-[23px] text-white/70">{d}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "guard",
    section: "Trust & safety",
    live: { href: "/trust#guardrails", label: "Guardrail playground" },
    notes: "Invite someone from the audience to try to break it. Use the presets: private data gets masked, prompt injection gets blocked. Then mention the top threats: injection, data leakage, excessive agency, denial of wallet.",
    render: () => (
      <div>
        <Kicker color="#f43f5e">Guardrails & cyber security</Kicker>
        <H size={70}>A guard at the door AND at the exit</H>
        <div className="mt-10 grid grid-cols-2 gap-8">
          <Card color="#f43f5e">
            <div className="text-[30px] font-extrabold text-rose-300">🚪 On the way in</div>
            <ul className="mt-4 space-y-3">
              <Bullet c="#f43f5e">Mask Aadhaar, phone, email</Bullet>
              <Bullet c="#f43f5e">Block prompt injection & jailbreaks</Bullet>
              <Bullet c="#f43f5e">Healthcare topics only</Bullet>
            </ul>
          </Card>
          <Card color="#f97316">
            <div className="text-[30px] font-extrabold text-orange-300">📤 On the way out</div>
            <ul className="mt-4 space-y-3">
              <Bullet c="#f97316">No leaked personal data</Bullet>
              <Bullet c="#f97316">No diagnosis over chat</Bullet>
              <Bullet c="#f97316">Facts must match the tools</Bullet>
            </ul>
          </Card>
        </div>
        <div className="mt-8 rounded-3xl border-2 border-dashed border-rose-400/50 p-6 text-center text-[32px] font-bold">
          🎯 Audience challenge: <Y>try to break it</Y> on the live screen
        </div>
      </div>
    ),
  },
  {
    id: "gov",
    section: "Trust & safety",
    live: { href: "/trust#governance", label: "Governance" },
    notes: "Same as delegating to staff: a junior can send reminders, but refunds need the manager. Decide this BEFORE you deploy. Mention DPDP Act 2023 as the must-know regulation in India.",
    render: () => (
      <div>
        <Kicker color="#facc15">Governance</Kicker>
        <H size={70}>Match human control to the level of risk</H>
        <div className="mt-12 grid grid-cols-4 gap-5">
          {[
            ["Low", "Reminders, FAQs, routine bookings", "Fully automated", "#22c55e"],
            ["Medium", "Insurance pre-auth, lab alerts", "Automated + daily review", "#f59e0b"],
            ["High", "Urgent triage, prescriptions, refunds", "Human approves every time", "#ef4444"],
            ["Prohibited", "Diagnosis, bulk export, deleting records", "AI cannot do it, by design", "#64748b"],
          ].map(([t, eg, ctl, c]) => (
            <Card key={t} color={c} style={{ background: `${c}14` }}>
              <div className="text-[26px] font-black uppercase tracking-widest" style={{ color: c }}>
                {t}
              </div>
              <p className="mt-3 min-h-[100px] text-[25px] text-white/80">{eg}</p>
              <div className="mt-3 rounded-2xl bg-black/30 p-4 text-[23px] font-bold">{ctl}</div>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-[25px] text-white/60">Know: DPDP Act 2023 · ABDM · ICMR AI ethics guidelines · ISO/IEC 42001 · NABH</p>
      </div>
    ),
  },
  {
    id: "audit",
    section: "Trust & safety",
    live: { href: "/trust#audit", label: "Tamper demo" },
    notes: "On the live screen, edit an audit record (e.g. change HUMAN_APPROVED). The chain breaks instantly in red. That's a register nobody, not even an admin, can quietly rewrite. Evals: test the AI like a new employee before and after every change.",
    render: () => (
      <div>
        <Kicker color="#10b981">Evals · Observability · Audit</Kicker>
        <H size={70}>Test it. Watch it. Prove it.</H>
        <div className="mt-12 grid grid-cols-3 gap-6">
          {[
            ["🧪", "Evals", "Exams before every release: accuracy, safety, tone. Labelled by your own doctors.", "#a855f7"],
            ["📹", "Observability", "CCTV for AI: every step's time, cost and outcome on a dashboard.", "#22d3ee"],
            ["🔗", "Audit trail", "Hash-chained register: change one record and the whole chain breaks.", "#10b981"],
          ].map(([e, t, d, c]) => (
            <Card key={t} color={c}>
              <div className="text-[72px]">{e}</div>
              <div className="mt-2 text-[40px] font-extrabold" style={{ color: c }}>
                {t}
              </div>
              <p className="mt-3 text-[26px] text-white/75">{d}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center text-[30px] font-bold">
          🕵️ Live: <Y>be the fraudster</Y> and try to edit the audit log
        </div>
      </div>
    ),
  },
  {
    id: "carebot",
    section: "Ask CareBot",
    live: { href: "/assistant", label: "CareBot" },
    notes: "Take questions from the audience and type them in. Point to the right panel: Guardian, Router, Librarian, Thinker, Checker light up one by one. Try the cricket question (refused) and the 'ignore your rules' question (blocked).",
    render: () => (
      <div className="flex h-full items-center gap-14">
        <div className="flex-1">
          <Kicker color="#06b6d4">Your turn</Kicker>
          <H size={84}>
            Ask CareBot.
            <br />
            <Grad>Watch it think.</Grad>
          </H>
          <Sub>Every question passes through 5 mini-agents. You see each one light up, live.</Sub>
        </div>
        <div className="w-[540px] space-y-3">
          {[
            ["🛡️", "Guardian", "hides private data, catches tricks", "#f43f5e"],
            ["🧭", "Router", "on-topic? healthcare only", "#8b5cf6"],
            ["📚", "Librarian", "finds the right pages (RAG)", "#f59e0b"],
            ["🧠", "Thinker", "writes a cited answer (Groq)", "#06b6d4"],
            ["✅", "Checker", "no diagnosis, no leaks", "#10b981"],
          ].map(([e, t, d, c]) => (
            <div key={t} className="flex items-center gap-5 rounded-2xl border-2 p-4" style={{ borderColor: `${c}77`, background: `${c}18` }}>
              <span className="grid h-16 w-16 place-items-center rounded-full text-[34px]" style={{ background: `${c}44` }}>
                {e}
              </span>
              <div>
                <div className="text-[30px] font-extrabold" style={{ color: c }}>
                  {t}
                </div>
                <div className="text-[22px] text-white/70">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "industries",
    section: "Beyond healthcare",
    live: { href: "/", label: "Industries" },
    notes: "Healthcare was the example. The pattern is universal: guard the input, orchestrate, specialists use your tools, a human approves the risky part, act and record. Ask: which of these looks like your business?",
    render: () => (
      <div>
        <Kicker color="#22c55e">Not just hospitals</Kicker>
        <H size={70}>
          The <Grad>same pattern</Grad> works in your industry
        </H>
        <div className="mt-10 grid grid-cols-3 gap-5">
          {[
            ["Factory", "Manufacturing", "PO → stock check → machine schedule → delay alert", "#f59e0b"],
            ["Shirt", "Textiles", "Buyer spec → fabric match → quote → export docs", "#ec4899"],
            ["Store", "Retail", "Predict stock-outs → reorder → WhatsApp distributor", "#10b981"],
            ["Truck", "Logistics", "Route plan → ETA updates → POD & e-way bill", "#0ea5e9"],
            ["Landmark", "CA & finance", "Collect invoices → GST reconcile → client reminder", "#8b5cf6"],
            ["Wheat", "Food processing", "Batch quality → expiry → FSSAI records", "#f97316"],
          ].map(([ic, t, d, c]) => (
            <Card key={t} color={c} className="!p-6">
              <div className="flex items-center gap-4">
                <Icon name={ic} className="h-11 w-11" style={{ color: c }} />
                <div className="text-[32px] font-extrabold">{t}</div>
              </div>
              <p className="mt-3 text-[23px] text-white/75">{d}</p>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "take",
    section: "Take home",
    live: { href: "/takeaways", label: "Take home" },
    notes: "Seven things to remember tomorrow morning. Then let them try the readiness self-check and ROI calculator on the live page. That's the part people photograph.",
    render: () => (
      <div>
        <Kicker color="#22c55e">Take home</Kicker>
        <H size={66}>7 things to remember tomorrow morning</H>
        <div className="mt-9 grid grid-cols-2 gap-x-10 gap-y-4">
          {[
            ["🤖", "Agents do work, not just talk"],
            ["🎯", "Start with a boring, painful process"],
            ["📚", "Your documents are your moat (RAG)"],
            ["🔌", "Connect once, reuse forever (MCP)"],
            ["🎼", "A team beats a genius (orchestration)"],
            ["👩‍⚕️", "Humans stay in charge of risk"],
            ["🛡️", "Trust is built, measured & logged"],
          ].map(([e, t], i) => (
            <div key={t} className="flex items-center gap-5 rounded-2xl bg-white/[.05] px-6 py-4">
              <span className="font-mono text-[26px] font-black" style={{ color: BRAND.yellow }}>
                {i + 1}
              </span>
              <span className="text-[38px]">{e}</span>
              <span className="text-[29px] font-bold">{t}</span>
            </div>
          ))}
          <div className="flex items-center rounded-2xl px-6 py-4 text-[28px] font-black text-black" style={{ background: BRAND.yellow }}>
            AI does the work. Guardrails keep it safe. You stay in charge.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "plan",
    section: "Take home",
    live: { href: "/takeaways", label: "Readiness & ROI" },
    notes: "Start small, prove it, then scale. 90 days is enough to know if it works for your business. Point to the readiness check and ROI calculator.",
    render: () => (
      <div>
        <Kicker color="#22c55e">Your next 90 days</Kicker>
        <H>Start small. Prove it. Then scale.</H>
        <div className="mt-12 grid grid-cols-3 gap-6">
          {[
            ["Days 1–30", "Discover", ["Pick ONE workflow", "Measure today's time & cost", "Write the SOP & approval rules"], "#22d3ee"],
            ["Days 31–60", "Pilot", ["2–3 agents + 2 tools", "Human approves 100%", "Weekly evals"], "#a78bfa"],
            ["Days 61–90", "Scale", ["Compare vs baseline", "Relax approval where proven", "Pick the next workflow"], "#22c55e"],
          ].map(([p, t, items, c], i) => (
            <Card key={p as string} color={c as string}>
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-2xl text-[32px] font-black text-black" style={{ background: c as string }}>
                  {i + 1}
                </span>
                <div>
                  <div className="font-mono text-[22px]" style={{ color: c as string }}>
                    {p}
                  </div>
                  <div className="text-[40px] font-extrabold">{t}</div>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {(items as string[]).map((x) => (
                  <li key={x} className="text-[27px] text-white/85">
                    ✔ {x}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "quote",
    section: "Closing",
    notes: "Pause. Let it land.",
    render: () => (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="text-[110px]">💡</div>
        <blockquote className="mt-8 text-[86px] font-black leading-[1.08]">
          AI won&apos;t replace MSMEs.
          <br />
          <Grad>MSMEs that use AI agents wisely</Grad>
          <br />
          will outpace those that don&apos;t.
        </blockquote>
      </div>
    ),
  },
  {
    id: "thanks",
    section: "Closing",
    live: { href: "/assistant", label: "Q&A with CareBot" },
    notes: "Thank you. Open for questions. Keep CareBot open on the side to answer live.",
    render: () => (
      <div className="flex h-full items-center gap-20">
        <Image src="/brand/srinivasan-ramanujam.jpg" alt={SPEAKER.name} width={440} height={440} className="h-[440px] w-[440px] rounded-full border-[6px] object-cover" style={{ borderColor: BRAND.yellow, boxShadow: `0 0 90px ${BRAND.yellow}55` }} />
        <div>
          <div className="text-[110px] font-black leading-none">
            Thank you <span className="inline-block">🙏</span>
          </div>
          <div className="mt-4 text-[44px] font-bold text-white/70">Questions?</div>
          <div className="mt-12 text-[46px] font-extrabold">{SPEAKER.name}</div>
          <div className="text-[28px] text-white/60">{SPEAKER.role}</div>
          <div className="mt-6 space-y-2 text-[30px]">
            <div>✉️ {SPEAKER.email}</div>
            <div>🌐 {SPEAKER.web}</div>
          </div>
          <Image src="/brand/oneyoto-logo.png" alt="OneYoto" width={260} height={108} className="mt-10 h-auto w-[230px]" />
          <div className="mt-3 text-[22px] font-bold uppercase tracking-[.35em]" style={{ color: BRAND.yellow }}>
            {SPEAKER.tagline}
          </div>
        </div>
      </div>
    ),
  },
];
