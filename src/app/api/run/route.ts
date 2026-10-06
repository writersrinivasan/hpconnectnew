import { Command } from "@langchain/langgraph";
import { appendAudit } from "@/lib/audit";
import type { RunEvent } from "@/lib/events";
import { evaluate, graph, type GraphState } from "@/lib/graph";
import { LLM_ENABLED } from "@/lib/llm";

export const dynamic = "force-dynamic";

type Body =
  | { action: "start"; message: string; scenarioId?: string; speed?: number }
  | { action: "resume"; threadId: string; approved: boolean; note?: string };

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
            send({ type: "interrupt", threadId, payload: intr.value as never, ts: Date.now() });
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
