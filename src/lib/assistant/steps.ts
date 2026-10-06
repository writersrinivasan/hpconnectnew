// Shared (client + server) definition of the assistant's workflow stations.

export type StepId = "guard" | "router" | "retrieve" | "think" | "check";
export type StepStatus = "idle" | "active" | "done" | "warn" | "blocked" | "skipped";

export interface StepMeta {
  id: StepId;
  emoji: string;
  name: string;
  what: string;
  color: string;
  tech: string;
}

export const STEPS: StepMeta[] = [
  { id: "guard", emoji: "🛡️", name: "Guardian", what: "Hides private data & catches hacking tricks", color: "#f43f5e", tech: "Rules + Llama Prompt Guard 2" },
  { id: "router", emoji: "🧭", name: "Router", what: "Understands the question & checks it's about our clinic", color: "#8b5cf6", tech: "gpt-oss-20b on Groq" },
  { id: "retrieve", emoji: "📚", name: "Librarian", what: "Finds the right pages in clinic documents (RAG)", color: "#f59e0b", tech: "BM25 over 27 docs" },
  { id: "think", emoji: "🧠", name: "Thinker", what: "Writes the answer only from those pages", color: "#06b6d4", tech: "gpt-oss-120b on Groq" },
  { id: "check", emoji: "✅", name: "Checker", what: "No diagnosis, no leaks, sources cited", color: "#10b981", tech: "Output guardrails" },
];

export type AsstEvent =
  | { type: "step"; id: StepId; status: StepStatus; detail?: string; chips?: string[]; ms?: number }
  | { type: "sources"; hits: { id: string; title: string; score: number; category: string }[] }
  | { type: "token"; text: string }
  | { type: "done"; model: string; tokens: number; ms: number; topic: string }
  | { type: "error"; message: string };
