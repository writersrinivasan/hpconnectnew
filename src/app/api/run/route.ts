import { Command } from "@langchain/langgraph";
import { appendAudit, getChain, seedChain } from "@/lib/audit";
import type { RunEvent } from "@/lib/events";
import { evaluate, graph, type GraphState } from "@/lib/graph";
import { LLM_ENABLED } from "@/lib/llm";
import { openSnapshot, sealSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

type Body =
  | { action: "start"; message: string; scenarioId?: string; speed?: number }
  | { action: "resume"; threadId: string; approved: boolean; note?: string; snapshot?: string };

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (e: RunEvent) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(e)}\n\n`));
      try {
        let threadId: string;
        let input: unknown;
        if (body.action === "start") {
          const message = String(body.message ?? "").slice(0, 2000);
          threadId = `thr_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
          send({ type: "run_start", runId: threadId, threadId, mode: LLM_ENABLED ? "claude" : "simulated", ts: Date.now() });
          send({ type: "audit", entry: appendAudit(threadId, "WhatsApp Gateway", "REQUEST_RECEIVED", `channel=whatsapp; chars=${message.length}`) });
          input = { request: message, scenarioId: body.scenarioId ?? "custom", speed: Math.min(2, Math.max(0.2, body.speed ?? 1)), startedAt: Date.now() };
        } else {
          threadId = body.threadId;
          const cfg = { configurable: { thread_id: threadId } };
          const existing = await graph.getState(cfg);
          if (!existing.next?.length) {
            // Cold serverless instance: rebuild the paused graph from the signed snapshot.
            if (!body.snapshot) throw new Error("This run is no longer active. Please run the scenario again.");
            const snap = openSnapshot(body.snapshot, threadId);
            seedChain(threadId, snap.audit);
            await graph.updateState(cfg, snap.values, "care_coordinator");
            for await (const _ of await graph.stream(null, { ...cfg, streamMode: "updates" })) void _; // re-enter human_review → interrupt
          }
          input = new Command({ resume: { approved: body.approved, note: body.note } });
        }

        const config = { configurable: { thread_id: threadId }, streamMode: ["custom", "updates"] as ("custom" | "updates")[] };
        const it = await graph.stream(input as never, config);
        for await (const chunk of it as AsyncIterable<[string, unknown]>) {
          const [mode, data] = chunk;
          if (mode === "custom") send(data as RunEvent);
          if (mode === "updates" && data && typeof data === "object" && "__interrupt__" in data) {
            const intr = (data as { __interrupt__: { value: unknown }[] }).__interrupt__[0];
            send({ type: "node_start", node: "human_review", ts: Date.now(), spanId: "hitl" });
            const paused = await graph.getState({ configurable: { thread_id: threadId } });
            const snapshot = sealSnapshot({ threadId, values: paused.values as Record<string, unknown>, audit: getChain(threadId) });
            send({ type: "interrupt", threadId, payload: intr.value as never, ts: Date.now(), snapshot });
          }
        }

        const snap = await graph.getState({ configurable: { thread_id: threadId } });
        if (!snap.next.length) {
          const s = snap.values as GraphState;
          send({
            type: "final",
            ts: Date.now(),
            outcome: s.blocked ? "blocked" : s.approval && !s.approval.approved ? "escalated" : "completed",
            evals: evaluate(s, threadId),
            totals: { durationMs: Date.now() - s.startedAt, tokens: s.metrics.tokens, costUsd: s.metrics.costUsd, toolCalls: s.metrics.toolCalls, agents: s.metrics.agents },
          });
        }
      } catch (err) {
        send({ type: "error", message: err instanceof Error ? err.message : String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" },
  });
}
