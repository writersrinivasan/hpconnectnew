import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import McpExplainer from "@/components/concepts/McpExplainer";
import OrchestrationExplainer from "@/components/concepts/OrchestrationExplainer";
import RagExplainer from "@/components/concepts/RagExplainer";
import { PageHero, SectionHead } from "@/components/ui";

export const metadata: Metadata = { title: "RAG · MCP · Orchestration · CareAgents" };

const COMPARE = [
  ["Who does the work?", "You do, with help", "Follows a fixed script", "The agents do; you approve"],
  ["Handles new situations?", "Answers only", "Breaks if anything changes", "Plans & adapts"],
  ["Uses your systems?", "No: copy-paste", "Only pre-wired steps", "Yes, via MCP tools"],
  ["Knows your rules?", "Generic internet knowledge", "Hard-coded", "Reads your documents (RAG)"],
  ["Safe & auditable?", "Hard to track", "Yes but rigid", "Guardrails + audit trail + evals"],
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Chapter 02 · The building blocks"
        color="#f59e0b"
        title={
          <>
            3 ideas that make agents <span className="grad-text">actually useful</span>
          </>
        }
        sub="Knowledge (RAG) · Hands (MCP) · Teamwork (Orchestration). No coding knowledge needed: if you can run a shop floor, you already understand these."
      />
      <div className="sticky top-[61px] z-40 mx-auto mb-6 flex max-w-fit gap-1 rounded-full border border-line bg-bg/80 p-1.5 backdrop-blur-xl">
        {[
          ["#rag", "📚 RAG", "#f59e0b"],
          ["#mcp", "🔌 MCP", "#38bdf8"],
          ["#orch", "🎼 Orchestration", "#a78bfa"],
          ["#compare", "⚖️ Chatbot vs Agent", "#34d399"],
        ].map(([h, l, c]) => (
          <a key={h} href={h} className="rounded-full px-4 py-2 text-sm font-bold hover:bg-white/10" style={{ color: c }}>
            {l}
          </a>
        ))}
      </div>

      <section id="rag" className="mx-auto max-w-[1300px] scroll-mt-32 px-4 py-14 md:px-6">
        <SectionHead eyebrow="RAG · Retrieval-Augmented Generation" color="#f59e0b" title={<>Give the AI <span className="text-amber-300">your</span> rulebook</>} sub="The agent's knowledge: it looks things up in your own documents before it answers." />
        <RagExplainer />
      </section>

      <section id="mcp" className="mx-auto max-w-[1300px] scroll-mt-32 px-4 py-14 md:px-6">
        <SectionHead eyebrow="MCP · Model Context Protocol" color="#38bdf8" title={<>Give the AI <span className="text-sky-300">hands</span>, safely</>} sub="The agent's hands: one standard way for any AI to use any of your business software." />
        <McpExplainer />
      </section>

      <section id="orch" className="mx-auto max-w-[1300px] scroll-mt-32 px-4 py-14 md:px-6">
        <SectionHead eyebrow="AI Orchestration · LangGraph" color="#a78bfa" title={<>Turn single agents into a <span className="text-violet-300">team</span></>} sub="The manager: who works when, who works in parallel, and when to stop and ask a human. Click a pattern." />
        <OrchestrationExplainer />
      </section>

      <section id="compare" className="mx-auto max-w-[1100px] scroll-mt-32 px-4 py-14 md:px-6">
        <SectionHead eyebrow="Clearing the confusion" color="#34d399" title="Chatbot vs Automation vs Agent" />
        <div className="glass overflow-x-auto rounded-3xl">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-line text-sm uppercase tracking-wider">
                <th className="p-4 text-muted" />
                <th className="p-4 text-sky-300">💬 Chatbot</th>
                <th className="p-4 text-slate-300">⚙️ RPA / Automation</th>
                <th className="p-4 text-emerald-300">🤖 AI Agents</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r[0]} className="border-b border-white/5 text-[15px]">
                  <td className="p-4 font-bold">{r[0]}</td>
                  <td className="p-4 text-white/70">{r[1]}</td>
                  <td className="p-4 text-white/70">{r[2]}</td>
                  <td className="p-4 font-semibold text-emerald-200">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-10 text-center">
          <Link href="/live" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-7 py-4 text-lg font-extrabold shadow-xl shadow-violet-500/30">
            Now see all three working together, live <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
