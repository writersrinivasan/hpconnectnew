// Shared (client + server) metadata for every node in the LangGraph workflow.
// "human" is the plain-language analogy shown to a non-technical audience.

export type AgentId =
  | "input_guardrail"
  | "supervisor"
  | "triage_agent"
  | "records_agent"
  | "pharmacy_agent"
  | "care_coordinator"
  | "human_review"
  | "output_guardrail"
  | "communicator"
  | "blocked_response";

export interface AgentMeta {
  id: AgentId;
  name: string;
  short: string;
  icon: string; // lucide icon name, resolved in components/Icon.tsx
  color: string;
  role: string;
  human: string;
  narration: string;
  uses: string[];
}

export const AGENTS: Record<AgentId, AgentMeta> = {
  input_guardrail: {
    id: "input_guardrail",
    name: "Guardian Agent",
    short: "Guardian",
    icon: "ShieldCheck",
    color: "#f43f5e",
    role: "Checks every incoming message for private data, hacking attempts and off-topic requests.",
    human: "Security guard at the clinic gate",
    narration: "The Guardian checks the message first: it hides private data and looks for hacking tricks, like a security guard at the gate.",
    uses: ["Guardrails", "PII masking", "Prompt-injection filter"],
  },
  supervisor: {
    id: "supervisor",
    name: "Orchestrator",
    short: "Orchestrator",
    icon: "Network",
    color: "#8b5cf6",
    role: "Understands what the patient needs and decides which specialist agents should work, and in what order.",
    human: "Head nurse / clinic manager",
    narration: "The Orchestrator reads the request, splits it into jobs and assigns them to specialist agents, the way a head nurse runs the morning.",
    uses: ["LangGraph routing", "Planning", "Parallel fan-out"],
  },
  triage_agent: {
    id: "triage_agent",
    name: "Triage Agent",
    short: "Triage",
    icon: "HeartPulse",
    color: "#f59e0b",
    role: "Judges how urgent the case is using the clinic's own medical protocols (RAG).",
    human: "Experienced triage nurse",
    narration: "The Triage Agent looks up the clinic's own protocols (RAG) and decides how urgent this is. Every decision cites the page it came from.",
    uses: ["RAG", "Clinical protocols", "Citations"],
  },
  records_agent: {
    id: "records_agent",
    name: "Records Agent",
    short: "Records",
    icon: "FileHeart",
    color: "#0ea5e9",
    role: "Pulls the patient's history, allergies and last lab results from the hospital system through MCP.",
    human: "Medical records clerk",
    narration: "At the same time, the Records Agent fetches the patient's history from the hospital system through MCP, the 'USB-C port' for AI.",
    uses: ["MCP → EHR server", "Minimum-necessary data"],
  },
  pharmacy_agent: {
    id: "pharmacy_agent",
    name: "Pharmacy Agent",
    short: "Pharmacy",
    icon: "Pill",
    color: "#10b981",
    role: "Checks medicine stock, refill rules and drug interactions.",
    human: "Pharmacist",
    narration: "Also in parallel, the Pharmacy Agent checks stock, refill rules and dangerous drug interactions.",
    uses: ["MCP → Pharmacy server", "RAG → Formulary"],
  },
  care_coordinator: {
    id: "care_coordinator",
    name: "Care Coordinator",
    short: "Coordinator",
    icon: "CalendarCheck",
    color: "#6366f1",
    role: "Combines all findings, books the right doctor slot and checks insurance coverage.",
    human: "Front-desk coordinator + insurance desk",
    narration: "The Care Coordinator combines everything, holds the right doctor's slot and checks insurance, all through MCP tools.",
    uses: ["MCP → Calendar", "MCP → Insurance", "State merge"],
  },
  human_review: {
    id: "human_review",
    name: "Doctor Approval",
    short: "Doctor ✓",
    icon: "Stethoscope",
    color: "#ec4899",
    role: "Human-in-the-loop: a doctor approves high-risk decisions before anything reaches the patient.",
    human: "The doctor stays in charge",
    narration: "This is high-risk, so the system PAUSES and asks the doctor. AI prepares, the human decides.",
    uses: ["Human-in-the-loop", "LangGraph interrupt()", "Checkpointing"],
  },
  output_guardrail: {
    id: "output_guardrail",
    name: "Compliance Agent",
    short: "Compliance",
    icon: "ScanSearch",
    color: "#f97316",
    role: "Checks the final reply: no leaked private data, no made-up facts, emergency number included, policy followed.",
    human: "Quality & compliance officer",
    narration: "Before anything goes out, the Compliance Agent checks the reply for leaks, made-up facts and policy violations.",
    uses: ["Output guardrails", "Groundedness check", "Policy rules"],
  },
  communicator: {
    id: "communicator",
    name: "Patient Messenger",
    short: "Messenger",
    icon: "MessageCircleHeart",
    color: "#06b6d4",
    role: "Sends a clear, kind message in the patient's own language on WhatsApp.",
    human: "Friendly receptionist",
    narration: "Finally the Messenger sends a clear WhatsApp message in the patient's own language. Done.",
    uses: ["MCP → WhatsApp", "Multilingual"],
  },
  blocked_response: {
    id: "blocked_response",
    name: "Threat Blocked",
    short: "Blocked",
    icon: "ShieldAlert",
    color: "#ef4444",
    role: "Stops malicious requests, alerts the security team and logs the incident.",
    human: "Alarm + incident register",
    narration: "Attack detected! The request is stopped before it reaches any agent or patient data, and the incident is logged.",
    uses: ["Incident response", "Security alert"],
  },
};

export const MAIN_FLOW: AgentId[] = [
  "input_guardrail",
  "supervisor",
  "triage_agent",
  "records_agent",
  "pharmacy_agent",
  "care_coordinator",
  "human_review",
  "output_guardrail",
  "communicator",
];
