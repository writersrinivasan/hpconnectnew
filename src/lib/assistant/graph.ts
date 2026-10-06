import { Annotation, END, START, StateGraph, type LangGraphRunnableConfig } from "@langchain/langgraph";
import { checkInput } from "../guardrails";
import { createRetriever, KNOWLEDGE_BASE, type RagHit } from "../rag";
import { APP_GUIDE } from "./guide";
import { GROQ_MODELS, groqJson, groqStream, promptGuardScore, type ChatMsg } from "./groq";
import type { AsstEvent, StepId, StepStatus } from "./steps";

const search = createRetriever([...KNOWLEDGE_BASE, ...APP_GUIDE]);

const TOPICS = ["greeting", "clinical_protocol", "medicines", "appointments_insurance", "how_agents_work", "trust_safety", "architecture", "business_adoption", "demo_scenarios", "out_of_scope"] as const;
type Topic = (typeof TOPICS)[number];

const TOPIC_LABEL: Record<Topic, string> = {
  greeting: "👋 Greeting",
  clinical_protocol: "🩺 Clinical protocol",
  medicines: "💊 Medicines",
  appointments_insurance: "📅 Appointments & insurance",
  how_agents_work: "🤖 How agents work",
  trust_safety: "🛡️ Trust & safety",
  architecture: "🏗️ Architecture",
  business_adoption: "📈 Business adoption",
  demo_scenarios: "🎬 Demo scenarios",
  out_of_scope: "🚫 Out of scope",
};

