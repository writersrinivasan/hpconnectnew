import type { AgentId } from "./agents";
import type { GuardStatus } from "./guardrails";
import type { RagHit } from "./rag";

export interface AuditEntry {
  seq: number;
  ts: string;
  actor: string;
  action: string;
  detail: string;
  prevHash: string;
  hash: string;
}

export interface EvalResult {
  name: string;
  score: number; // 0..1
  pass: boolean;
  detail: string;
}

export interface InterruptPayload {
  severity: string;
  patient: string;
  summary: string[];
  proposed: string[];
  citations: string[];
}

export type RunEvent =
  | { type: "run_start"; runId: string; threadId: string; mode: "simulated" | "claude"; ts: number }
  | { type: "node_start"; node: AgentId; ts: number; spanId: string }
  | { type: "node_end"; node: AgentId; ts: number; spanId: string; startTs: number; durationMs: number; tokensIn: number; tokensOut: number; costUsd: number; summary: string }
  | { type: "message"; node: AgentId; text: string; tone?: "info" | "warn" | "success" | "danger"; ts: number }
  | { type: "rag"; node: AgentId; query: string; hits: RagHit[]; ts: number }
  | { type: "mcp"; node: AgentId; server: string; tool: string; request: unknown; response: unknown; latencyMs: number; ts: number }
  | { type: "guardrail"; node: AgentId; check: string; status: GuardStatus; detail: string; ts: number }
  | { type: "audit"; entry: AuditEntry }
  | { type: "interrupt"; threadId: string; payload: InterruptPayload; ts: number }
  | { type: "outbound"; language: string; text: string; ts: number }
  | { type: "final"; ts: number; outcome: "completed" | "blocked" | "escalated"; evals: EvalResult[]; totals: { durationMs: number; tokens: number; costUsd: number; toolCalls: number; agents: number } }
  | { type: "error"; message: string };
