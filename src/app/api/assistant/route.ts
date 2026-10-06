import { assistantGraph, TOPIC_LABEL } from "@/lib/assistant/graph";
import type { ChatMsg } from "@/lib/assistant/groq";
import type { AsstEvent } from "@/lib/assistant/steps";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Simple in-memory rate limit (per IP): protects the Groq budget ("denial of wallet").
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 20;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const { question, history } = (await req.json()) as { question: string; history?: ChatMsg[] };
  const q = String(question ?? "").trim().slice(0, 1000);
  const hist = (history ?? [])
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-6)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 1500) }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (e: AsstEvent) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(e)}\n\n`));
      const t0 = Date.now();
      try {
        if (!q) throw new Error("Empty question");
        if (limited(ip)) throw new Error("Too many questions in a minute. Please wait a moment 🙏");
        const it = await assistantGraph.stream({ question: q, history: hist }, { streamMode: ["custom", "values"] });
        let last: { tokens?: number; model?: string; topic?: keyof typeof TOPIC_LABEL } = {};
        for await (const [mode, data] of it as AsyncIterable<[string, unknown]>) {
          if (mode === "custom") send(data as AsstEvent);
          else last = data as typeof last;
        }
        send({ type: "done", model: last.model ?? "", tokens: last.tokens ?? 0, ms: Date.now() - t0, topic: last.topic ? TOPIC_LABEL[last.topic] : "" });
      } catch (err) {
        send({ type: "error", message: err instanceof Error ? err.message : String(err) });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform" } });
}