const RED_FLAGS = /(chest pain|can'?t breathe|cannot breathe|unconscious|fainted|severe bleeding|stroke|heart attack|suicid)/i;

const State = Annotation.Root({
  question: Annotation<string>,
  history: Annotation<ChatMsg[]>,
  masked: Annotation<string>,
  blocked: Annotation<boolean>,
  emergency: Annotation<boolean>,
  topic: Annotation<Topic>,
  inScope: Annotation<boolean>,
  hits: Annotation<RagHit[]>({ reducer: (_a, b) => b, default: () => [] }),
  answer: Annotation<string>,
  tokens: Annotation<number>({ reducer: (a, b) => a + b, default: () => 0 }),
  model: Annotation<string>,
});
type S = typeof State.State;

export const normalizeCitations = (t: string) => t.replace(/[【［]/g, "[").replace(/[】］]/g, "]").replace(/[\u2010\u2011\u2012\u2013]/g, "-");

const pace = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function emitter(config: LangGraphRunnableConfig) {
  const emit = (e: AsstEvent) => config.writer?.(e);
  const step = (id: StepId, status: StepStatus, detail?: string, chips?: string[], ms?: number) => emit({ type: "step", id, status, detail, chips, ms });
  return { emit, step };
}

async function streamText(emit: (e: AsstEvent) => void, text: string) {
  for (const w of text.split(/(\s+)/)) {
    emit({ type: "token", text: w });
    await pace(14);
  }
}

// ── 1. Guardian ──
async function guard(s: S, config: LangGraphRunnableConfig) {
  const { step } = emitter(config);
  const t0 = Date.now();
  step("guard", "active", "Scanning your message before any AI sees it…");
  await pace(350);
  const rules = checkInput(s.question);
  let score = 0;
  try {
    score = await promptGuardScore(s.question);
  } catch {
    score = rules.blocked ? 1 : 0;
  }
  const injection = score > 0.5 || rules.checks.some((c) => c.check.startsWith("Prompt-injection") && c.status === "block");
  const emergency = RED_FLAGS.test(s.question);
  const chips = [rules.pii.length ? `🔒 ${rules.pii.length} private item(s) masked` : "🔒 No private data", `🧪 Attack score ${(score * 100).toFixed(score < 0.01 ? 2 : 0)}%`, emergency ? "🚨 Emergency words found" : "💚 No emergency words"];
  if (injection) {
    step("guard", "blocked", "Hacking attempt detected. Stopped at the gate!", chips, Date.now() - t0);
  } else {
    step("guard", rules.pii.length ? "warn" : "done", rules.pii.length ? "Private data hidden. The AI only sees the masked text." : "Message is safe to process.", chips, Date.now() - t0);
  }
  return { masked: rules.masked, blocked: injection, emergency };
}

// ── 2. Router ──
async function router(s: S, config: LangGraphRunnableConfig) {
  const { step } = emitter(config);
  const t0 = Date.now();
  step("router", "active", "Figuring out what you're asking…");
  let topic: Topic = "how_agents_work";
  let inScope = true;
  let tokens = 0;
  try {
    const r = await groqJson<{ in_scope: boolean; topic: Topic }>(GROQ_MODELS.router, [
      {
        role: "system",
        content: `You route questions for the assistant of a healthcare demo app (Sunrise Clinic + the "CareAgents" multi-agent AI system). IN SCOPE: the clinic's protocols, medicines, appointments, insurance, patient communication, healthcare operations; how the AI agents work (RAG, MCP, LangGraph orchestration, human-in-the-loop); guardrails, cyber security, governance, evals, observability, audit trails, architecture; how clinics/MSMEs should adopt AI agents in healthcare; the demo scenarios; greetings and questions about this assistant. OUT OF SCOPE: anything else (sports, politics, coding help unrelated to this app, general trivia, other industries without a healthcare angle). Return JSON {"in_scope": boolean, "topic": one of ${JSON.stringify(TOPICS)}}.`,
      },
      { role: "user", content: s.masked },
    ]);
    topic = TOPICS.includes(r.data.topic) ? r.data.topic : "how_agents_work";
    inScope = r.data.in_scope && topic !== "out_of_scope";
    tokens = r.tokens;
  } catch {
    inScope = !/(cricket|movie|stock tips|crypto|election|recipe|weather)/i.test(s.masked);
  }
  if (!inScope) topic = "out_of_scope";
  step("router", inScope ? "done" : "blocked", inScope ? `Topic: ${TOPIC_LABEL[topic]}` : "That's outside our healthcare module, so I won't guess.", [TOPIC_LABEL[topic], `⚡ ${GROQ_MODELS.router.split("/").pop()}`], Date.now() - t0);
  return { topic, inScope, tokens };
}

// ── 3. Librarian (RAG) ──
async function retrieve(s: S, config: LangGraphRunnableConfig) {
  const { step, emit } = emitter(config);
  const t0 = Date.now();
  step("retrieve", "active", "Searching 27 clinic & guide documents…");
  await pace(300);
  const lastUser = s.history.filter((m) => m.role === "user").slice(-1)[0]?.content ?? "";
  const hits = (s.topic === "greeting" ? search("what is careagents", 2) : search(`${s.masked} ${lastUser}`, 4)).filter((h) => h.score >= 0.3);
  emit({ type: "sources", hits: hits.map(({ id, title, score, category }) => ({ id, title, score, category })) });
  step("retrieve", hits.length ? "done" : "warn", hits.length ? `Found ${hits.length} relevant page(s).` : "No matching pages. I'll say so honestly.", hits.map((h) => `📄 ${h.id}`), Date.now() - t0);
  return { hits };
}

// ── 4. Thinker (LLM) ──
async function think(s: S, config: LangGraphRunnableConfig) {
  const { step, emit } = emitter(config);
  const t0 = Date.now();
  step("think", "active", `Writing the answer with ${GROQ_MODELS.answer.split("/").pop()} on Groq…`);
  const context = s.hits.map((h) => `[${h.id}] ${h.title}: ${h.snippet}`).join("\n\n") || "(no matching documents)";
  const system = `You are CareBot, the friendly assistant of the CareAgents healthcare demo for Sunrise Clinic. Your audience: MSME owners and clinic managers, not technical. Rules:
- Answer ONLY about the Sunrise Clinic healthcare module and the CareAgents AI system, using ONLY the CONTEXT below. If the context doesn't contain the answer, say you don't have that information in the clinic's documents.
- Cite sources inline with plain square brackets exactly like [CP-01] or [AG-04] after the sentence they support.
- Never give a diagnosis or personal medical advice; for symptoms, recommend seeing a doctor${s.emergency ? ". The user mentioned emergency symptoms: START your answer by telling them to call 108 immediately" : ""}.
- Use simple words and one everyday analogy when explaining technology. Be warm and upbeat; one or two emojis are fine.
- Format: short paragraphs or "- " bullet points, **bold** for key words. No tables, no headings. Max 170 words.
- Reply in the user's language.

CONTEXT:
${context}`;
  const messages: ChatMsg[] = [{ role: "system", content: system }, ...s.history.slice(-6), { role: "user", content: s.masked }];
  let first = 0;
  const { text, tokens } = await groqStream(GROQ_MODELS.answer, messages, (t) => {
    if (!first) {
      first = Date.now() - t0;
      step("think", "active", `First words after ${first} ms ⚡ Streaming…`);
    }
    emit({ type: "token", text: t });
  });
  step("think", "done", `Answer written in ${((Date.now() - t0) / 1000).toFixed(1)} s`, [`🧮 ${tokens} tokens`, `⚡ ${first} ms to first word`], Date.now() - t0);
  return { answer: text, tokens, model: GROQ_MODELS.answer };
}

// ── Refusal path (blocked or out of scope) ──
async function refuse(s: S, config: LangGraphRunnableConfig) {
  const { step, emit } = emitter(config);
  const skipped: StepId[] = s.blocked ? ["router", "retrieve", "think"] : ["retrieve", "think"];
  for (const id of skipped) step(id, "skipped", "Skipped: nothing unsafe or off-topic reaches the AI model.");
  const text = s.blocked
    ? "🛑 **I can't help with that.** It looks like an attempt to override my safety rules or pull out private data. This has been logged.\n\nI'm happy to explain **how our guardrails stop attacks like this** [AG-07], if you're curious!"
    : `🙂 I'm CareBot and I only answer questions about the **Sunrise Clinic healthcare module** and how its **AI agents** work.\n\nTry asking:\n- Why was Mrs. Lakshmi sent to cardiology?\n- What is MCP, in simple words?\n- How should a small clinic start with AI agents?`;
  await streamText(emit, text);
  return { answer: text, model: "template" };
}

// ── 5. Checker ──
async function check(s: S, config: LangGraphRunnableConfig) {
  const { step } = emitter(config);
  const t0 = Date.now();
  step("check", "active", "Double-checking the answer…");
  await pace(350);
  const a = normalizeCitations(s.answer);
  const leaked = /\b\d{4}\s?\d{4}\s?\d{4}\b|\b[6-9]\d{4}[\s-]?\d{5}\b|[\w.+-]+@[\w-]+\.[\w.]+/.test(a);
  const diagnosis = /\byou (have|are suffering from|are diagnosed with|('| a)re having) (a |an )?(heart attack|angina|cancer|dengue|stroke|infection|heart disease|kidney disease)\b/i.test(a);
  const cited = s.hits.length === 0 || /\[(CP|RX|INS|POL|OPS|AG)-\d+\]/.test(a);
  const emergencyOk = !s.emergency || a.includes("108");
  const ok = !leaked && !diagnosis && cited && emergencyOk;
  const chips = [leaked ? "⚠️ Private data in answer" : "🔒 No private data", diagnosis ? "⚠️ Sounds like a diagnosis" : "🩺 No diagnosis", cited ? "📎 Sources cited" : "⚠️ Missing citations"];
  if (s.emergency) chips.push(emergencyOk ? "🚑 108 advice present" : "⚠️ 108 missing");
  step("check", ok ? "done" : "warn", ok ? "All checks passed. Safe to show!" : "Some checks raised warnings, logged for review.", chips, Date.now() - t0);
  return {};
}

export const assistantGraph = new StateGraph(State)
  .addNode("guard", guard)
  .addNode("router", router)
  .addNode("retrieve", retrieve)
  .addNode("think", think)
  .addNode("refuse", refuse)
  .addNode("check", check)
  .addEdge(START, "guard")
  .addConditionalEdges("guard", (s) => (s.blocked ? "refuse" : "router"), ["refuse", "router"])
  .addConditionalEdges("router", (s) => (s.inScope ? "retrieve" : "refuse"), ["retrieve", "refuse"])
  .addEdge("retrieve", "think")
  .addEdge("think", "check")
  .addEdge("refuse", "check")
  .addEdge("check", END)
  .compile();

export { TOPIC_LABEL };
