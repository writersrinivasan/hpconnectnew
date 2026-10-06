"use client";

import { useCallback, useRef, useState } from "react";
import type { AgentId } from "@/lib/agents";
import type { AuditEntry, EvalResult, InterruptPayload, RunEvent } from "@/lib/events";

export type NodeStatus = "idle" | "active" | "done" | "waiting" | "blocked";
export type GraphNodeId = AgentId | "patient_in" | "patient_out";

export const EDGES: [GraphNodeId, GraphNodeId][] = [
  ["patient_in", "input_guardrail"],
  ["input_guardrail", "supervisor"],
  ["input_guardrail", "blocked_response"],
  ["supervisor", "triage_agent"],
  ["supervisor", "records_agent"],
  ["supervisor", "pharmacy_agent"],
  ["triage_agent", "care_coordinator"],
  ["records_agent", "care_coordinator"],
  ["pharmacy_agent", "care_coordinator"],
  ["care_coordinator", "human_review"],
  ["care_coordinator", "output_guardrail"],
  ["human_review", "output_guardrail"],
  ["output_guardrail", "communicator"],
  ["communicator", "patient_out"],
];

type Ev<T extends RunEvent["type"]> = Extract<RunEvent, { type: T }>;

export interface RunState {
  status: "idle" | "running" | "waiting" | "done" | "error";
  threadId?: string;
  mode?: "simulated" | "claude";
  startTs?: number;
  nodes: Partial<Record<GraphNodeId, NodeStatus>>;
  lit: string[];
  current?: AgentId;
  messages: Ev<"message">[];
  rag: Ev<"rag">[];
  mcp: Ev<"mcp">[];
  guards: Ev<"guardrail">[];
  audit: AuditEntry[];
  spans: Ev<"node_end">[];
  waits: { start: number; end?: number }[];
  toolPulse: Record<string, number>;
  nodeTool: Partial<Record<AgentId, string>>;
  interrupt?: InterruptPayload;
  outbound?: Ev<"outbound">;
  final?: { outcome: string; evals: EvalResult[]; totals: Ev<"final">["totals"] };
  error?: string;
}

const initial: RunState = { status: "idle", nodes: {}, lit: [], messages: [], rag: [], mcp: [], guards: [], audit: [], spans: [], waits: [], toolPulse: {}, nodeTool: {} };

function reduce(s: RunState, e: RunEvent): RunState {
  switch (e.type) {
    case "run_start":
      return { ...initial, status: "running", threadId: e.threadId, mode: e.mode, startTs: e.ts, nodes: { patient_in: "done" } };
    case "node_start": {
      const nodes = { ...s.nodes, [e.node]: e.node === "human_review" ? "waiting" : "active" } as RunState["nodes"];
      const lit = [...s.lit];
      for (const [a, b] of EDGES) if (b === e.node && nodes[a] === "done" && !lit.includes(`${a}>${b}`)) lit.push(`${a}>${b}`);
      return { ...s, nodes, lit, current: e.node };
    }
    case "node_end": {
      const nodes = { ...s.nodes, [e.node]: e.node === "blocked_response" ? "blocked" : "done" } as RunState["nodes"];
      const lit = [...s.lit];
      if (e.node === "communicator") {
        nodes.patient_out = "done";
        lit.push("communicator>patient_out");
      }
      if (e.node === "input_guardrail" && s.guards.some((g) => g.status === "block")) nodes.input_guardrail = "blocked";
      const waits = e.node === "human_review" ? s.waits.map((w) => (w.end ? w : { ...w, end: e.startTs })) : s.waits;
      return { ...s, nodes, lit, spans: [...s.spans, e], waits };
    }
    case "message":
      return { ...s, messages: [...s.messages, e] };
    case "rag":
      return { ...s, rag: [...s.rag, e], toolPulse: { ...s.toolPulse, kb: Date.now() }, nodeTool: { ...s.nodeTool, [e.node]: "RAG · knowledge base" } };
    case "mcp":
      return { ...s, mcp: [...s.mcp, e], toolPulse: { ...s.toolPulse, [e.server]: Date.now() }, nodeTool: { ...s.nodeTool, [e.node]: `MCP · ${e.server}/${e.tool}` } };
    case "guardrail":
      return { ...s, guards: [...s.guards, e] };
    case "audit":
      return { ...s, audit: [...s.audit, e.entry] };
    case "interrupt":
      return { ...s, status: "waiting", interrupt: e.payload, waits: [...s.waits, { start: e.ts }] };
    case "outbound":
      return { ...s, outbound: e };
    case "final":
      return { ...s, status: "done", final: { outcome: e.outcome, evals: e.evals, totals: e.totals }, current: undefined };
    case "error":
      return { ...s, status: "error", error: e.message };
  }
}

export function useRunner() {
  const [state, setState] = useState<RunState>(initial);
  const busy = useRef(false);

  const consume = useCallback(async (body: unknown) => {
    busy.current = true;
    try {
      const res = await fetch("/api/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const p of parts) {
          const line = p.trim();
          if (!line.startsWith("data:")) continue;
          const ev = JSON.parse(line.slice(5)) as RunEvent;
          setState((s) => reduce(s, ev));
        }
      }
    } catch (err) {
      setState((s) => ({ ...s, status: "error", error: String(err) }));
    } finally {
      busy.current = false;
    }
  }, []);

  const start = useCallback(
    (message: string, scenarioId: string, speed: number) => {
      if (busy.current) return;
      setState({ ...initial, status: "running" });
      void consume({ action: "start", message, scenarioId, speed });
    },
    [consume],
  );

  const resume = useCallback(
    (approved: boolean, note?: string) => {
      if (busy.current || !state.threadId) return;
      setState((s) => ({ ...s, status: "running", interrupt: undefined }));
      void consume({ action: "resume", threadId: state.threadId, approved, note });
    },
    [consume, state.threadId],
  );

  const reset = useCallback(() => {
    if (!busy.current) setState(initial);
  }, []);

  return { state, start, resume, reset };
}
