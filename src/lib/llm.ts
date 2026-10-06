import { ChatAnthropic } from "@langchain/anthropic";

// Optional live LLM. Without ANTHROPIC_API_KEY every agent uses its
// deterministic fallback, so the stage demo never depends on the network.
export const LLM_ENABLED = !!process.env.ANTHROPIC_API_KEY && process.env.DEMO_MODE !== "simulated";

let model: ChatAnthropic | null = null;

export async function llmText(system: string, user: string, fallback: string, timeoutMs = 12000): Promise<{ text: string; live: boolean }> {
  if (!LLM_ENABLED) return { text: fallback, live: false };
  try {
    model ??= new ChatAnthropic({ model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5", maxTokens: 400 });
    const res = await Promise.race([
      model.invoke([
        ["system", system],
        ["user", user],
      ]),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), timeoutMs)),
    ]);
    const text = typeof res.content === "string" ? res.content : res.content.map((c) => ("text" in c ? c.text : "")).join("");
    return text.trim() ? { text: text.trim(), live: true } : { text: fallback, live: false };
  } catch {
    return { text: fallback, live: false };
  }
}
