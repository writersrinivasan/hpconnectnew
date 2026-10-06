// Minimal Groq client (OpenAI-compatible API). Server-only: the key never reaches the browser.

const BASE = "https://api.groq.com/openai/v1/chat/completions";

export const GROQ_MODELS = {
  answer: process.env.GROQ_MODEL ?? "openai/gpt-oss-120b",
  router: process.env.GROQ_ROUTER_MODEL ?? "openai/gpt-oss-20b",
  guard: process.env.GROQ_GUARD_MODEL ?? "meta-llama/llama-prompt-guard-2-86m",
};

export type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

function key() {
  const k = process.env.GROQ_API_KEY;
  if (!k) throw new Error("GROQ_API_KEY is not set in .env.local");
  return k;
}

async function post(body: Record<string, unknown>, signal?: AbortSignal) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res;
}

export async function groqJson<T>(model: string, messages: ChatMsg[]): Promise<{ data: T; tokens: number }> {
  const res = await post({ model, messages, response_format: { type: "json_object" }, reasoning_effort: "low", temperature: 0, max_tokens: 400 }, AbortSignal.timeout(10000));
  const d = await res.json();
  return { data: JSON.parse(d.choices[0].message.content) as T, tokens: d.usage?.total_tokens ?? 0 };
}

/** Probability (0..1) that the text is a prompt-injection / jailbreak attempt. */
export async function promptGuardScore(text: string): Promise<number> {
  const res = await post({ model: GROQ_MODELS.guard, messages: [{ role: "user", content: text }] }, AbortSignal.timeout(6000));
  const d = await res.json();
  return Number.parseFloat(d.choices[0].message.content) || 0;
}

export async function groqStream(model: string, messages: ChatMsg[], onToken: (t: string) => void): Promise<{ text: string; tokens: number }> {
  const res = await post({ model, messages, stream: true, reasoning_effort: "low", temperature: 0.3, max_tokens: 900 }, AbortSignal.timeout(45000));
  const reader = res.body!.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let text = "";
  let tokens = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") continue;
      const chunk = JSON.parse(payload);
      const delta: string | undefined = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        text += delta;
        onToken(delta);
      }
      tokens = chunk.x_groq?.usage?.total_tokens ?? chunk.usage?.total_tokens ?? tokens;
    }
  }
  return { text, tokens };
}
